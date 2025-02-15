import React from 'react';
import styles from '../styles/StepGrid.module.css';

interface StepGridProps {
  steps: boolean[];
  currentStep: number;
  onStepToggle: (step: number) => void;
}

export const StepGrid: React.FC<StepGridProps> = ({ steps, currentStep, onStepToggle }) => {
  return (
    <div className={styles.gridContainer}>
      {steps.map((active, index) => (
        <button
          key={index}
          title={`Step ${index + 1}`}
          className={`${styles.stepButton} 
            ${active ? styles.active : styles.inactive}
            ${currentStep === index ? styles.current : ''}`}
          onClick={() => onStepToggle(index)}
          data-testid="step"
        />
      ))}
    </div>
  );
};
