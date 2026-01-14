import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditor } from './StepEditor';
import { createStep, type Track } from '../models/sequence';

const buildTrack = (overrides: Partial<Track>): Track => ({
  id: 'track-1',
  name: 'Lead',
  type: 'lead',
  device: null,
  steps: Array.from({ length: 8 }, () => createStep()),
  fx: [],
  muted: false,
  defaultNote: 'C4',
  ...overrides,
});

describe('StepEditor', () => {
  it('updates velocity and note fields', () => {
    const onStepChange = jest.fn();
    const track = buildTrack({});

    render(
      <StepEditor track={track} stepIndex={0} onStepChange={onStepChange} />
    );

    fireEvent.change(screen.getByLabelText('Velocity'), {
      target: { value: '0.5' },
    });
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'D4' },
    });

    expect(onStepChange).toHaveBeenCalledWith('track-1', 0, {
      velocity: 0.5,
    });
    expect(onStepChange).toHaveBeenCalledWith('track-1', 0, {
      note: 'D4',
    });
  });
});
