<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:020617,100:0f172a&height=200&section=header&text=SEQ&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Browser-based%20MIDI%20Sequencer&descSize=20&descAlignY=58&descAlign=50">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:020617,100:0f172a&height=200&section=header&text=SEQ&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Browser-based%20MIDI%20Sequencer&descSize=20&descAlignY=58&descAlign=50">
  <img alt="SEQ Header" src="https://capsule-render.vercel.app/api?type=waving&color=0:020617,100:0f172a&height=200&section=header&text=SEQ&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Browser-based%20MIDI%20Sequencer&descSize=20&descAlignY=58&descAlign=50" width="100%">
</picture>

<div align="center">

A modern, browser-based multi-track MIDI sequencer built with React, Tone.js, and Web MIDI API.

[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3b82f6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-0f172a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![Tone.js](https://img.shields.io/badge/Tone.js-f472b6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAzdjEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1LTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNFY3aDRWM2gtNnoiLz48L3N2Zz4=)](https://tonejs.github.io/)
[![Vite](https://img.shields.io/badge/Vite-0f172a?style=for-the-badge&logo=vite&logoColor=646cff)](https://vitejs.dev/)

</div>

---

## 🎯 Overview

This repo currently ships a multi-track step sequencer with an instrument rack, per-instrument lanes, mixer controls, and variable pattern lengths. The long-term vision is a production-ready, musician-grade sequencing environment that runs in the browser (and optionally as a desktop app via Tauri) with reliable MIDI I/O, low-latency audio, rich pattern editing, and export workflows that match how modern producers and live performers actually work.

---

## 📸 Screenshots

> **Coming Soon** — Screenshots and demo GIFs will be added here showcasing the sequencer interface, step editor, and mixer controls.

<!-- 
Add screenshots like:
![Sequencer Grid](docs/images/sequencer-grid.png)
![Step Editor](docs/images/step-editor.png)
![Mixer Controls](docs/images/mixer.png)
-->

---

## ✨ Current Features

<table>
<tr>
<td width="50%" valign="top">

### 🎹 Sequencing
- Multi-track step grid (drum, bass, lead) with per-track mute
- Pattern length selection (8/16/32/64) with step resizing
- Per-step editor for velocity, probability, microtiming, ratchet, note, and length
- Step editor navigation with step preview and follow-playhead mode
- Ratchet playback for stuttered step repeats

</td>
<td width="50%" valign="top">

### 🎛️ Instruments & Mixing
- Instrument rack with add/remove and rename
- Integrated mixer controls per lane
- Transport controls (play/stop) and tempo input
- Transport scheduling separated from UI for steadier timing

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 MIDI Support
- Web MIDI device selection
- MIDI note-on input playback
- Hardware controller ready

</td>
<td width="50%" valign="top">

### 💾 Project Management
- Autosave and manual snapshots
- JSON import/export
- React + TypeScript UI with Tailwind styling

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A modern web browser with Web MIDI API support
- (Optional) MIDI keyboard or controller

### Installation

```bash
# Clone the repository
git clone https://github.com/cotyledonlab/seq.git
cd seq

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. **Press Play** to initialize the audio context
2. **Select a MIDI input device** (optional)
3. **Use the transport controls** to start/stop the sequence
4. **Choose your pattern length** (8/16/32/64)
5. **Click on step buttons** to create your patterns per track
6. **Select a step** to edit velocity, probability, microtiming, and ratchet
7. **Mute tracks** as needed
8. **Add or remove instrument lanes** from the Instrument Rack
9. **Open Mix** for a lane to balance levels/envelopes
10. **Open the Project menu** to rename, save, or export your project
11. **Adjust tempo** as needed

---

## 🔮 Vision & Roadmap

SEQ aims to become a fast, dependable, and expressive sequencing workspace for web-native music creation. Think: a compact groovebox and pattern composer that feels immediate like hardware, but modern like a web app.

### 🎯 Optimized For

- **Live sketching and performance** — low latency, stable sync
- **Multi-track pattern building** — advanced step parameters
- **Rapid export and sharing** — patterns, loops, and stems
- **Browser-first UX** — with optional desktop distribution (Tauri)

### 📈 Product Direction

- Web-native music tools are growing in capability and acceptance (Web Audio + Web MIDI maturity)
- Producers are shifting toward pattern-based workflows (short loops, clips, scenes, live sets)
- Creator economy expects fast sharing, remixability, and export options
- MIDI 2.0 / MPE adoption is growing, and expressive control is a differentiator
- Generative and assistive tooling is becoming standard (suggested patterns, rhythm fills, variation tools)

---

## 🗺️ Target Feature Set

<details>
<summary><b>🎹 Sequencing</b></summary>

- Expand multi-track sequencing beyond the current 3-track setup
- Variable step lengths (8/16/32/64) and time signatures
- Per-step parameters: velocity, probability, ratchets, microtiming, tie/slide
- Pattern chaining and scene arrangement for live sets
- Swing and groove templates

</details>

<details>
<summary><b>🔊 Sound Engine</b></summary>

- Multi-voice synth options (mono/poly) with preset library
- Drum sampler with kit management
- Audio effect chain per track (filter, delay, reverb, distortion)
- MIDI out routing per track
- MPE and MIDI 2.0 compatibility where possible

</details>

<details>
<summary><b>🎛️ MIDI and Hardware</b></summary>

- Robust MIDI device management and hot-swap detection
- MIDI learn and control mapping UI
- Sync options: internal clock, external MIDI clock
- Latency compensation and timing diagnostics

</details>

<details>
<summary><b>📤 Export and Sharing</b></summary>

- Export MIDI patterns and clips
- Render audio loops and stems
- Shareable links with embedded sequence state
- Preset and pattern library with tagging

</details>

<details>
<summary><b>☁️ Collaboration and Cloud (Optional)</b></summary>

- Optional account-based sync for pattern libraries
- Live collaboration or shared sets for education and co-creation

</details>

---

## 🏗️ Technical Architecture

| Layer | Technology |
|-------|------------|
| **Audio** | Tone.js or custom AudioWorklet engine for lower jitter |
| **Timing** | Single transport clock, track-specific scheduling with lookahead |
| **State** | Structured pattern model with deterministic playback |
| **Persistence** | Local storage for quick saves, cloud storage for sync |
| **Platform** | Vite + React for web, Tauri build for desktop |
| **Quality** | Automated tests for scheduling, UI, and MIDI integration |

### ⚡ Non-Functional Requirements

- Sub-10ms scheduling jitter under normal load
- Works on Chromium, Safari (with Web MIDI polyfill if needed), and Firefox (MIDI limitations noted)
- Offline-capable with local persistence
- Clear error handling for MIDI and audio initialization

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-0f172a?style=for-the-badge&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3b82f6?style=for-the-badge&logo=typescript&logoColor=white)
![Tone.js](https://img.shields.io/badge/Tone.js-f472b6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAzdjEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1LTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNFY3aDRWM2gtNnoiLz48L3N2Zz4=)
![Web MIDI](https://img.shields.io/badge/Web_MIDI-0f172a?style=for-the-badge&logo=midi&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-0f172a?style=for-the-badge&logo=vite&logoColor=646cff)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:020617&height=100&section=footer">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:020617&height=100&section=footer">
  <img alt="Footer" src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:020617&height=100&section=footer" width="100%">
</picture>

<div align="center">

**[Cotyledon Lab](https://cotyledonlab.com)** · Building tools for creators

</div>
