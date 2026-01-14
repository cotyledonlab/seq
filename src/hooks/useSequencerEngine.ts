import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import type { Track } from '../models/sequence';

type TrackInstrument = Tone.Synth | Tone.MonoSynth | Tone.MembraneSynth;

interface SequencerEngineOptions {
  tracks: Track[];
  patternLength: number;
  tempo: number;
  isPlaying: boolean;
  onStep: (stepIndex: number) => void;
  getInstrument: (track: Track) => TrackInstrument | null;
}

export const useSequencerEngine = ({
  tracks,
  patternLength,
  tempo,
  isPlaying,
  onStep,
  getInstrument,
}: SequencerEngineOptions) => {
  const tracksRef = useRef(tracks);
  const patternLengthRef = useRef(patternLength);
  const onStepRef = useRef(onStep);
  const getInstrumentRef = useRef(getInstrument);
  const stepRef = useRef(0);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    patternLengthRef.current = patternLength;
  }, [patternLength]);

  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  useEffect(() => {
    getInstrumentRef.current = getInstrument;
  }, [getInstrument]);

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  useEffect(() => {
    if (!isPlaying) {
      Tone.Transport.stop();
      stepRef.current = 0;
      onStepRef.current(0);
      return;
    }

    const loop = new Tone.Loop((time) => {
      const length = patternLengthRef.current;
      const stepIndex = stepRef.current % length;
      const currentTracks = tracksRef.current;

      currentTracks.forEach((track) => {
        if (track.muted) {
          return;
        }

        const step = track.steps[stepIndex];
        if (!step?.active) {
          return;
        }

        if (step.probability < 1 && Math.random() > step.probability) {
          return;
        }

        const instrument = getInstrumentRef.current(track);
        if (!instrument) {
          return;
        }

        const note = step.note ?? track.defaultNote;
        const duration = step.length || '16n';
        const velocity = Math.min(Math.max(step.velocity, 0), 1);
        const scheduledTime = time + (step.microtiming || 0);

        instrument.triggerAttackRelease(note, duration, scheduledTime, velocity);
      });

      onStepRef.current(stepIndex);
      stepRef.current = (stepIndex + 1) % length;
    }, '16n');

    loop.start(0);
    Tone.Transport.start();

    return () => {
      loop.stop();
      loop.dispose();
      Tone.Transport.stop();
      stepRef.current = 0;
      onStepRef.current(0);
    };
  }, [isPlaying]);
};
