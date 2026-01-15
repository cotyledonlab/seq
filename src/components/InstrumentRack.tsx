import React, { useMemo, useState } from 'react';
import {
  INSTRUMENT_TYPES,
  type Instrument,
  type InstrumentParams,
  type InstrumentType,
  type Track,
} from '../models/sequence';

interface InstrumentRackProps {
  instruments: Instrument[];
  selectedInstrumentId: string | null;
  tracks: Track[];
  onSelectInstrument: (instrumentId: string) => void;
  onAddInstrument: (type: InstrumentType) => void;
  onRemoveInstrument: (instrumentId: string) => void;
  onRenameInstrument: (instrumentId: string, name: string) => void;
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

export const InstrumentRack: React.FC<InstrumentRackProps> = ({
  instruments,
  selectedInstrumentId,
  tracks,
  onSelectInstrument,
  onAddInstrument,
  onRemoveInstrument,
  onRenameInstrument,
  onInstrumentParamsChange,
  onInstrumentToggle,
  onTrackMuteToggle,
}) => {
  const [newInstrumentType, setNewInstrumentType] =
    useState<InstrumentType>('lead');
  const [expandedInstrumentId, setExpandedInstrumentId] = useState<string | null>(
    selectedInstrumentId
  );

  const trackByInstrument = useMemo(() => {
    const map = new Map<string, Track>();
    tracks.forEach((track) => map.set(track.instrumentId, track));
    return map;
  }, [tracks]);

  const toggleExpanded = (instrumentId: string) => {
    setExpandedInstrumentId((prev) =>
      prev === instrumentId ? null : instrumentId
    );
  };

  return (
    <div className="panel instrument-rack">
      <div className="panel-header">
        <div>
          <h2>Instrument Rack</h2>
          <span className="panel-subtitle">Create lanes and manage voices</span>
        </div>
        <span className="panel-chip">{instruments.length} voices</span>
      </div>

      <div className="rack-list">
        {instruments.map((instrument) => {
          const track = trackByInstrument.get(instrument.id);
          const isExpanded = expandedInstrumentId === instrument.id;
          const isMuted = track?.muted ?? false;

          return (
            <div
              key={instrument.id}
              className={`rack-item ${
                selectedInstrumentId === instrument.id ? 'is-selected' : ''
              }`}
            >
            <div className="rack-info">
              <label className="control rack-control">
                <span>Name</span>
                <input
                  type="text"
                  value={instrument.name}
                  onChange={(event) =>
                    onRenameInstrument(instrument.id, event.target.value)
                  }
                />
              </label>
              <span className="rack-type">{labelForType(instrument.type)}</span>
            </div>
            <div className="rack-actions">
              <button
                type="button"
                className={`action-button ${instrument.enabled ? 'primary' : 'ghost'}`}
                onClick={() => onInstrumentToggle(instrument.id)}
              >
                {instrument.enabled ? 'Enabled' : 'Muted'}
              </button>
              <button
                type="button"
                className={`action-button ghost ${
                  selectedInstrumentId === instrument.id ? 'is-active' : ''
                }`}
                onClick={() => onSelectInstrument(instrument.id)}
              >
                Focus
              </button>
              <button
                type="button"
                className="action-button ghost"
                onClick={() => toggleExpanded(instrument.id)}
              >
                {isExpanded ? 'Hide Mix' : 'Mix'}
              </button>
              <button
                type="button"
                className="action-button ghost"
                onClick={() => onRemoveInstrument(instrument.id)}
                disabled={instruments.length <= 1}
              >
                Remove
              </button>
            </div>
            {isExpanded ? (
              <div className="rack-mixer" aria-disabled={!instrument.enabled}>
                <div className="rack-mixer-row">
                  <label className="control">
                    <span>Volume</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={instrument.params.volume}
                      disabled={!instrument.enabled}
                      onChange={(event) =>
                        onInstrumentParamsChange(instrument.id, {
                          volume: Number(event.target.value),
                        })
                      }
                    />
                    <strong>{Math.round(instrument.params.volume * 100)}%</strong>
                  </label>
                  <label className="control">
                    <span>Pan</span>
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.01}
                      value={instrument.params.pan}
                      disabled={!instrument.enabled}
                      onChange={(event) =>
                        onInstrumentParamsChange(instrument.id, {
                          pan: Number(event.target.value),
                        })
                      }
                    />
                    <strong>{instrument.params.pan.toFixed(2)}</strong>
                  </label>
                  {instrument.type !== 'drum' ? (
                    <label className="control">
                      <span>Oscillator</span>
                      <select
                        value={instrument.params.oscillator}
                        disabled={!instrument.enabled}
                        onChange={(event) =>
                          onInstrumentParamsChange(instrument.id, {
                            oscillator:
                              event.target.value as InstrumentParams['oscillator'],
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
                <div className="rack-mixer-row">
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
                        value={instrument.params[key]}
                        disabled={!instrument.enabled}
                        onChange={(event) =>
                          onInstrumentParamsChange(instrument.id, {
                            [key]: Number(event.target.value),
                          })
                        }
                      />
                      <strong>{instrument.params[key].toFixed(2)}</strong>
                    </label>
                  ))}
                </div>
                {track ? (
                  <div className="rack-mixer-actions">
                    <button
                      type="button"
                      className="action-button ghost"
                      onClick={() => onTrackMuteToggle(track.id)}
                    >
                      {isMuted ? 'Muted' : 'Mute'}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          );
        })}
      </div>

      <div className="rack-footer">
        <label className="control">
          <span>New Instrument</span>
          <select
            value={newInstrumentType}
            onChange={(event) =>
              setNewInstrumentType(event.target.value as InstrumentType)
            }
          >
            {INSTRUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {labelForType(type)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="action-button primary"
          onClick={() => onAddInstrument(newInstrumentType)}
        >
          Add Instrument
        </button>
      </div>
    </div>
  );
};
