import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

interface SynthesizerProps {
  synth: Tone.Synth;
  receiveMidiInput?: boolean;
}

type OscillatorType = "sine" | "square" | "triangle" | "sawtooth";

export const Synthesizer: React.FC<SynthesizerProps> = ({ synth }) => {
  const [oscType, setOscType] = useState<OscillatorType>("sine");
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.5);
  const [filterFreq, setFilterFreq] = useState(2000);
  const [filterQ, setFilterQ] = useState(1);

  useEffect(() => {
    synth.set({
      oscillator: {
        type: oscType,
      } as Partial<Tone.OmniOscillatorOptions>,
      envelope: { attack, decay, sustain, release },
    });
  }, [oscType, attack, decay, sustain, release, synth]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Synthesizer</h2>
      
      <div className="space-y-2">
        <label className="block text-white">
          Oscillator Type
          <select
            value={oscType}
            onChange={(e) => setOscType(e.target.value as OscillatorType)}
            className="w-full bg-gray-700 text-white p-2 rounded"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="sawtooth">Sawtooth</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-white">
            Attack
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={attack}
              onChange={(e) => setAttack(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block text-white">
            Decay
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={decay}
              onChange={(e) => setDecay(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block text-white">
            Sustain
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sustain}
              onChange={(e) => setSustain(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block text-white">
            Release
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={release}
              onChange={(e) => setRelease(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-white">
            Filter Frequency
            <input
              type="range"
              min="20"
              max="20000"
              step="1"
              value={filterFreq}
              onChange={(e) => setFilterFreq(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block text-white">
            Filter Q
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={filterQ}
              onChange={(e) => setFilterQ(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
