import {
  deserializeProject,
  normalizeProject,
  serializeProject,
  type Project,
} from '../models/sequence';

const STORAGE_KEY = 'seq.projects.v1';

interface StoredProject {
  payload: string;
  updatedAt: string;
}

interface ProjectStore {
  version: 1;
  lastOpenedId?: string;
  projects: Record<string, StoredProject>;
}

export interface StoredProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
}

const emptyStore = (): ProjectStore => ({
  version: 1,
  projects: {},
});

const saveStore = (store: ProjectStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const loadProjectStore = (): ProjectStore | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ProjectStore;
    if (!parsed || parsed.version !== 1 || !parsed.projects) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse project store', error);
    return null;
  }
};

export const listStoredProjects = (): StoredProjectSummary[] => {
  const store = loadProjectStore();
  if (!store) {
    return [];
  }

  return Object.entries(store.projects)
    .map(([id, value]) => {
      const project = deserializeProject(value.payload);
      return {
        id,
        name: project?.name ?? 'Untitled Project',
        updatedAt: value.updatedAt,
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const loadProjectById = (id: string): Project | null => {
  const store = loadProjectStore();
  const entry = store?.projects[id];
  if (!entry) {
    return null;
  }

  const parsed = deserializeProject(entry.payload);
  return parsed ? normalizeProject(parsed) : null;
};

export const saveProjectToStore = (project: Project): ProjectStore => {
  const store = loadProjectStore() ?? emptyStore();
  const payload = serializeProject(project);
  const updatedAt = new Date().toISOString();

  store.projects[project.id] = { payload, updatedAt };
  store.lastOpenedId = project.id;
  saveStore(store);
  return store;
};

export const deleteProjectFromStore = (id: string): ProjectStore => {
  const store = loadProjectStore() ?? emptyStore();
  delete store.projects[id];
  if (store.lastOpenedId === id) {
    store.lastOpenedId = Object.keys(store.projects)[0];
  }
  saveStore(store);
  return store;
};

export const exportProjectPayload = (project: Project): string =>
  serializeProject(project);

export const importProjectPayload = (payload: string): Project | null => {
  const parsed = deserializeProject(payload);
  return parsed ? normalizeProject(parsed) : null;
};
