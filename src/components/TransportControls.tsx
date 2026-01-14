import React from 'react';
import { PATTERN_LENGTHS, type PatternLength } from '../models/sequence';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  patternLength: PatternLength;
  onPatternLengthChange: (length: PatternLength) => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  onPlayToggle,
  tempo,
  onTempoChange,
  patternLength,
  onPatternLengthChange,
}) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <button
        className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`}
        onClick={onPlayToggle}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => onTempoChange(Number(e.target.value))}
          className="w-20 p-2 border rounded"
          title="Tempo"
          placeholder="Enter tempo"
        />
        <span>BPM</span>
      </div>
      <label className="flex items-center gap-2">
        <span>Steps</span>
        <select
          value={patternLength}
          onChange={(e) => onPatternLengthChange(Number(e.target.value) as PatternLength)}
          className="p-2 border rounded"
          aria-label="Pattern length"
        >
          {PATTERN_LENGTHS.map((length) => (
            <option key={length} value={length}>
              {length}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
