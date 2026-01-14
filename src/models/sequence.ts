export type PatternLength = 8 | 16 | 32 | 64;
export type TrackType = 'drum' | 'bass' | 'lead';

export interface Step {
  active: boolean;
  velocity: number;
  probability: number;
  microtiming: number;
  ratchet: number;
  note?: string;
  length: string;
  tie: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  device: string | null;
  steps: Step[];
  fx: string[];
  muted: boolean;
  defaultNote: string;
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
  scenes: Scene[];
}

export const PATTERN_LENGTHS: PatternLength[] = [8, 16, 32, 64];

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

const createTrack = (
  patternLength: PatternLength,
  options: Pick<Track, 'name' | 'type' | 'defaultNote'>
): Track => ({
  id: createId('track'),
  name: options.name,
  type: options.type,
  device: null,
  steps: createSteps(patternLength),
  fx: [],
  muted: false,
  defaultNote: options.defaultNote,
});

export const createDefaultProject = (): Project => {
  const patternLength: PatternLength = 16;

  return {
    id: createId('project'),
    name: 'New Project',
    bpm: 120,
    timeSignature: [4, 4],
    patternLength,
    tracks: [
      createTrack(patternLength, { name: 'Drums', type: 'drum', defaultNote: 'C2' }),
      createTrack(patternLength, { name: 'Bass', type: 'bass', defaultNote: 'C2' }),
      createTrack(patternLength, { name: 'Lead', type: 'lead', defaultNote: 'C4' }),
    ],
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
