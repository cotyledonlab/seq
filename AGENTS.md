# AGENTS

This file captures initial context for contributors and agent workflows.

## Project summary

SEQ is a browser-based MIDI step sequencer. The current implementation now supports an instrument rack with add/remove lanes, a multi-track grid, mixer controls, and MIDI input handling. A productionized version is expected to evolve toward a groovebox-style experience with reliable timing, exports, and hardware integration.

## Key files and folders

- `src/App.tsx`: main application state, track wiring, and transport controls.
- `src/hooks/useSequencerEngine.ts`: transport scheduling using refs for stable playback.
- `src/models/sequence.ts`: project/track/step/instrument data model + helpers.
- `src/components/StepGrid.tsx`: multi-track step grid UI.
- `src/components/StepEditor.tsx`: per-step parameter inspector.
- `src/components/InstrumentRack.tsx`: instrument add/remove, rename, and mixer controls.
- `src/components/ProjectControls.tsx`: project name, autosave, import/export UI.
- `src/components/TransportControls.tsx`: play/stop + tempo input.
- `src/components/MidiDeviceSelector.tsx`: Web MIDI input list.
- `src/storage/projects.ts`: localStorage persistence helpers for projects.
- `src/styles/*`: Tailwind + custom styling.
- `src-tauri/`: optional desktop packaging.

## How the app works (today)

- App holds a `project` model with tracks, instruments, pattern length, and tempo alongside `currentStep` + `isPlaying`.
- `useSequencerEngine` drives transport scheduling with refs, while UI updates render the current step highlight.
- Multi-track grid renders per-track steps and mute toggles; pattern length control resizes steps.
- Instrument rack manages add/remove/rename of instrument lanes, mix controls, and keeps tracks linked by instrument ID.
- Step editor updates per-step velocity, probability, microtiming, ratchet, note, and length.
- Project controls provide autosave, save snapshot, load, and JSON import/export.
- Project panel is hidden by default and toggled from the header "Project" button.
- MIDI device selection attaches a `onmidimessage` handler for note-on events (selected instrument).

## Commands

- `npm run dev`: start Vite dev server.
- `npm run build`: build the web app.
- `npm test`: run Jest tests.
- `npm run typecheck`: run TypeScript without emitting files.
- `npm run tauri`: Tauri dev/build workflows.
- Browser smoke checks: use the `playwriter` skill to drive the running tab and capture quick screenshots/console output.

## Notes and gaps

- Audio scheduling still relies on Tone.Loop timing, but UI rendering is separated from the scheduling path.
- Current synths are monophonic with limited presets.
- Local project persistence exists, but no preset libraries yet.
- MIDI device hot-swap handling is not implemented.

## Recommended next focus

- Add scene view + pattern chaining.
- Add export pathways (MIDI, audio renders).

## Approach (current buildout)

- Establish a normalized project model (`src/models/sequence.ts`) and keep UI state updates separate from audio scheduling.
- Use `useSequencerEngine` to drive timing from refs to reduce jitter and avoid loop recreation per render.
- Keep instruments normalized by ID, with tracks as sub-sequencers linked via `instrumentId`.
- Build mixer controls to write instrument params and apply them to Tone nodes post-audio unlock.
- Ship multi-track grid + pattern length controls first, then layer per-step parameters, persistence, and export.
- Pre-push hooks run `npm run typecheck` and `npm test`.
