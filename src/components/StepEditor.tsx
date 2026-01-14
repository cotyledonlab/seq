import React from 'react';
import {
  RATCHET_OPTIONS,
  STEP_LENGTHS,
  type Step,
  type Track,
} from '../models/sequence';

interface StepEditorProps {
  track: Track | null;
  stepIndex: number | null;
  onStepChange: (trackId: string, stepIndex: number, updates: Partial<Step>) => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({
  track,
  stepIndex,
  onStepChange,
}) => {
  if (!track || stepIndex === null) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Step Editor</h3>
        </div>
        <p className="panel-empty">Select a step to edit its feel and timing.</p>
      </div>
    );
  }

  const step = track.steps[stepIndex];
  if (!step) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Step Editor</h3>
        </div>
        <p className="panel-empty">Select a step inside the current pattern length.</p>
      </div>
    );
  }

  const microtimingMs = Math.round(step.microtiming * 1000);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Step Editor</h3>
          <span className="panel-subtitle">
            {track.name} · Step {stepIndex + 1} · {step.active ? 'On' : 'Off'}
          </span>
        </div>
        <span className="panel-chip">{track.type.toUpperCase()}</span>
      </div>

      <div className="panel-grid">
        <label className="control">
          <span>Note</span>
          <input
            type="text"
            value={step.note ?? ''}
            placeholder={track.defaultNote}
            aria-label="Note"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                note: event.target.value.trim() || undefined,
              })
            }
          />
        </label>

        <label className="control">
          <span>Length</span>
          <select
            value={step.length}
            aria-label="Length"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                length: event.target.value as Step['length'],
              })
            }
          >
            {STEP_LENGTHS.map((length) => (
              <option key={length} value={length}>
                {length}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span>Velocity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={step.velocity}
            aria-label="Velocity"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                velocity: Number(event.target.value),
              })
            }
          />
          <strong>{Math.round(step.velocity * 100)}%</strong>
        </label>

        <label className="control">
          <span>Probability</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={step.probability}
            aria-label="Probability"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                probability: Number(event.target.value),
              })
            }
          />
          <strong>{Math.round(step.probability * 100)}%</strong>
        </label>

        <label className="control">
          <span>Microtiming</span>
          <input
            type="range"
            min={-50}
            max={50}
            step={1}
            value={microtimingMs}
            aria-label="Microtiming"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                microtiming: Number(event.target.value) / 1000,
              })
            }
          />
          <strong>{microtimingMs}ms</strong>
        </label>

        <label className="control">
          <span>Ratchet</span>
          <select
            value={step.ratchet}
            aria-label="Ratchet"
            onChange={(event) =>
              onStepChange(track.id, stepIndex, {
                ratchet: Number(event.target.value),
              })
            }
          >
            {RATCHET_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
