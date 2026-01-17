import { render, screen, fireEvent } from '@testing-library/react';
import { StepGrid } from './StepGrid';
import { createStep, type Track } from '../models/sequence';

const buildTrack = (overrides: Partial<Track>): Track => ({
  id: 'track-1',
  name: 'Drums',
  type: 'drum',
  instrumentId: 'instrument-1',
  device: null,
  steps: Array.from({ length: 8 }, () => createStep()),
  fx: [],
  muted: false,
  defaultNote: 'C2',
  ...overrides,
});

describe('StepGrid', () => {
  it('renders track labels and steps', () => {
    const tracks = [
      buildTrack({ id: 'track-1', name: 'Drums' }),
      buildTrack({ id: 'track-2', name: 'Bass', type: 'bass' }),
    ];

    render(
      <StepGrid
        tracks={tracks}
        currentStep={0}
        patternLength={8}
        onStepToggle={jest.fn()}
        onTrackMuteToggle={jest.fn()}
        selectedTrackId={null}
        selectedStepIndex={null}
        onStepSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Drums')).toBeInTheDocument();
    expect(screen.getByText('Bass')).toBeInTheDocument();
    expect(screen.getByTestId('sequencer-step-track-1-0')).toBeInTheDocument();
  });

  it('calls onStepSelect on single click and onStepToggle on double click', () => {
    const onStepToggle = jest.fn();
    const onTrackMuteToggle = jest.fn();
    const onStepSelect = jest.fn();
    const tracks = [buildTrack({ id: 'track-1', name: 'Drums' })];

    render(
      <StepGrid
        tracks={tracks}
        currentStep={0}
        patternLength={8}
        onStepToggle={onStepToggle}
        onTrackMuteToggle={onTrackMuteToggle}
        selectedTrackId={null}
        selectedStepIndex={null}
        onStepSelect={onStepSelect}
      />
    );

    // Single click selects the step
    fireEvent.click(screen.getByTestId('sequencer-step-track-1-0'));
    expect(onStepSelect).toHaveBeenCalledWith('track-1', 0);
    expect(onStepToggle).not.toHaveBeenCalled();

    // Double click toggles the step
    fireEvent.doubleClick(screen.getByTestId('sequencer-step-track-1-0'));
    expect(onStepToggle).toHaveBeenCalledWith('track-1', 0);

    // Mute button still works
    fireEvent.click(screen.getByRole('button', { name: 'Mute' }));
    expect(onTrackMuteToggle).toHaveBeenCalledWith('track-1');
  });
});
