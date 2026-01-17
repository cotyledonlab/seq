import React from 'react';
import styles from '../styles/StepGrid.module.css';
import type { Track } from '../models/sequence';

interface StepGridProps {
  tracks: Track[];
  currentStep: number;
  patternLength: number;
  onStepToggle: (trackId: string, step: number) => void;
  onTrackMuteToggle: (trackId: string) => void;
  selectedTrackId: string | null;
  selectedStepIndex: number | null;
  onStepSelect: (trackId: string, step: number) => void;
}

export const StepGrid: React.FC<StepGridProps> = ({
  tracks,
  currentStep,
  patternLength,
  onStepToggle,
  onTrackMuteToggle,
  selectedTrackId,
  selectedStepIndex,
  onStepSelect,
}) => {
  const hasAnyActiveSteps = tracks.some(track =>
    track.steps.slice(0, patternLength).some(step => step.active)
  );

  return (
    <div className={styles.gridContainer}>
      <div className={styles.headerRow}>
        <div className={styles.trackHeaderCell}>Track</div>
        <div className={styles.stepRowWrapper}>
          <div
            className={styles.stepHeader}
            style={{ '--steps': patternLength } as React.CSSProperties}
          >
            {Array.from({ length: patternLength }, (_, index) => (
              <div
                key={`header-${index}`}
                className={`${styles.stepLabel} ${
                  currentStep === index ? styles.currentHeader : ''
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tracks.map((track) => (
        <div
          key={track.id}
          className={`${styles.trackRow} ${
            track.muted ? styles.mutedRow : ''
          } ${
            selectedTrackId === track.id ? styles.selectedRow : ''
          }`}
          data-testid={`track-row-${track.id}`}
        >
          <div className={styles.trackLabel}>
            <div>
              <div className={styles.trackName}>{track.name}</div>
              <div className={styles.trackType}>{track.type.toUpperCase()}</div>
            </div>
            <button
              type="button"
              className={`${styles.muteButton} ${track.muted ? styles.muteActive : ''}`}
              onClick={() => onTrackMuteToggle(track.id)}
            >
              {track.muted ? 'Muted' : 'Mute'}
            </button>
          </div>
          <div className={styles.stepRowWrapper}>
            <div
              className={styles.stepRow}
              style={{ '--steps': patternLength } as React.CSSProperties}
            >
              {track.steps.slice(0, patternLength).map((step, index) => (
                <button
                  key={`${track.id}-${index}`}
                  title={`${track.name} Step ${index + 1}${step.active ? ' (active)' : ''} - Click to select, double-click to toggle`}
                  className={`${styles.stepButton}
                    ${step.active ? styles.active : styles.inactive}
                    ${currentStep === index ? styles.current : ''}
                    ${
                      selectedTrackId === track.id && selectedStepIndex === index
                        ? styles.selected
                        : ''
                    }
                    ${step.active && step.probability < 1 ? styles.lowProbability : ''}`}
                  style={step.active && step.probability < 1 ? { '--probability': step.probability } as React.CSSProperties : undefined}
                  onClick={() => onStepSelect(track.id, index)}
                  onDoubleClick={() => onStepToggle(track.id, index)}
                  data-testid={`sequencer-step-${track.id}-${index}`}
                  aria-pressed={step.active}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className={styles.gridHint}>
        {!hasAnyActiveSteps ? (
          <p>Double-click steps to build your pattern. Use arrow keys to navigate, Enter to toggle.</p>
        ) : (
          <p>Click to select · Double-click to toggle · Arrow keys to navigate · Space to play</p>
        )}
      </div>
    </div>
  );
};
