# SEQ - Browser-based MIDI Sequencer

A modern, browser-based MIDI sequencer built with React, Tone.js, and Web MIDI API.

## Features

- 16-step MIDI sequencer
- Real-time MIDI input support
- Built-in synthesizer powered by Tone.js
- Adjustable tempo control
- Bold, modern user interface
- MIDI device selection

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

1. Click "Start Audio" to initialize the audio context
2. Select a MIDI input device (optional)
3. Use the transport controls to start/stop the sequence
4. Click on the step buttons to create your pattern
5. Adjust tempo as needed

## Tech Stack

- React
- TypeScript
- Tone.js
- Web MIDI API
- Vite

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
