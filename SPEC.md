# SEQ - Productionized Specification

## Vision

SEQ is a browser-native groovebox that feels as immediate as hardware while retaining the flexibility of modern DAWs. The experience should be fast, tactile, and reliable, with a clean UI that helps users build loops, chain scenes, and export stems without leaving the browser.

## Goals

- Deliver a sequencing workflow that feels immediate, stable, and musical.
- Support multi-track pattern composition with per-step expression and repeatable timing.
- Provide a production-ready workflow for loop creation, live performance, and export.

## Product Principles

- **Immediate feedback**: Every click or knob twist should be audible and visible.
- **Timing above all**: Scheduling accuracy and low-jitter playback are non-negotiable.
- **Focused complexity**: Advanced controls are available, but only when they help the current task.
- **Safe by default**: Autosave, undo/redo, and recoverability are always on.
- **Hardware-friendly**: MIDI control and clock sync are first-class concepts.

## Non-goals (Initial)

- Full DAW replacement or audio multitrack recording.
- Third-party plugin hosting (VST/AU).
- Complex score editor or notation features.

## Personas

- **Live performer**: needs low latency, stable sync, quick pattern switching.
- **Beat maker**: needs fast pattern creation, export to DAWs, kit management.
- **Educator/student**: needs simple sharing, clear UI, browser access.

## Core UX

- Pattern grid with multiple tracks (drum, melodic, bass).
- Per-step parameters: velocity, probability, ratchet, microtiming, tie/length.
- Scene view: chain patterns into a live set.
- Single-click play/stop with clear transport + sync status.
- Instrument management with add/remove and a dedicated sub-sequencer per instrument.
- Simple mixer panel for per-instrument gain/pan and quick mute/solo.

### Step Editing UX (Near-term)

- Step selection highlights the active lane + column.
- Step Inspector panel exposes per-step velocity, probability, microtiming, ratchet, note, and length.
- Edits are instant and audible with the transport running.

### Project Management UX (Near-term)

- Project name, autosave status, manual save snapshot, import/export JSON.
- Quick load for recently saved projects.
- Safe failure messaging if imports or storage fail.

### Instrument + Mixer UX (Next)

- Add/remove instruments from a curated library (drum, bass, lead, sampler).
- Each instrument owns its own sub-sequencer lane with independent steps and parameters.
- A lightweight mixer lists instruments with gain, pan, mute, solo, and quick device status.
- Instrument panels can be collapsed/expanded without losing pattern context.

## Sequencing Features

### Patterns and Tracks

- Variable pattern lengths: 8/16/32/64 per project (future: per track).
- Time signature support (4/4 default) with per-project override.
- Track types: drum, bass, lead, MIDI.
- Track mute/solo states (solo planned).
- Pattern duplication and clip management.
- Instrument addition/removal with dynamic lane creation.
- Sub-sequencer lanes can be reordered to match mixer order.

### Step Parameters

- **Velocity**: 0.0–1.0, mapped to synth amplitude.
- **Probability**: chance of triggering (0–1), evaluated per step.
- **Microtiming**: -50ms to +50ms offset, applied to scheduled time.
- **Ratchet**: subdivide step duration into repeated triggers (1–4).
- **Length**: note duration (32n/16n/8n/4n).
- **Tie**: hold note across steps (future).

### Editing and Workflow

- Copy/paste steps and patterns.
- Undo/redo history (target: 50 actions).
- Snapshots for pattern variations.
- Randomize or humanize step parameters (future).

## Sound Engine

- Multiple synth engines (mono/poly) with preset library.
- Drum sampler with kit loading and sample trimming.
- Per-track FX chain with bypass and reorder.
- Per-track gain and pan.
- Mixer bus with per-instrument gain/pan and master limiter (future).

## MIDI and Hardware

- Input/output routing per track.
- MIDI learn for mapping transport, knobs, and faders.
- External clock support (MIDI clock in/out).
- MPE and MIDI 2.0 compatibility (stretch goal).

## Export and Sharing

- Export MIDI clip or full arrangement.
- Render audio loops/stems per track (offline render).
- Shareable link with embedded sequence state.
- Project archive export (JSON + samples).

## Persistence

- Local storage autosave with versioned schema.
- IndexedDB for larger assets (samples, stems).
- Project migration pipeline for schema changes.
- Optional cloud sync (account-based) for projects + presets.

## Data Model (Production Draft)

### Project

