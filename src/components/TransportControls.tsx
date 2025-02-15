import React from 'react';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  onPlayToggle,
  tempo,
  onTempoChange,
}) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <button
        className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`}
        onClick={onPlayToggle}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
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
  );
};
