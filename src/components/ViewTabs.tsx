import React from 'react';

export type ViewType = 'grid' | 'editor' | 'mix';

interface ViewTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  patternLength: number;
  selectedTrackName?: string;
  selectedStepIndex?: number | null;
  instrumentCount: number;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({
  activeView,
  onViewChange,
  patternLength,
  selectedTrackName,
  selectedStepIndex,
  instrumentCount,
}) => {
  const tabs: { id: ViewType; label: string; badge: string }[] = [
    {
      id: 'grid',
      label: 'Grid',
      badge: `${patternLength} steps`,
    },
    {
      id: 'editor',
      label: 'Editor',
      badge: selectedTrackName
        ? `${selectedTrackName} · ${selectedStepIndex != null ? selectedStepIndex + 1 : '-'}`
        : 'No selection',
    },
    {
      id: 'mix',
      label: 'Mix',
      badge: `${instrumentCount} voice${instrumentCount !== 1 ? 's' : ''}`,
    },
  ];

  return (
    <nav className="view-tabs" role="tablist" aria-label="View navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeView === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`view-tab ${activeView === tab.id ? 'active' : ''}`}
          onClick={() => onViewChange(tab.id)}
        >
          <span className="view-tab-label">{tab.label}</span>
          <span className="view-tab-badge">{tab.badge}</span>
        </button>
      ))}
    </nav>
  );
};
