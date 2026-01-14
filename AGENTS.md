# AGENTS

This file captures initial context for contributors and agent workflows.

## Project summary

SEQ is a browser-based MIDI step sequencer. The current implementation is a single 16-step grid with a Tone.js synth and basic MIDI input handling. A productionized version is expected to evolve toward a multi-track groovebox-style experience with reliable timing, exports, and hardware integration.

## Key files and folders

- `src/App.tsx`: main application state and Tone.Transport loop.
- `src/components/StepGrid.tsx`: 16-step toggle UI.
- `src/components/TransportControls.tsx`: play/stop + tempo input.
- `src/components/MidiDeviceSelector.tsx`: Web MIDI input list.
- `src/components/Synthesizer.tsx`: basic synth controls.
- `src/styles/*`: Tailwind + custom styling.
- `src-tauri/`: optional desktop packaging.

## How the app works (today)

- App holds `steps`, `currentStep`, `isPlaying`, and `tempo` in React state.
- A Tone.Loop increments `currentStep` at 16n and triggers a fixed note for active steps.
- MIDI device selection attaches a `onmidimessage` handler for note-on events.

## Commands

- `npm run dev`: start Vite dev server.
- `npm run build`: build the web app.
- `npm test`: run Jest tests.
- `npm run tauri`: Tauri dev/build workflows.

## Notes and gaps

- Audio scheduling is tied to React state updates; this may introduce timing jitter.
- Current synth is monophonic with limited controls.
- No persistent storage of patterns or presets.
- MIDI device hot-swap handling is not implemented.

## Recommended next focus

- Separate audio scheduling from React rendering.
- Introduce a structured sequence model for multiple tracks.
- Add export pathways (MIDI, audio renders).
