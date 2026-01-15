export type PatternLength = 8 | 16 | 32 | 64;
export type StepLength = '32n' | '16n' | '8n' | '4n';
export type TrackType = 'drum' | 'bass' | 'lead' | 'midi';
export type InstrumentType = 'drum' | 'bass' | 'lead' | 'midi';
export type OscillatorType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export interface InstrumentParams {
  volume: number;
  pan: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  oscillator: OscillatorType;
}

export interface Step {
  active: boolean;
  velocity: number;
  probability: number;
  microtiming: number;
  ratchet: number;
  note?: string;
  length: StepLength;
  tie: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  instrumentId: string;
  device: string | null;
  steps: Step[];
  fx: string[];
  muted: boolean;
  defaultNote: string;
}

export interface Instrument {
  id: string;
  name: string;
  type: InstrumentType;
  presetId: string | null;
  params: InstrumentParams;
  enabled: boolean;
}

export interface Scene {
  id: string;
  name: string;
  clipIds: string[];
}

export interface Project {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number];
  patternLength: PatternLength;
  tracks: Track[];
  instruments: Instrument[];
  scenes: Scene[];
}

export const PATTERN_LENGTHS: PatternLength[] = [8, 16, 32, 64];
export const STEP_LENGTHS: StepLength[] = ['32n', '16n', '8n', '4n'];
export const RATCHET_OPTIONS = [1, 2, 3, 4];
export const INSTRUMENT_TYPES: InstrumentType[] = ['drum', 'bass', 'lead'];

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const createStep = (): Step => ({
  active: false,
  velocity: 0.9,
  probability: 1,
  microtiming: 0,
  ratchet: 1,
  note: undefined,
  length: '16n',
  tie: false,
});

export const createSteps = (length: number) =>
  Array.from({ length }, () => createStep());

const defaultNoteForType = (type: InstrumentType): string => {
  switch (type) {
    case 'drum':
      return 'C2';
    case 'bass':
      return 'C2';
    case 'lead':
    case 'midi':
    default:
      return 'C4';
  }
};

const defaultInstrumentParams = (
  type: InstrumentType
): InstrumentParams => {
  const base = {
    volume: 0.8,
    pan: 0,
    attack: 0.1,
    decay: 0.2,
    sustain: 0.6,
    release: 0.4,
    oscillator: 'sine' as OscillatorType,
  };

  if (type === 'bass') {
    return { ...base, oscillator: 'square' };
  }

  return base;
};

export const createInstrument = (options: {
  id?: string;
  name?: string;
  type: InstrumentType;
  params?: Partial<InstrumentParams>;
  presetId?: string | null;
  enabled?: boolean;
}): Instrument => ({
  id: options.id ?? createId('instrument'),
  name: options.name ?? `${options.type.toUpperCase()} Voice`,
  type: options.type,
  presetId: options.presetId ?? null,
  params: {
    ...defaultInstrumentParams(options.type),
    ...options.params,
  },
  enabled: options.enabled ?? true,
});

export const createTrackForInstrument = (
  patternLength: PatternLength,
  instrument: Instrument
): Track => ({
  id: createId('track'),
  name: instrument.name,
  type: instrument.type,
  instrumentId: instrument.id,
  device: null,
  steps: createSteps(patternLength),
  fx: [],
  muted: false,
  defaultNote: defaultNoteForType(instrument.type),
});

export const createDefaultProject = (): Project => {
  const patternLength: PatternLength = 16;
  const drums = createInstrument({ name: 'Drums', type: 'drum' });
  const bass = createInstrument({ name: 'Bass', type: 'bass' });
  const lead = createInstrument({ name: 'Lead', type: 'lead' });

  return {
    id: createId('project'),
    name: 'New Project',
    bpm: 120,
    timeSignature: [4, 4],
    patternLength,
    tracks: [
      createTrackForInstrument(patternLength, drums),
      createTrackForInstrument(patternLength, bass),
      createTrackForInstrument(patternLength, lead),
    ],
    instruments: [drums, bass, lead],
    scenes: [],
  };
};

export const resizeSteps = (steps: Step[], length: number): Step[] => {
  if (steps.length === length) {
    return steps;
  }

  if (steps.length > length) {
    return steps.slice(0, length);
  }

  return [...steps, ...createSteps(length - steps.length)];
};

export const serializeProject = (project: Project) => JSON.stringify(project);

export const deserializeProject = (payload: string): Project | null => {
  try {
    const parsed = JSON.parse(payload) as Project;
    if (!parsed || !parsed.tracks || !parsed.patternLength) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse project payload', error);
    return null;
  }
};

const coercePatternLength = (value: number | undefined): PatternLength =>
  PATTERN_LENGTHS.includes(value as PatternLength) ? (value as PatternLength) : 16;

export const normalizeStep = (step: Partial<Step>): Step => ({
  ...createStep(),
  ...step,
  velocity: step.velocity ?? 0.9,
  probability: step.probability ?? 1,
  microtiming: step.microtiming ?? 0,
  ratchet: step.ratchet ?? 1,
  length: step.length ?? '16n',
  tie: step.tie ?? false,
});

export const normalizeInstrument = (
  instrument: Instrument
): Instrument => ({
  id: instrument.id || createId('instrument'),
  name: instrument.name || `${instrument.type?.toUpperCase() || 'LEAD'} Voice`,
  type: instrument.type || 'lead',
  presetId: instrument.presetId ?? null,
  params: {
    ...defaultInstrumentParams(instrument.type || 'lead'),
    ...(instrument.params || {}),
  },
  enabled: instrument.enabled ?? true,
});

export const normalizeTrack = (
  track: Track,
  patternLength: PatternLength
): Track => ({
  id: track.id,
  name: track.name || 'Untitled',
  type: track.type || 'lead',
  instrumentId: track.instrumentId,
  device: track.device ?? null,
  steps: resizeSteps(
    (track.steps || []).map((step) => normalizeStep(step)),
    patternLength
  ),
  fx: track.fx || [],
  muted: track.muted ?? false,
  defaultNote: track.defaultNote || defaultNoteForType(track.type || 'lead'),
});

export const normalizeProject = (project: Project): Project => {
  const patternLength = coercePatternLength(project.patternLength);
  const instruments = (project.instruments || []).map(normalizeInstrument);
  const instrumentMap = new Map(instruments.map((instrument) => [instrument.id, instrument]));

  const tracks = (project.tracks || []).map((track) => {
    let instrumentId = track.instrumentId;
    if (!instrumentId || !instrumentMap.has(instrumentId)) {
      const fallbackType = track.type || 'lead';
      const derived = createInstrument({
        id: instrumentId,
        name: track.name,
        type: fallbackType,
      });
      instruments.push(derived);
      instrumentMap.set(derived.id, derived);
      instrumentId = derived.id;
    }

    return normalizeTrack({ ...track, instrumentId }, patternLength);
  });

  return {
    id: project.id || `project-${Math.random().toString(36).slice(2, 10)}`,
    name: project.name || 'Untitled Project',
    bpm: project.bpm || 120,
    timeSignature: project.timeSignature || [4, 4],
    patternLength,
    tracks,
    instruments,
    scenes: project.scenes || [],
  };
};
