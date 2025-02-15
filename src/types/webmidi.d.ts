interface Navigator {
  requestMIDIAccess(): Promise<MIDIAccess>;
}

interface MIDIAccess {
  inputs: Map<string, MIDIInput>;
}

interface MIDIInput {
  id: string;
  name: string;
  manufacturer: string;
}
