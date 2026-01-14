# SEQ - Productionized Specification

## Goals

- Deliver a browser-native sequencer that feels as immediate as hardware.
- Support multi-track pattern composition with reliable timing and export options.
- Provide a modern workflow for loop-based production and live performance.

## Non-goals (Initial)

- Full DAW replacement or audio multitrack recording.
- Third-party plugin hosting (VST/AU).
- Complex score editor or notation features.

## Personas

- Live performer: needs low latency, stable sync, quick pattern switching.
- Beat maker: needs fast pattern creation, export to DAWs, kit management.
- Educator/student: needs simple sharing, clear UI, browser access.

## Core UX

- Pattern grid with multiple tracks (drum, melodic, bass).
- Per-step parameters: velocity, probability, ratchet, microtiming, tie.
- Scene view: chain patterns into a live set.
- Single-click play/stop with clear transport and sync status.

### Step Editing UX (Near-term)

- Step selection highlights the active lane + column.
- Step Inspector panel exposes per-step velocity, probability, microtiming, ratchet, note, and length.
- Edits are instant and audible with the transport running.

## Functional Requirements

### Sequencing

- Variable step length per pattern: 8/16/32/64.
- Time signature controls and pattern lengths per track.
- Swing percentage and groove templates.
- Pattern chaining and clips per track.
- Undo/redo for edit history.
- Step inspector editing for per-step parameters (velocity, probability, microtiming, ratchet, note).

### Sound Engine

- Multiple synth engines (mono/poly) with preset library.
- Drum sampler with kit loading and sample trimming.
- Per-track FX chain with bypass and reorder.

### MIDI and Hardware

- Input/output routing per track.
- MIDI learn for mapping transport, knobs, and faders.
- External clock support (MIDI clock in/out).

### Export and Sharing

- Export MIDI clip or full arrangement.
- Render audio loops/stems per track.
- Shareable link with embedded sequence state.

### Persistence

- Local storage for autosave.
- Optional cloud sync (account-based) for projects and presets.

## Data Model (Draft)

- Project: id, name, bpm, timeSignature, tracks[], scenes[].
- Track: id, type (drum/synth/midi), device, steps[], fx[].
- Step: on, velocity, probability, microtiming, ratchet, note, length.
- Scene: id, ordered list of pattern references.

## Technical Design

### Audio and Timing

- Central transport clock with lookahead scheduling (audio thread safe).
- Consider AudioWorklet-based scheduler for lower jitter.
- Track events precomputed per bar to reduce render load.
- Ratchet playback should subdivide step duration without dropping velocity or microtiming offsets.

### State Management

- Use a normalized project state store.
- Separate UI state from audio scheduling state.
- Serialize project state for export and sharing.

### Persistence

- Local: IndexedDB for projects and samples.
- Cloud (optional): API for auth, project sync, asset storage.

### Platform

- Web-first with offline support (service worker).
- Optional Tauri build for desktop distribution.

## Quality Requirements

- Consistent event scheduling under load (<10ms jitter target).
- Reliable device detection and recovery on MIDI device changes.
- Clear error states for audio/MIDI permissions.

## Observability

- Telemetry for audio init failures and MIDI access failures.
- Performance metrics for scheduling drift.

## Milestone Plan

1. Foundation
   - Refactor transport scheduling out of React render cycle.
   - Define project data model and serialization.
   - Add multi-track support with per-track sequencing.

2. Creator Workflow
   - Add per-step params (velocity, probability, microtiming).
   - Add pattern chaining and scene view.
   - Add local persistence and project save/load.

3. Export and Performance
   - MIDI export and audio rendering.
   - MIDI learn and external clock support.
   - Latency diagnostics and sync tools.

4. Polishing
   - Preset library and kit management.
   - Sharing links and cloud sync (optional).
   - Desktop packaging and distribution.
