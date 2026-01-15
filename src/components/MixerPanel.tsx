import React, { useMemo } from 'react';
import type {
  Instrument,
  InstrumentParams,
  InstrumentType,
  Track,
} from '../models/sequence';

interface MixerPanelProps {
  instruments: Instrument[];
  tracks: Track[];
  selectedInstrumentId: string | null;
  onInstrumentParamsChange: (
    instrumentId: string,
    updates: Partial<InstrumentParams>
  ) => void;
  onInstrumentToggle: (instrumentId: string) => void;
  onTrackMuteToggle: (trackId: string) => void;
}

const labelForType = (type: InstrumentType) => {
  switch (type) {
    case 'drum':
      return 'Drum';
    case 'bass':
      return 'Bass';
    case 'midi':
      return 'Midi';
    case 'lead':
    default:
      return 'Lead';
  }
};

export const MixerPanel: React.FC<MixerPanelProps> = ({
  instruments,
  tracks,
  selectedInstrumentId,
  onInstrumentParamsChange,
  onInstrumentToggle,
  onTrackMuteToggle,
}) => {
  const trackByInstrument = useMemo(() => {
    const map = new Map<string, Track>();
    tracks.forEach((track) => map.set(track.instrumentId, track));
    return map;
  }, [tracks]);

  return (
    <div className="panel mixer-panel">
      <div className="panel-header">
        <div>
          <h2>Mixer</h2>
          <span className="panel-subtitle">
            Shape each instrument and balance the groove
          </span>
        </div>
        <span className="panel-chip">Signal Flow</span>
      </div>

      <div className="mixer-grid">
        {instruments.map((instrument) => {
          const track = trackByInstrument.get(instrument.id);
          const isSelected = selectedInstrumentId === instrument.id;
          const params = instrument.params;
          const isDisabled = !instrument.enabled;

          return (
            <div
              key={instrument.id}
              className={`mixer-channel ${isSelected ? 'is-selected' : ''}`}
            >
              <div className="channel-header">
                <div>
                  <h3>{instrument.name}</h3>
                  <span className="panel-subtitle">
                    {labelForType(instrument.type)}
                  </span>
                </div>
                <button
                  type="button"
                  className={`action-button ${
                    instrument.enabled ? 'primary' : 'ghost'
                  }`}
                  onClick={() => onInstrumentToggle(instrument.id)}
                >
                  {instrument.enabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              <div className="channel-controls" aria-disabled={isDisabled}>
                <label className="control">
                  <span>Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={params.volume}
                    disabled={isDisabled}
                    onChange={(event) =>
                      onInstrumentParamsChange(instrument.id, {
                        volume: Number(event.target.value),
                      })
                    }
                  />
                  <strong>{Math.round(params.volume * 100)}%</strong>
                </label>

                <label className="control">
                  <span>Pan</span>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={params.pan}
                    disabled={isDisabled}
                    onChange={(event) =>
                      onInstrumentParamsChange(instrument.id, {
                        pan: Number(event.target.value),
                      })
                    }
                  />
                  <strong>{params.pan.toFixed(2)}</strong>
                </label>

                {instrument.type !== 'drum' ? (
                  <label className="control">
                    <span>Oscillator</span>
                    <select
                      value={params.oscillator}
                      disabled={isDisabled}
                      onChange={(event) =>
                        onInstrumentParamsChange(instrument.id, {
                          oscillator: event.target.value as InstrumentParams['oscillator'],
                        })
                      }
                    >
                      {['sine', 'square', 'triangle', 'sawtooth'].map((type) => (
                        <option key={type} value={type}>
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>

              <div className="channel-controls" aria-disabled={isDisabled}>
                {([
                  { key: 'attack', label: 'Attack', max: 2 },
                  { key: 'decay', label: 'Decay', max: 2 },
                  { key: 'sustain', label: 'Sustain', max: 1 },
                  { key: 'release', label: 'Release', max: 2 },
                ] as const).map(({ key, label, max }) => (
                  <label key={key} className="control">
                    <span>{label}</span>
                    <input
                      type="range"
                      min={0}
                      max={max}
                      step={0.01}
                      value={params[key]}
                      disabled={isDisabled}
                      onChange={(event) =>
                        onInstrumentParamsChange(instrument.id, {
                          [key]: Number(event.target.value),
                        })
                      }
                    />
                    <strong>{params[key].toFixed(2)}</strong>
                  </label>
                ))}
              </div>

              <div className="channel-actions">
                {track ? (
                  <button
                    type="button"
                    className={`action-button ghost ${
                      track.muted ? 'is-active' : ''
                    }`}
                    onClick={() => onTrackMuteToggle(track.id)}
                  >
                    {track.muted ? 'Muted' : 'Mute'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
