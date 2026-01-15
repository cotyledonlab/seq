import React, { useState } from 'react';
import {
  INSTRUMENT_TYPES,
  type Instrument,
  type InstrumentType,
} from '../models/sequence';

interface InstrumentRackProps {
  instruments: Instrument[];
  selectedInstrumentId: string | null;
  onSelectInstrument: (instrumentId: string) => void;
  onAddInstrument: (type: InstrumentType) => void;
  onRemoveInstrument: (instrumentId: string) => void;
  onRenameInstrument: (instrumentId: string, name: string) => void;
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
  onSelectInstrument,
  onAddInstrument,
  onRemoveInstrument,
  onRenameInstrument,
}) => {
  const [newInstrumentType, setNewInstrumentType] =
    useState<InstrumentType>('lead');

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
        {instruments.map((instrument) => (
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
                onClick={() => onRemoveInstrument(instrument.id)}
                disabled={instruments.length <= 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
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
