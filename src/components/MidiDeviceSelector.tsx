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
  const [status, setStatus] = useState<'idle' | 'requesting' | 'ready' | 'denied' | 'unsupported'>('idle');
  const [message, setMessage] = useState<string>('');

  const fetchMidiDevices = async () => {
    if (!navigator.requestMIDIAccess) {
      setStatus('unsupported');
      setMessage('Web MIDI not supported in this browser.');
      return;
    }

    setStatus('requesting');
    setMessage('');

    try {
      const midiAccess = await navigator.requestMIDIAccess();
      const inputs = Array.from(midiAccess.inputs.values());
      const deviceList = inputs.map(input => ({
        id: input.id,
        name: input.name || 'Unknown Device',
        manufacturer: input.manufacturer || 'Unknown Manufacturer'
      }));
      setDevices(deviceList);
      setStatus('ready');
    } catch (err) {
      const error = err as DOMException;
      if (error?.name === 'NotAllowedError') {
        setStatus('denied');
        setMessage('MIDI permission denied. Enable access in your browser.');
        return;
      }
      setStatus('idle');
      setMessage('Unable to access MIDI devices.');
      console.error('MIDI access failed:', err);
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(e.target.value);
  };

  useEffect(() => {
    onDeviceSelect(selectedDevice);
  }, [selectedDevice, onDeviceSelect]);

  return (
    <div className="panel panel-compact">
      <label className="control">
        <span>MIDI In</span>
        <select
          value={selectedDevice}
          onChange={handleDeviceChange}
          disabled={status !== 'ready'}
        >
          <option value="">Select device</option>
          {devices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name} ({device.manufacturer})
            </option>
          ))}
        </select>
      </label>
      <div className="inline-field">
        <button
          className="transport-button"
          type="button"
          onClick={fetchMidiDevices}
          disabled={status === 'requesting'}
        >
          {status === 'ready' ? 'Refresh MIDI' : 'Enable MIDI'}
        </button>
        {status === 'requesting' && <strong>Requesting…</strong>}
      </div>
      {message && <p className="panel-empty">{message}</p>}
    </div>
  );
};
