import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import { StepGrid } from './components/StepGrid';
import { TransportControls } from './components/TransportControls';
import { MidiDeviceSelector } from './components/MidiDeviceSelector';
import { StepEditor } from './components/StepEditor';
import { ProjectControls } from './components/ProjectControls';
import { InstrumentRack } from './components/InstrumentRack';
import { MixerPanel } from './components/MixerPanel';
import {
  createDefaultProject,
  createInstrument,
  createTrackForInstrument,
  resizeSteps,
  type Instrument,
  type InstrumentParams,
  type InstrumentType,
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

type InstrumentNode = {
  synth: Tone.Synth | Tone.MonoSynth | Tone.MembraneSynth;
  gain: Tone.Gain;
  panner: Tone.Panner;
};

const createInstrumentNodes = (instrument: Instrument): InstrumentNode => {
  let synth: InstrumentNode['synth'];

  switch (instrument.type) {
    case 'drum':
      synth = new Tone.MembraneSynth();
      break;
    case 'bass':
      synth = new Tone.MonoSynth();
      break;
    case 'lead':
    case 'midi':
    default:
      synth = new Tone.Synth();
      break;
  }

  const panner = new Tone.Panner(instrument.params.pan ?? 0);
  const gain = new Tone.Gain(instrument.params.volume ?? 0.8);

  synth.connect(panner);
  panner.connect(gain);
  gain.toDestination();

  return { synth, gain, panner };
};

const applyInstrumentParams = (instrument: Instrument, node: InstrumentNode) => {
  const { volume, pan, attack, decay, sustain, release, oscillator } =
    instrument.params;

  node.gain.gain.value = volume;
  node.panner.pan.value = pan;

  if (node.synth instanceof Tone.MembraneSynth) {
    node.synth.set({
      envelope: { attack, decay, sustain, release },
    });
    return;
  }

  if (node.synth instanceof Tone.MonoSynth) {
    node.synth.set({
      oscillator: { type: oscillator },
      envelope: { attack, decay, sustain, release },
    });
    return;
  }

  if (node.synth instanceof Tone.Synth) {
    node.synth.set({
      oscillator: { type: oscillator },
      envelope: { attack, decay, sustain, release },
    });
  }
};

export const App: React.FC = () => {
  const [project, setProject] = useState(() => createDefaultProject());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [midiDeviceId, setMidiDeviceId] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(
    project.tracks[0]?.id ?? null
  );
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(0);
  const [savedProjects, setSavedProjects] = useState<StoredProjectSummary[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'saving'>('idle');
  const [isHydrated, setIsHydrated] = useState(false);
  const instrumentNodesRef = useRef<Map<string, InstrumentNode>>(new Map());
  const projectRef = useRef(project);
  const selectedTrackRef = useRef(selectedTrackId);
  const audioReadyRef = useRef(false);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    selectedTrackRef.current = selectedTrackId;
  }, [selectedTrackId]);

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

  const ensureInstrumentNodes = useCallback((instruments: Instrument[]) => {
    const nodes = instrumentNodesRef.current;
    const activeIds = new Set(instruments.map((instrument) => instrument.id));

    instruments.forEach((instrument) => {
      const existing = nodes.get(instrument.id);
      if (existing) {
        applyInstrumentParams(instrument, existing);
        return;
      }

      const created = createInstrumentNodes(instrument);
      applyInstrumentParams(instrument, created);
      nodes.set(instrument.id, created);
    });

    nodes.forEach((node, id) => {
      if (!activeIds.has(id)) {
        node.synth.dispose();
        node.gain.dispose();
        node.panner.dispose();
        nodes.delete(id);
      }
    });
  }, []);

  const ensureAudioReady = useCallback(async () => {
    if (audioReadyRef.current) {
      return;
    }
    await Tone.start();
    audioReadyRef.current = true;
    setIsAudioReady(true);
    ensureInstrumentNodes(projectRef.current.instruments);
  }, [ensureInstrumentNodes]);

  const togglePlay = async () => {
    await ensureAudioReady();
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

  const buildInstrumentName = (
    type: InstrumentType,
    instruments: Instrument[]
  ) => {
    const label =
      type === 'drum'
        ? 'Drums'
        : type === 'bass'
          ? 'Bass'
          : type === 'midi'
            ? 'Midi'
            : 'Lead';
    const count = instruments.filter((instrument) => instrument.type === type).length;
    return count === 0 ? label : `${label} ${count + 1}`;
  };

  const handleInstrumentAdd = (type: InstrumentType) => {
    const instrument = createInstrument({
      type,
      name: buildInstrumentName(type, project.instruments),
    });
    const track = createTrackForInstrument(project.patternLength, instrument);

    setProject((prev) => ({
      ...prev,
      instruments: [...prev.instruments, instrument],
      tracks: [...prev.tracks, track],
    }));
    setSelectedTrackId(track.id);
    setSelectedStepIndex(0);
  };

  const handleInstrumentRemove = (instrumentId: string) => {
    setProject((prev) => ({
      ...prev,
      instruments: prev.instruments.filter(
        (instrument) => instrument.id !== instrumentId
      ),
      tracks: prev.tracks.filter((track) => track.instrumentId !== instrumentId),
    }));
  };

  const handleInstrumentRename = (instrumentId: string, name: string) => {
    setProject((prev) => ({
      ...prev,
      instruments: prev.instruments.map((instrument) =>
        instrument.id === instrumentId ? { ...instrument, name } : instrument
      ),
      tracks: prev.tracks.map((track) =>
        track.instrumentId === instrumentId ? { ...track, name } : track
      ),
    }));
  };

  const handleInstrumentParamsChange = (
    instrumentId: string,
    updates: Partial<InstrumentParams>
  ) => {
    setProject((prev) => ({
      ...prev,
      instruments: prev.instruments.map((instrument) =>
        instrument.id === instrumentId
          ? { ...instrument, params: { ...instrument.params, ...updates } }
          : instrument
      ),
    }));
  };

  const handleInstrumentToggle = (instrumentId: string) => {
    setProject((prev) => ({
      ...prev,
      instruments: prev.instruments.map((instrument) =>
        instrument.id === instrumentId
          ? { ...instrument, enabled: !instrument.enabled }
          : instrument
      ),
    }));
  };

  const handleStepSelect = (trackId: string, stepIndex: number) => {
    setSelectedTrackId(trackId);
    setSelectedStepIndex(stepIndex);
  };

  const handleInstrumentSelect = (instrumentId: string) => {
    const track = project.tracks.find(
      (candidate) => candidate.instrumentId === instrumentId
    );
    if (track) {
      setSelectedTrackId(track.id);
      setSelectedStepIndex(0);
    }
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

  const handleStepPreview = async (trackId: string, stepIndex: number) => {
    await ensureAudioReady();
    const activeProject = projectRef.current;
    const track = activeProject.tracks.find((entry) => entry.id === trackId);
    if (!track) {
      return;
    }
    const instrument = activeProject.instruments.find(
      (entry) => entry.id === track.instrumentId
    );
    if (!instrument || !instrument.enabled) {
      return;
    }
    const nodes = instrumentNodesRef.current.get(instrument.id);
    if (!nodes) {
      return;
    }
    const step = track.steps[stepIndex];
    if (!step) {
      return;
    }

    const note = step.note ?? track.defaultNote;
    const duration = step.length || '16n';
    const velocity = Math.min(Math.max(step.velocity, 0), 1);
    const scheduledTime = Tone.now() + (step.microtiming || 0);
    const ratchetCount = Math.max(1, Math.round(step.ratchet || 1));
    const durationSeconds = Tone.Time(duration).toSeconds();
    const sliceSeconds =
      ratchetCount > 1 ? durationSeconds / ratchetCount : durationSeconds;

    for (let i = 0; i < ratchetCount; i += 1) {
      const offsetTime = scheduledTime + i * sliceSeconds;
      nodes.synth.triggerAttackRelease(note, sliceSeconds, offsetTime, velocity);
    }
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
            const activeProject = projectRef.current;
            const selectedTrack = activeProject.tracks.find(
              (track) => track.id === selectedTrackRef.current
            );
            if (!selectedTrack) {
              return;
            }
            const instrument = activeProject.instruments.find(
              (entry) => entry.id === selectedTrack.instrumentId
            );
            if (!instrument || !instrument.enabled) {
              return;
            }
            const nodes = instrumentNodesRef.current.get(instrument.id);
            if (!nodes) {
              return;
            }
            nodes.synth.triggerAttackRelease(
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

  useEffect(() => {
    if (!isAudioReady) {
      return;
    }
    ensureInstrumentNodes(project.instruments);
  }, [project.instruments, isAudioReady, ensureInstrumentNodes]);

  const instrumentById = useMemo(
    () => new Map(project.instruments.map((instrument) => [instrument.id, instrument])),
    [project.instruments]
  );

  const getInstrument = useCallback(
    (track: Track) => {
      const instrument = instrumentById.get(track.instrumentId);
      if (!instrument || !instrument.enabled) {
        return null;
      }
      const nodes = instrumentNodesRef.current.get(instrument.id);
      return nodes?.synth ?? null;
    },
    [instrumentById]
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
  const selectedInstrumentId =
    selectedTrack?.instrumentId ?? project.instruments[0]?.id ?? null;

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
          <InstrumentRack
            instruments={project.instruments}
            selectedInstrumentId={selectedInstrumentId}
            onSelectInstrument={handleInstrumentSelect}
            onAddInstrument={handleInstrumentAdd}
            onRemoveInstrument={handleInstrumentRemove}
            onRenameInstrument={handleInstrumentRename}
          />
          <MixerPanel
            instruments={project.instruments}
            tracks={project.tracks}
            selectedInstrumentId={selectedInstrumentId}
            onInstrumentParamsChange={handleInstrumentParamsChange}
            onInstrumentToggle={handleInstrumentToggle}
            onTrackMuteToggle={toggleTrackMute}
          />
          <StepEditor
            track={selectedTrack}
            stepIndex={selectedStepIndex}
            patternLength={project.patternLength}
            onStepChange={handleStepChange}
            onStepSelect={handleStepSelect}
            onStepPreview={handleStepPreview}
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