- `id`: string
- `name`: string
- `bpm`: number
- `timeSignature`: [number, number]
- `patternLength`: 8|16|32|64
- `tracks`: Track[]
- `instruments`: Instrument[]
- `scenes`: Scene[]
- `createdAt`: ISO string (future)
- `updatedAt`: ISO string (future)

### Track

- `id`: string
- `name`: string
- `type`: drum|bass|lead|midi
- `instrumentId`: string
- `device`: string | null
- `steps`: Step[]
- `fx`: FX[]
- `muted`: boolean
- `defaultNote`: string
- `gain`: number (future)
- `pan`: number (future)
- `order`: number (future)

### Instrument

- `id`: string
- `name`: string
- `type`: drum|bass|lead|sampler|midi
- `presetId`: string | null
- `params`: Record<string, number>
- `enabled`: boolean

### Step

- `active`: boolean
- `velocity`: number (0–1)
- `probability`: number (0–1)
- `microtiming`: number (seconds)
- `ratchet`: number
- `note`: string | undefined
- `length`: 32n|16n|8n|4n
- `tie`: boolean

### Scene

- `id`: string
- `name`: string
- `clipIds`: string[]

### FX

- `id`: string
- `type`: filter|delay|reverb|distortion
- `params`: Record<string, number>

## Technical Design

### Audio and Timing

- Central transport clock with lookahead scheduling (audio thread safe).
- Prefer AudioWorklet scheduler for sub-10ms jitter target.
- Track events precomputed per bar to reduce render load.
- Ratchet playback subdivides step duration without dropping velocity or microtiming offsets.
- Audio unlock via user gesture; synths instantiated post-unlock.
- Each instrument creates its own audio node chain, routed through a mixer bus.

### State Management

- Normalized project store with immutable updates.
- Separate UI state from audio scheduling state.
- Serialize project state for export and sharing.
- Autosave debounced with immediate save actions.
- Instrument list + sub-sequencer lanes are normalized by ID with stable ordering.

### Persistence

- Local: `localStorage` for lightweight projects, IndexedDB for samples.
- Store versioned payloads; migrate on load.
- Recover from corruption with safe fallback to last valid save.

### UI Architecture

- Modular panels (transport, project, step editor, track grid).
- Instrument rack panel + mixer panel docked near the sequencer grid.
- Keyboard accessibility for transport and step editing.
- Responsive grid for smaller viewports.

### Platform

- Web-first with offline support (service worker).
- Optional Tauri build for desktop distribution.

## Quality Requirements

- Scheduling jitter: <10ms under normal load.
- Cold boot: <2s to interactive on modern laptop.
- Audio unlock: 1-click resume with clear state.
- UI: 60fps interactions on mid-range hardware.
- Storage: autosave every change with no data loss.

## Observability

- Telemetry for audio init failures and MIDI access failures.
- Performance metrics for scheduling drift and audio dropouts.
- UI interaction timing for slow devices.

## Security and Privacy

- All local project data stored on-device by default.
- Explicit user consent for MIDI and audio permissions.
- Cloud sync is opt-in with transparent data deletion.

## QA and Testing

- Unit tests for project model, serialization, and scheduler logic.
- Integration tests for transport + step triggers.
- E2E flow: create pattern, save, reload, export.
- E2E flow: add instrument, edit mixer, remove instrument, persist state.
- Performance harness for jitter and CPU profiling.

## Milestone Plan

1. **Foundation**
   - Refactor transport scheduling out of React render cycle.
   - Define project data model and serialization.
   - Add multi-track support with per-track sequencing.

2. **Creator Workflow**
   - Add per-step params (velocity, probability, microtiming, ratchet, note).
   - Add pattern chaining and scene view.
   - Add local persistence and project save/load.

2.1 **Instrument Rack + Mixer**
   - Add/remove instruments with a sub-sequencer per instrument.
   - Add mixer panel for gain/pan/mute/solo and instrument params.
   - Persist instrument rack and mixer state.

3. **Export and Performance**
   - MIDI export and audio rendering.
   - MIDI learn and external clock support.
   - Latency diagnostics and sync tools.

4. **Polishing**
   - Preset library and kit management.
   - Sharing links and cloud sync (optional).
   - Desktop packaging and distribution.

## Definition of Done (Feature Level)

- UI communicates state and errors clearly.
- Tests cover core logic and critical flows.
- Performance targets are met under typical load.
- Data is safe and recoverable with migrations in place.
