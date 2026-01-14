import React from 'react';
import styles from '../styles/StepGrid.module.css';
import type { Track } from '../models/sequence';

interface StepGridProps {
  tracks: Track[];
  currentStep: number;
  patternLength: number;
  onStepToggle: (trackId: string, step: number) => void;
  onTrackMuteToggle: (trackId: string) => void;
}

export const StepGrid: React.FC<StepGridProps> = ({
  tracks,
  currentStep,
  patternLength,
  onStepToggle,
  onTrackMuteToggle,
}) => {
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
          className={`${styles.trackRow} ${track.muted ? styles.mutedRow : ''}`}
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
                  title={`${track.name} Step ${index + 1}`}
                  className={`${styles.stepButton} 
                    ${step.active ? styles.active : styles.inactive}
                    ${currentStep === index ? styles.current : ''}`}
                  onClick={() => onStepToggle(track.id, index)}
                  data-testid={`sequencer-step-${track.id}-${index}`}
                  aria-pressed={step.active}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
