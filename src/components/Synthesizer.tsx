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
    <div className="synth-container">
      <div className="synth-grid" />
      <div className="relative z-10">
        <h2 className="neon-text text-3xl text-transparent bg-clip-text bg-gradient-to-r 
                      from-cyan-400 to-purple-500 mb-8 animate-pulse">
          SYNTHESIZER
        </h2>
        
        <div className="space-y-8">
          <div className="relative group">
            <select
              value={oscType}
              onChange={(e) => setOscType(e.target.value as OscillatorType)}
              className="w-full bg-black/80 text-cyan-400 p-4 rounded-lg 
                       border-2 border-cyan-500/50 
                       appearance-none cursor-pointer transition-all duration-300
                       focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.5)]
                       hover:border-cyan-400 backdrop-blur-sm"
            >
              {["sine", "square", "triangle", "sawtooth"].map(type => (
                <option key={type} value={type} className="bg-gray-900">
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400">▼</div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {[
              { label: "ATTACK", value: attack, setValue: setAttack, max: 2 },
              { label: "DECAY", value: decay, setValue: setDecay, max: 2 },
              { label: "SUSTAIN", value: sustain, setValue: setSustain, max: 1 },
              { label: "RELEASE", value: release, setValue: setRelease, max: 2 }
            ].map(({ label, value, setValue, max }) => (
              <div key={label} className="group space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-cyan-500 tracking-widest neon-text">{label}</span>
                  <span className="text-xs font-mono text-purple-400">{value.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={max}
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="synth-slider w-full"
                />
              </div>
            ))}
          </div>

          <div className="space-y-6 border-t-2 border-cyan-500/20 pt-6">
            {[
              { label: "FILTER FREQ", value: filterFreq, setValue: setFilterFreq, min: 20, max: 20000, step: 1, unit: "Hz" },
              { label: "FILTER Q", value: filterQ, setValue: setFilterQ, min: 0, max: 10, step: 0.1, unit: "" }
            ].map(({ label, value, setValue, min, max, step, unit }) => (
              <div key={label} className="group space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-cyan-500 tracking-widest neon-text">{label}</span>
                  <span className="text-xs font-mono text-purple-400">{value.toFixed(1)}{unit}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="synth-slider w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
