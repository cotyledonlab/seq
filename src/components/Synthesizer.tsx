import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

interface SynthesizerProps {
  synth: Tone.Synth | null;
  receiveMidiInput?: boolean;
}

type OscillatorType = "sine" | "square" | "triangle" | "sawtooth";

export const Synthesizer: React.FC<SynthesizerProps> = ({ synth, receiveMidiInput }) => {
  const [oscType, setOscType] = useState<OscillatorType>("sine");
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.5);
  const [filterFreq, setFilterFreq] = useState(2000);
  const [filterQ, setFilterQ] = useState(1);
  const isDisabled = !synth;

  useEffect(() => {
    if (!synth) {
      return;
    }
    synth.set({
      oscillator: {
        type: oscType,
      } as Partial<Tone.OmniOscillatorOptions>,
      envelope: { attack, decay, sustain, release },
    });
  }, [oscType, attack, decay, sustain, release, synth]);

  return (
    <div className="panel synth">
      <div className="panel-header">
        <div>
          <h2>Synthesizer</h2>
          <span className="panel-subtitle">
            {isDisabled ? 'Press play to enable audio' : 'Lead voice controls'}
          </span>
        </div>
        <span className={`panel-chip ${receiveMidiInput ? 'is-on' : ''}`}>
          Midi {receiveMidiInput ? 'on' : 'off'}
        </span>
      </div>

      <div className="panel-grid" aria-disabled={isDisabled}>
        <label className="control">
          <span>Oscillator</span>
          <select
            value={oscType}
            onChange={(e) => setOscType(e.target.value as OscillatorType)}
            disabled={isDisabled}
          >
            {['sine', 'square', 'triangle', 'sawtooth'].map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="control-grid" aria-disabled={isDisabled}>
        {[
          { label: 'Attack', value: attack, setValue: setAttack, max: 2 },
          { label: 'Decay', value: decay, setValue: setDecay, max: 2 },
          { label: 'Sustain', value: sustain, setValue: setSustain, max: 1 },
          { label: 'Release', value: release, setValue: setRelease, max: 2 },
        ].map(({ label, value, setValue, max }) => (
          <label key={label} className="control">
            <span>{label}</span>
            <input
              type="range"
              min="0"
              max={max}
              step="0.01"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={isDisabled}
            />
            <strong>{value.toFixed(2)}</strong>
          </label>
        ))}
      </div>

      <div className="control-grid" aria-disabled={isDisabled}>
        {[
          {
            label: 'Filter Freq',
            value: filterFreq,
            setValue: setFilterFreq,
            min: 20,
            max: 20000,
            step: 1,
            unit: 'Hz',
          },
          {
            label: 'Filter Q',
            value: filterQ,
            setValue: setFilterQ,
            min: 0,
            max: 10,
            step: 0.1,
            unit: '',
          },
        ].map(({ label, value, setValue, min, max, step, unit }) => (
          <label key={label} className="control">
            <span>{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={isDisabled}
            />
            <strong>
              {value.toFixed(1)}
              {unit}
            </strong>
          </label>
        ))}
      </div>
    </div>
  );
};
