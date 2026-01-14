# AGENTS

This file captures initial context for contributors and agent workflows.

## Project summary

SEQ is a browser-based MIDI step sequencer. The current implementation now supports a multi-track grid (drum, bass, lead) with variable pattern lengths, basic track mute, and a Tone.js synth plus MIDI input handling. A productionized version is expected to evolve toward a groovebox-style experience with reliable timing, exports, and hardware integration.

## Key files and folders

- `src/App.tsx`: main application state, track wiring, and transport controls.
- `src/hooks/useSequencerEngine.ts`: transport scheduling using refs for stable playback.
- `src/models/sequence.ts`: project/track/step data model + helpers.
- `src/components/StepGrid.tsx`: multi-track step grid UI.
- `src/components/StepEditor.tsx`: per-step parameter inspector.
- `src/components/TransportControls.tsx`: play/stop + tempo input.
- `src/components/MidiDeviceSelector.tsx`: Web MIDI input list.
- `src/components/Synthesizer.tsx`: basic synth controls.
- `src/styles/*`: Tailwind + custom styling.
- `src-tauri/`: optional desktop packaging.

## How the app works (today)

- App holds a `project` model with tracks, pattern length, and tempo alongside `currentStep` + `isPlaying`.
- `useSequencerEngine` drives transport scheduling with refs, while UI updates render the current step highlight.
- Multi-track grid renders per-track steps and mute toggles; pattern length control resizes steps.
- Step editor updates per-step velocity, probability, microtiming, ratchet, note, and length.
- MIDI device selection attaches a `onmidimessage` handler for note-on events (lead synth).

## Commands

- `npm run dev`: start Vite dev server.
- `npm run build`: build the web app.
- `npm test`: run Jest tests.
- `npm run typecheck`: run TypeScript without emitting files.
- `npm run tauri`: Tauri dev/build workflows.
- Browser smoke checks: use the `codex-browser` skill to load `http://127.0.0.1:5173/` and capture a screenshot/console quickly.

## Notes and gaps

- Audio scheduling still relies on Tone.Loop timing, but UI rendering is separated from the scheduling path.
- Current synth is monophonic with limited controls.
- No persistent storage of patterns or presets.
- MIDI device hot-swap handling is not implemented.

## Recommended next focus

- Expand per-step parameters (velocity, probability, microtiming) into the UI.
- Add export pathways (MIDI, audio renders).

## Approach (current buildout)

- Establish a normalized project model (`src/models/sequence.ts`) and keep UI state updates separate from audio scheduling.
- Use `useSequencerEngine` to drive timing from refs to reduce jitter and avoid loop recreation per render.
- Ship multi-track grid + pattern length controls first, then layer per-step parameters, persistence, and export.
- Pre-push hooks run `npm run typecheck` and `npm test`.
