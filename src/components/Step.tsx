return (
  <div 
    data-testid={`sequencer-step-${id}`}
    className={`step ${active ? 'active' : ''}`}
    onClick={onClick}
    title={`Step ${id + 1}`}
  >
    // ...existing code...
  </div>
);
