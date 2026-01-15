import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditor } from './StepEditor';
import { createStep, type Track } from '../models/sequence';

const buildTrack = (overrides: Partial<Track>): Track => ({
  id: 'track-1',
  name: 'Lead',
  type: 'lead',
  instrumentId: 'instrument-1',
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
    const onStepSelect = jest.fn();
    const onStepPreview = jest.fn();
    const track = buildTrack({});

    render(
      <StepEditor
        track={track}
        stepIndex={0}
        patternLength={8}
        onStepChange={onStepChange}
        onStepSelect={onStepSelect}
        onStepPreview={onStepPreview}
      />
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

  it('navigates steps with next button', () => {
    const onStepChange = jest.fn();
    const onStepSelect = jest.fn();
    const track = buildTrack({});

    render(
      <StepEditor
        track={track}
        stepIndex={0}
        patternLength={8}
        onStepChange={onStepChange}
        onStepSelect={onStepSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(onStepSelect).toHaveBeenCalledWith('track-1', 1);
  });

  it('fires preview action', () => {
    const onStepChange = jest.fn();
    const onStepPreview = jest.fn();
    const track = buildTrack({});

    render(
      <StepEditor
        track={track}
        stepIndex={0}
        patternLength={8}
        onStepChange={onStepChange}
        onStepPreview={onStepPreview}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    expect(onStepPreview).toHaveBeenCalledWith('track-1', 0);
  });
});
