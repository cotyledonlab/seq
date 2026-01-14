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
    <div className="panel transport">
      <button
        className={`transport-button ${isPlaying ? 'is-playing' : ''}`}
        onClick={onPlayToggle}
        type="button"
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <div className="transport-fields">
        <label className="control">
          <span>Tempo</span>
          <div className="inline-field">
            <input
              type="number"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => onTempoChange(Number(e.target.value))}
              title="Tempo"
              placeholder="Enter tempo"
            />
            <strong>BPM</strong>
          </div>
        </label>
        <label className="control">
          <span>Steps</span>
          <select
            value={patternLength}
            onChange={(e) =>
              onPatternLengthChange(Number(e.target.value) as PatternLength)
            }
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
    </div>
  );
};
