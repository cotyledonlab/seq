import React from 'react';
import { PATTERN_LENGTHS, type PatternLength } from '../models/sequence';

interface TransportControlsProps {
  isPlaying: boolean;
  isAudioReady: boolean;
  onPlayToggle: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  patternLength: PatternLength;
  onPatternLengthChange: (length: PatternLength) => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  isAudioReady,
  onPlayToggle,
  tempo,
  onTempoChange,
  patternLength,
  onPatternLengthChange,
}) => {
  const [isInitializing, setIsInitializing] = React.useState(false);

  const handlePlayClick = async () => {
    if (!isAudioReady && !isPlaying) {
      setIsInitializing(true);
    }
    await onPlayToggle();
    setIsInitializing(false);
  };

  const buttonLabel = isInitializing ? 'Starting...' : isPlaying ? 'Stop' : 'Play';

  return (
    <div className="panel transport">
      <button
        className={`transport-button ${isPlaying ? 'is-playing' : ''} ${isInitializing ? 'is-initializing' : ''}`}
        onClick={handlePlayClick}
        type="button"
        disabled={isInitializing}
        title="Space bar to toggle play/stop"
      >
        {buttonLabel}
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
            onChange={(e) => {
              const newLength = Number(e.target.value) as PatternLength;
              if (newLength !== patternLength) {
                if (window.confirm(`Change to ${newLength} steps? Playback position will reset.`)) {
                  onPatternLengthChange(newLength);
                } else {
                  // Reset the select to current value
                  e.target.value = String(patternLength);
                }
              }
            }}
            aria-label="Pattern length"
            title="Change pattern length - affects all tracks"
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
