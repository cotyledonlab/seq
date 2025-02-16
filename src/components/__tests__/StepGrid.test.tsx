import { render, fireEvent, screen } from '@testing-library/react';
import { StepGrid } from '../StepGrid';

describe('StepGrid', () => {
  const mockOnStepToggle = jest.fn();
  const defaultProps = {
    steps: [false, true, false, true],
    currentStep: 0,
    onStepToggle: mockOnStepToggle,
  };

  beforeEach(() => {
    mockOnStepToggle.mockClear();
  });

  it('renders correct number of steps', () => {
    render(<StepGrid {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('shows active and inactive states correctly', () => {
    render(<StepGrid {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveClass('active');
    expect(buttons[0]).toHaveClass('inactive');
  });

  it('highlights current step', () => {
    render(<StepGrid {...defaultProps} />);
    const currentButton = screen.getByTestId('sequencer-step-0');
    expect(currentButton).toHaveClass('current');
  });

  it('calls onStepToggle when clicking a step', () => {
    render(<StepGrid {...defaultProps} />);
    const secondStep = screen.getByTestId('sequencer-step-1');
    fireEvent.click(secondStep);
    expect(mockOnStepToggle).toHaveBeenCalledWith(1);
  });
});
