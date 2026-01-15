import {
  createDefaultProject,
  createStep,
  resizeSteps,
  serializeProject,
  deserializeProject,
} from './sequence';

describe('sequence model', () => {
  it('creates a default project with three tracks, instruments, and 16 steps', () => {
    const project = createDefaultProject();

    expect(project.patternLength).toBe(16);
    expect(project.tracks).toHaveLength(3);
    expect(project.instruments).toHaveLength(3);
    project.tracks.forEach((track) => {
      expect(track.steps).toHaveLength(16);
      expect(track.instrumentId).toBeTruthy();
    });
  });

  it('resizes steps while preserving existing state', () => {
    const steps = [createStep(), { ...createStep(), active: true }];
    const resized = resizeSteps(steps, 4);

    expect(resized).toHaveLength(4);
    expect(resized[0].active).toBe(false);
    expect(resized[1].active).toBe(true);
  });

  it('serializes and deserializes project data', () => {
    const project = createDefaultProject();
    const payload = serializeProject(project);
    const parsed = deserializeProject(payload);

    expect(parsed?.patternLength).toBe(project.patternLength);
    expect(parsed?.tracks).toHaveLength(project.tracks.length);
  });
});
