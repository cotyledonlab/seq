import { render, fireEvent } from '@testing-library/react';
import { StepGrid } from '../StepGrid';

describe('StepGrid', () => {
  it('renders correct number of steps', () => {
    const { container } = render(
      <StepGrid
        steps={new Array(16).fill(false)}
        currentStep={0}
        onStepToggle={() => {}}
      />
    );
    expect(container.querySelectorAll('button')).toHaveLength(16);
  });

  it('calls onStepToggle when step is clicked', () => {
    const onStepToggle = jest.fn();
    const { container } = render(
      <StepGrid
        steps={new Array(16).fill(false)}
        currentStep={0}
        onStepToggle={onStepToggle}
      />
    );
    
    fireEvent.click(container.querySelector('button')!);
    expect(onStepToggle).toHaveBeenCalledWith(0);
  });
});
