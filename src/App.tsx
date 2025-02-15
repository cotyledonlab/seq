import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { StepGrid } from './components/StepGrid';
import { TransportControls } from './components/TransportControls';
import { MidiDeviceSelector } from './components/MidiDeviceSelector';
import { Synthesizer } from './components/Synthesizer';

export const App: React.FC = () => {
  const [steps, setSteps] = useState<boolean[]>(new Array(16).fill(false));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [midiDeviceId, setMidiDeviceId] = useState<string>('');
  const synthRef = useRef(new Tone.Synth().toDestination());

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const toggleStep = (step: number) => {
    const newSteps = [...steps];
    newSteps[step] = !newSteps[step];
    setSteps(newSteps);
  };

  const togglePlay = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.stop();
      setCurrentStep(0);
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMidiDeviceSelect = (deviceId: string) => {
    setMidiDeviceId(deviceId);
    if (deviceId) {
      navigator.requestMIDIAccess().then(access => {
        const device = access.inputs.get(deviceId);
        if (device) {
          device.onmidimessage = (message) => {
            if (message.data && message.data[0] === 0x90) { // Note On
              synthRef.current.triggerAttackRelease(
                Tone.Frequency(message.data[1], "midi").toString(), 
                "8n"
              );
            }
          };
        }
      });
    }
  };

  useEffect(() => {
    const loop = new Tone.Loop((time) => {
      setCurrentStep((prev) => (prev + 1) % 16);
      if (steps[currentStep]) {
        synthRef.current.triggerAttackRelease('C4', '8n', time);
      }
    }, '16n');

    if (isPlaying) {
      loop.start(0);
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying, steps, currentStep]);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-white">MIDI Sequencer</h1>
      <div className="space-y-4">
        <MidiDeviceSelector onDeviceSelect={handleMidiDeviceSelect} />
        <TransportControls
          isPlaying={isPlaying}
          onPlayToggle={togglePlay}
          tempo={tempo}
          onTempoChange={setTempo}
        />
        <Synthesizer 
          synth={synthRef.current}
          receiveMidiInput={!!midiDeviceId}
        />
        <StepGrid
          steps={steps}
          currentStep={currentStep}
          onStepToggle={toggleStep}
        />
      </div>
    </div>
  );
};

export default App;
