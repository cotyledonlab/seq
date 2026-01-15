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
  patternLength: number;
  onStepChange: (trackId: string, stepIndex: number, updates: Partial<Step>) => void;
  onStepSelect?: (trackId: string, stepIndex: number) => void;
  onStepPreview?: (trackId: string, stepIndex: number) => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({
  track,
  stepIndex,
  patternLength,
  onStepChange,
  onStepSelect,
  onStepPreview,
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
  const maxSteps = Math.min(patternLength, track.steps.length);

  const handleStepToggle = () => {
    onStepChange(track.id, stepIndex, { active: !step.active });
  };

  const handleNavigate = (delta: number) => {
    if (!onStepSelect || maxSteps === 0) {
      return;
    }
    const nextIndex = (stepIndex + delta + maxSteps) % maxSteps;
    onStepSelect(track.id, nextIndex);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Step Editor</h3>
          <span className="panel-subtitle">
            {track.name} · Step {stepIndex + 1} · {step.active ? 'On' : 'Off'}
          </span>
        </div>
        <div className="panel-actions">
          <span className="panel-chip">{track.type.toUpperCase()}</span>
          {onStepSelect ? (
            <div className="button-row">
              <button
                type="button"
                className="action-button ghost"
                onClick={() => handleNavigate(-1)}
              >
                Prev
              </button>
              <button
                type="button"
                className="action-button ghost"
                onClick={() => handleNavigate(1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="button-row">
        <button
          type="button"
          className={`action-button ${step.active ? 'primary' : 'ghost'}`}
          aria-label="Toggle step"
          aria-pressed={step.active}
          onClick={handleStepToggle}
        >
          {step.active ? 'Step On' : 'Step Off'}
        </button>
        {onStepPreview ? (
          <button
            type="button"
            className="action-button ghost"
            onClick={() => onStepPreview(track.id, stepIndex)}
          >
            Preview
          </button>
        ) : null}
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
