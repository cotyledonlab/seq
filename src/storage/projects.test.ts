import {
  loadProjectById,
  listStoredProjects,
  saveProjectToStore,
  importProjectPayload,
} from './projects';
import { createDefaultProject } from '../models/sequence';

describe('project storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and lists projects', () => {
    const project = createDefaultProject();
    saveProjectToStore(project);

    const list = listStoredProjects();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe(project.name);
  });

  it('loads a project by id', () => {
    const project = createDefaultProject();
    saveProjectToStore(project);

    const loaded = loadProjectById(project.id);
    expect(loaded?.id).toBe(project.id);
  });

  it('imports a project payload', () => {
    const project = createDefaultProject();
    const payload = JSON.stringify(project);
    const loaded = importProjectPayload(payload);

    expect(loaded?.name).toBe(project.name);
  });
});
