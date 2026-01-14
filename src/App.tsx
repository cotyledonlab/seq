import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { StepGrid } from './components/StepGrid';
import { TransportControls } from './components/TransportControls';
import { MidiDeviceSelector } from './components/MidiDeviceSelector';
import { Synthesizer } from './components/Synthesizer';
import {
  createDefaultProject,
  resizeSteps,
  type PatternLength,
  type Track,
} from './models/sequence';
import { useSequencerEngine } from './hooks/useSequencerEngine';

export const App: React.FC = () => {
  const [project, setProject] = useState(() => createDefaultProject());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiDeviceId, setMidiDeviceId] = useState<string>('');
  const leadSynthRef = useRef(new Tone.Synth().toDestination());
  const bassSynthRef = useRef(new Tone.MonoSynth().toDestination());
  const drumSynthRef = useRef(new Tone.MembraneSynth().toDestination());

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
  };

  const togglePlay = async () => {
    await Tone.start();
    setIsPlaying((prev) => !prev);
  };

  const handleMidiDeviceSelect = (deviceId: string) => {
    setMidiDeviceId(deviceId);
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

  return (
    <div className="app-container">
      <h1>SEQ Groovebox</h1>
      <div className="controls-container">
        <MidiDeviceSelector onDeviceSelect={handleMidiDeviceSelect} />
        <TransportControls
          isPlaying={isPlaying}
          onPlayToggle={togglePlay}
          tempo={project.bpm}
          onTempoChange={handleTempoChange}
          patternLength={project.patternLength}
          onPatternLengthChange={handlePatternLengthChange}
        />
        <Synthesizer 
          synth={leadSynthRef.current}
          receiveMidiInput={!!midiDeviceId}
        />
        <StepGrid
          tracks={project.tracks}
          currentStep={currentStep}
          patternLength={project.patternLength}
          onStepToggle={toggleStep}
          onTrackMuteToggle={toggleTrackMute}
        />
      </div>
    </div>
  );
};

export default App;
