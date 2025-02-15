import { render, fireEvent, act, screen } from '@testing-library/react';
import { MidiDeviceSelector } from '../MidiDeviceSelector';

describe('MidiDeviceSelector', () => {
  const mockMidiDevice = {
    id: 'device1',
    name: 'Test Device',
    manufacturer: 'Test Manufacturer'
  };

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'requestMIDIAccess', {
      value: jest.fn().mockResolvedValue({
        inputs: new Map([
          [mockMidiDevice.id, mockMidiDevice]
        ])
      }),
      writable: true
    });
  });

  it('renders MIDI device selector', async () => {
    const onDeviceSelect = jest.fn();
    
    await act(async () => {
      render(<MidiDeviceSelector onDeviceSelect={onDeviceSelect} />);
    });
    
    expect(screen.getByText('Select MIDI Device')).toBeInTheDocument();
  });

  it('calls onDeviceSelect when device is selected', async () => {
    const onDeviceSelect = jest.fn();
    
    await act(async () => {
      render(<MidiDeviceSelector onDeviceSelect={onDeviceSelect} />);
    });
    
    const select = screen.getByRole('combobox');
    
    await act(async () => {
      fireEvent.change(select, { target: { value: mockMidiDevice.id } });
    });

    expect(onDeviceSelect).toHaveBeenCalledWith(mockMidiDevice.id);
    expect(screen.getByText(`${mockMidiDevice.name} (${mockMidiDevice.manufacturer})`)).toBeInTheDocument();
  });
});
