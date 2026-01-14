import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { StepGrid } from './components/StepGrid';
import { TransportControls } from './components/TransportControls';
import { MidiDeviceSelector } from './components/MidiDeviceSelector';
import { Synthesizer } from './components/Synthesizer';
import { StepEditor } from './components/StepEditor';
import { ProjectControls } from './components/ProjectControls';
import {
  createDefaultProject,
  resizeSteps,
  type PatternLength,
  type Track,
} from './models/sequence';
import { useSequencerEngine } from './hooks/useSequencerEngine';
import {
  listStoredProjects,
  loadProjectById,
  loadProjectStore,
  saveProjectToStore,
  type StoredProjectSummary,
  importProjectPayload,
} from './storage/projects';

export const App: React.FC = () => {
  const [project, setProject] = useState(() => createDefaultProject());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiDeviceId, setMidiDeviceId] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(
    project.tracks[0]?.id ?? null
  );
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(0);
  const [savedProjects, setSavedProjects] = useState<StoredProjectSummary[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'saving'>('idle');
  const [isHydrated, setIsHydrated] = useState(false);
  const leadSynthRef = useRef<Tone.Synth | null>(null);
  const bassSynthRef = useRef<Tone.MonoSynth | null>(null);
  const drumSynthRef = useRef<Tone.MembraneSynth | null>(null);

  const toggleStep = (trackId: string, stepIndex: number) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => {
        if (track.id !== trackId) {
          return track;
        }

        const steps = [...track.steps];
        const existing = steps[stepIndex];
        steps[stepIndex] = { ...existing, active: !existing.active };

        return { ...track, steps };
      }),
    }));
  };

  const toggleTrackMute = (trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) =>
        track.id === trackId ? { ...track, muted: !track.muted } : track
      ),
    }));
  };

  const handleTempoChange = (tempo: number) => {
    setProject((prev) => ({ ...prev, bpm: tempo }));
  };

  const handleProjectNameChange = (name: string) => {
    setProject((prev) => ({ ...prev, name }));
  };

  const handlePatternLengthChange = (length: PatternLength) => {
    setProject((prev) => ({
      ...prev,
      patternLength: length,
      tracks: prev.tracks.map((track) => ({
        ...track,
        steps: resizeSteps(track.steps, length),
      })),
    }));
    setCurrentStep(0);
    setSelectedStepIndex(0);
  };

  const togglePlay = async () => {
    await Tone.start();
    if (!leadSynthRef.current) {
      leadSynthRef.current = new Tone.Synth().toDestination();
    }
    if (!bassSynthRef.current) {
      bassSynthRef.current = new Tone.MonoSynth().toDestination();
    }
    if (!drumSynthRef.current) {
      drumSynthRef.current = new Tone.MembraneSynth().toDestination();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleMidiDeviceSelect = (deviceId: string) => {
    setMidiDeviceId(deviceId);
  };

  const handleNewProject = () => {
    setProject(createDefaultProject());
    setSelectedStepIndex(0);
  };

  const handleSaveNow = () => {
    saveProjectToStore(project);
    setSavedProjects(listStoredProjects());
    setLastSavedAt(new Date());
    setAutosaveState('idle');
  };

  const handleLoadProject = (projectId: string) => {
    const loaded = loadProjectById(projectId);
    if (loaded) {
      setProject(loaded);
    }
  };

  const handleExportProject = () => {
    const payload = JSON.stringify(project, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name || 'seq-project'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = async (file: File) => {
    const text = await file.text();
    const loaded = importProjectPayload(text);
    if (loaded) {
      setProject(loaded);
    }
  };

  const handleStepSelect = (trackId: string, stepIndex: number) => {
    setSelectedTrackId(trackId);
    setSelectedStepIndex(stepIndex);
  };

  const handleStepChange = (
    trackId: string,
    stepIndex: number,
    updates: Partial<Track['steps'][number]>
  ) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => {
        if (track.id !== trackId) {
          return track;
        }

        const steps = [...track.steps];
        const existing = steps[stepIndex];
        if (!existing) {
          return track;
        }
        steps[stepIndex] = { ...existing, ...updates };

        return { ...track, steps };
      }),
    }));
  };

  useEffect(() => {
    let activeInput: MIDIInput | null = null;
    let cancelled = false;

    const attachMidi = async () => {
      if (!midiDeviceId) {
        return;
      }

      try {
        const access = await navigator.requestMIDIAccess();
        if (cancelled) {
          return;
        }
        const device = access.inputs.get(midiDeviceId);
        if (!device) {
          return;
        }
        activeInput = device;
        device.onmidimessage = (message) => {
          const [status, note, velocity] = message.data || [];
          if (status === 0x90 && velocity > 0) {
            if (!leadSynthRef.current) {
              return;
            }
            leadSynthRef.current.triggerAttackRelease(
              Tone.Frequency(note, 'midi').toString(),
              '8n',
              undefined,
              velocity / 127
            );
          }
        };
      } catch (error) {
        console.error('MIDI access failed:', error);
      }
    };

    attachMidi();

    return () => {
      cancelled = true;
      if (activeInput) {
        activeInput.onmidimessage = null;
      }
    };
  }, [midiDeviceId]);

  const getInstrument = useCallback(
    (track: Track) => {
      switch (track.type) {
        case 'drum':
          return drumSynthRef.current;
        case 'bass':
          return bassSynthRef.current;
        case 'lead':
        default:
          return leadSynthRef.current;
      }
    },
    []
  );

  useSequencerEngine({
    tracks: project.tracks,
    patternLength: project.patternLength,
    tempo: project.bpm,
    isPlaying,
    onStep: setCurrentStep,
    getInstrument,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const store = loadProjectStore();
    if (store?.lastOpenedId) {
      const loaded = loadProjectById(store.lastOpenedId);
      if (loaded) {
        setProject(loaded);
      }
    }
    setSavedProjects(listStoredProjects());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setAutosaveState('saving');
    const handle = window.setTimeout(() => {
      saveProjectToStore(project);
      setSavedProjects(listStoredProjects());
      setLastSavedAt(new Date());
      setAutosaveState('idle');
    }, 700);

    return () => {
      window.clearTimeout(handle);
    };
  }, [project, isHydrated]);

  useEffect(() => {
    setSelectedTrackId((prev) => {
      if (prev && project.tracks.some((track) => track.id === prev)) {
        return prev;
      }
      return project.tracks[0]?.id ?? null;
    });
  }, [project.tracks]);

  useEffect(() => {
    if (
      selectedStepIndex !== null &&
      selectedStepIndex >= project.patternLength
    ) {
      setSelectedStepIndex(0);
    }
  }, [project.patternLength, selectedStepIndex]);

  const selectedTrack =
    project.tracks.find((track) => track.id === selectedTrackId) ?? null;

  const autosaveLabel = lastSavedAt
    ? `${autosaveState === 'saving' ? 'Saving' : 'Autosaved'} • ${lastSavedAt.toLocaleTimeString()}`
    : autosaveState === 'saving'
      ? 'Saving…'
      : 'Not saved yet';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Browser groovebox</p>
          <h1>SEQ Groovebox</h1>
          <p className="tagline">
            Sculpt drum, bass, and lead patterns with per-step feel controls.
          </p>
        </div>
        <div className="status-pill">
          <span>{project.patternLength} steps</span>
          <span className="dot" />
          <span>{project.bpm} bpm</span>
        </div>
      </header>

      <section className="control-bar">
        <MidiDeviceSelector onDeviceSelect={handleMidiDeviceSelect} />
        <TransportControls
          isPlaying={isPlaying}
          onPlayToggle={togglePlay}
          tempo={project.bpm}
          onTempoChange={handleTempoChange}
          patternLength={project.patternLength}
          onPatternLengthChange={handlePatternLengthChange}
        />
      </section>

      <section className="app-main">
        <div className="stack">
          <ProjectControls
            projectName={project.name}
            autosaveLabel={autosaveLabel}
            savedProjects={savedProjects}
            onProjectNameChange={handleProjectNameChange}
            onNewProject={handleNewProject}
            onSaveNow={handleSaveNow}
            onLoadProject={handleLoadProject}
            onExportProject={handleExportProject}
            onImportProject={handleImportProject}
          />
          <Synthesizer 
            synth={leadSynthRef.current}
            receiveMidiInput={!!midiDeviceId}
          />
          <StepEditor
            track={selectedTrack}
            stepIndex={selectedStepIndex}
            onStepChange={handleStepChange}
          />
        </div>
        <div className="grid-panel">
          <StepGrid
            tracks={project.tracks}
            currentStep={currentStep}
            patternLength={project.patternLength}
            onStepToggle={toggleStep}
            onTrackMuteToggle={toggleTrackMute}
            selectedTrackId={selectedTrackId}
            selectedStepIndex={selectedStepIndex}
            onStepSelect={handleStepSelect}
          />
        </div>
      </section>
    </div>
  );
};

export default App;
