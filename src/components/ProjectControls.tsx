import React, { useRef } from 'react';
import type { StoredProjectSummary } from '../storage/projects';

interface ProjectControlsProps {
  projectName: string;
  autosaveLabel: string;
  savedProjects: StoredProjectSummary[];
  onProjectNameChange: (name: string) => void;
  onNewProject: () => void;
  onSaveNow: () => void;
  onLoadProject: (projectId: string) => void;
  onExportProject: () => void;
  onImportProject: (file: File) => void;
}

export const ProjectControls: React.FC<ProjectControlsProps> = ({
  projectName,
  autosaveLabel,
  savedProjects,
  onProjectNameChange,
  onNewProject,
  onSaveNow,
  onLoadProject,
  onExportProject,
  onImportProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="panel project-controls">
      <div className="panel-header">
        <div>
          <h3>Project</h3>
          <span className="panel-subtitle">{autosaveLabel}</span>
        </div>
        <button
          type="button"
          className="action-button ghost"
          onClick={onSaveNow}
        >
          Save snapshot
        </button>
      </div>

      <div className="project-grid">
        <label className="control">
          <span>Name</span>
          <input
            type="text"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            placeholder="Project name"
          />
        </label>

        <label className="control">
          <span>Saved Projects</span>
          <select
            value=""
            onChange={(event) => {
              if (event.target.value) {
                const selectedProject = savedProjects.find(p => p.id === event.target.value);
                if (window.confirm(`Load "${selectedProject?.name || 'project'}"? Any unsaved changes will be lost.`)) {
                  onLoadProject(event.target.value);
                }
              }
            }}
          >
            <option value="">Load saved project…</option>
            {savedProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="action-button"
          onClick={() => {
            if (window.confirm('Start new project? Any unsaved changes will be lost.')) {
              onNewProject();
            }
          }}
        >
          New project
        </button>
        <button
          type="button"
          className="action-button primary"
          onClick={onExportProject}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="action-button"
          onClick={() => fileInputRef.current?.click()}
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onImportProject(file);
              event.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};
