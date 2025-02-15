import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import * as Tone from 'tone';

// Mock Tone.js
jest.mock('tone', () => ({
  start: jest.fn().mockResolvedValue(undefined),
  Synth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    set: jest.fn(),
  })),
  Transport: {
    start: jest.fn(),
    stop: jest.fn(),
    bpm: { value: 120 },
  },
  Loop: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    dispose: jest.fn(),
  })),
  Frequency: jest.fn().mockImplementation((note) => note),
}));

// Mock WebMIDI API
Object.defineProperty(window.navigator, 'requestMIDIAccess', {
  value: jest.fn().mockResolvedValue({
    inputs: new Map([
      ['device1', { id: 'device1', name: 'Test MIDI Device' }],
    ]),
  }),
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all main components', () => {
    render(<App />);
    expect(screen.getByText('MIDI Sequencer')).toBeInTheDocument();
    expect(screen.getByText('Synthesizer')).toBeInTheDocument();
  });

  test('toggles step when clicked', () => {
    render(<App />);
    const steps = screen.getAllByTitle(/Step \d+/);
    fireEvent.click(steps[0]);
    expect(steps[0]).toHaveClass('active');
  });

  test('starts/stops transport when play button clicked', async () => {
    render(<App />);
    const playButton = screen.getByRole('button', { name: /play/i });
    
    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(Tone.start).toHaveBeenCalled();
    expect(Tone.Transport.start).toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(Tone.Transport.stop).toHaveBeenCalled();
  });

  test('changes tempo when tempo control is adjusted', () => {
    render(<App />);
    const tempoInput = screen.getByTitle('Tempo');
    
    fireEvent.change(tempoInput, { target: { value: '140' } });
    
    expect(Tone.Transport.bpm.value).toBe(140);
  });

  test('handles MIDI device selection', async () => {
    render(<App />);
    const select = screen.getByText(/Select MIDI Device/i).closest('select');
    
    await act(async () => {
      if (select) {
        fireEvent.change(select, { target: { value: 'device1' } });
      }
    });

    expect(navigator.requestMIDIAccess).toHaveBeenCalled();
  });

  test('changes synth parameters when controls are adjusted', async () => {
    const mockSynth = {
      triggerAttackRelease: jest.fn(),
      toDestination: jest.fn().mockReturnThis(),
      set: jest.fn(),
      envelope: {
        attack: 0.1,
        release: 0.1
      }
    };
    
    (Tone.Synth as unknown as jest.Mock).mockImplementation(() => mockSynth);
    
    render(<App />);
    
    const attackControl = screen.getByLabelText('Attack');
    const releaseControl = screen.getByLabelText('Release');
    
    fireEvent.change(attackControl, { target: { value: '0.1' } });
    fireEvent.change(releaseControl, { target: { value: '1.0' } });

    expect(mockSynth.envelope.attack).toBe(0.1);
    expect(mockSynth.envelope.release).toBe(1.0);
  });

  test('synth responds to step sequencer', async () => {
    const mockSynth = {
      triggerAttackRelease: jest.fn(),
      toDestination: jest.fn().mockReturnThis(),
      set: jest.fn(),
      envelope: {
        attack: 0.1,
        release: 0.1
      }
    };
    
    (Tone.Synth as unknown as jest.Mock).mockImplementation(() => mockSynth);
    
    render(<App />);
    
    // Enable a step and set its note
    const steps = screen.getAllByTestId(/^sequencer-step-/);
    fireEvent.click(steps[0]);
    
    const noteSelect = screen.getAllByTestId('note-select')[0];
    fireEvent.change(noteSelect, { target: { value: 'C4' } });

    // Start the sequencer
    const playButton = screen.getByRole('button', { name: /play/i });
    await act(async () => {
      fireEvent.click(playButton);
    });

    // Get and trigger the loop callback
    const [[callback]] = (Tone.Loop as unknown as jest.Mock).mock.calls;
    await act(async () => {
      callback(0);
    });

    expect(mockSynth.triggerAttackRelease).toHaveBeenCalledWith('C4', '8n');
  });
});
