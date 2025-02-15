import React, { useEffect, useState } from 'react';

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

interface MidiDeviceSelectorProps {
  onDeviceSelect: (deviceId: string) => void;
}

export const MidiDeviceSelector: React.FC<MidiDeviceSelectorProps> = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    const initMidi = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());
        const deviceList = inputs.map(input => ({
          id: input.id,
          name: input.name || 'Unknown Device',
          manufacturer: input.manufacturer || 'Unknown Manufacturer'
        }));
        setDevices(deviceList);
      } catch (err) {
        console.error('MIDI access failed:', err);
      }
    };

    initMidi();
  }, []);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(e.target.value);
  };

  useEffect(() => {
    if (selectedDevice) {
      onDeviceSelect(selectedDevice);
    }
  }, [selectedDevice, onDeviceSelect]);

  return (
    <div className="p-4">
      <select
        value={selectedDevice}
        onChange={handleDeviceChange}
        className="bg-gray-700 text-white p-2 rounded"
      >
        <option value="">Select MIDI Device</option>
        {devices.map(device => (
          <option key={device.id} value={device.id}>
            {device.name} ({device.manufacturer})
          </option>
        ))}
      </select>
    </div>
  );
};
