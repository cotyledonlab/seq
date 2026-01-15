# SEQ - Browser-based Multi-Track MIDI Sequencer

A modern, browser-based multi-track MIDI sequencer built with React, Tone.js, and Web MIDI API.

This repo currently ships a multi-track step sequencer with an instrument rack, per-instrument lanes, mixer controls, and variable pattern lengths. The long-term vision is a production-ready, musician-grade sequencing environment that runs in the browser (and optionally as a desktop app via Tauri) with reliable MIDI I/O, low-latency audio, rich pattern editing, and export workflows that match how modern producers and live performers actually work.

## Current State (What Exists Today)

- Multi-track step grid (drum, bass, lead) with per-track mute.
- Pattern length selection (8/16/32/64) with step resizing.
- Per-step editor for velocity, probability, microtiming, ratchet, note, and length.
- Step editor navigation with step preview and follow-playhead mode.
- Ratchet playback for stuttered step repeats.
- Project controls with autosave, manual snapshots, and JSON import/export.
- Transport controls (play/stop) and tempo input.
- Instrument rack with add/remove, rename, and integrated mixer controls.
- Web MIDI device selection and MIDI note-on input playback.
- Transport scheduling separated from UI state updates for steadier timing.
- React + TypeScript UI, Tailwind-based styling.

## Productionized End-State Vision

SEQ becomes a fast, dependable, and expressive sequencing workspace for web-native music creation. Think: a compact groovebox and pattern composer that feels immediate like hardware, but modern like a web app. It is optimized for:

- Live sketching and performance (low latency, stable sync).
- Multi-track pattern building with advanced step parameters.
- Rapid export and sharing of patterns, loops, and stems.
- Browser-first UX with optional desktop distribution (Tauri).

### Product Direction Informed by Trends

- Web-native music tools are growing in capability and acceptance (Web Audio + Web MIDI maturity).
- Producers are shifting toward pattern-based workflows (short loops, clips, scenes, live sets).
- Creator economy expects fast sharing, remixability, and export options.
- MIDI 2.0 / MPE adoption is growing, and expressive control is a differentiator.
- Generative and assistive tooling is becoming standard (suggested patterns, rhythm fills, variation tools).

SEQ should meet these trends with a compact, modern sequencing experience that does not require a full DAW but still feels production-ready.

## Productionized Feature Set (Target)

### Sequencing

- Expand multi-track sequencing beyond the current 3-track setup.
- Variable step lengths (8/16/32/64) and time signatures.
- Per-step parameters: velocity, probability, ratchets, microtiming, tie/slide.
- Pattern chaining and scene arrangement for live sets.
- Swing and groove templates.

### Sound Engine

- Multi-voice synth options (mono/poly) with preset library.
- Drum sampler with kit management.
- Audio effect chain per track (filter, delay, reverb, distortion).
- MIDI out routing per track.
- MPE and MIDI 2.0 compatibility where possible.

### MIDI and Hardware

- Robust MIDI device management and hot-swap detection.
- MIDI learn and control mapping UI.
- Sync options: internal clock, external MIDI clock.
- Latency compensation and timing diagnostics.

### Export and Sharing

- Export MIDI patterns and clips.
- Render audio loops and stems.
- Shareable links with embedded sequence state.
- Preset and pattern library with tagging.

### Collaboration and Cloud (Optional)

- Optional account-based sync for pattern libraries.
- Live collaboration or shared sets for education and co-creation.

## Technical Architecture (Target)

- Audio: Tone.js or custom AudioWorklet engine for lower jitter.
- Timing: single transport clock, track-specific scheduling with lookahead.
- State: structured pattern model with deterministic playback.
- Persistence: local storage for quick saves, cloud storage for sync.
- Platform: Vite + React for web, Tauri build for desktop.
- Quality: automated tests for scheduling, UI, and MIDI integration.

## Non-Functional Requirements

- Sub-10ms scheduling jitter under normal load.
- Works on Chromium, Safari (with Web MIDI polyfill if needed), and Firefox (MIDI limitations noted).
- Offline-capable with local persistence.
- Clear error handling for MIDI and audio initialization.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A modern web browser with Web MIDI API support
- (Optional) MIDI keyboard or controller

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cotyledonlab/seq.git
cd seq
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Usage

1. Press Play to initialize the audio context
2. Select a MIDI input device (optional)
3. Use the transport controls to start/stop the sequence
4. Choose your pattern length (8/16/32/64)
5. Click on the step buttons to create your patterns per track
6. Select a step to edit velocity, probability, microtiming, and ratchet
7. Mute tracks as needed
8. Add or remove instrument lanes from the Instrument Rack
9. Open Mix for a lane and balance levels/envelopes
10. Open the Project menu to rename, save, or export your project
11. Adjust tempo as needed

## Tech Stack

- React
- TypeScript
- Tone.js
- Web MIDI API
- Vite

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
