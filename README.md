<div align="center">

# Virtual 3D Chemistry Laboratory

**A hands-on chemistry lab for the browser.**

Explore laboratory equipment, measure mass and volume, transfer liquids, and calculate density in an interactive 3D workspace built for learning by doing.

<p>
  <a href="https://github.com/123bruke/3d_labs"><img src="https://img.shields.io/badge/GitHub-123bruke%2F3d__labs-181717?style=flat-square&logo=github" alt="GitHub repository" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=20232A" alt="React 19" />
  <img src="https://img.shields.io/badge/Three.js-0.186-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

</div>

---

## What is this?

The Virtual 3D Chemistry Laboratory is an interactive learning environment where chemistry concepts become something you can see and manipulate.

Instead of only reading about tare measurements, menisci, or density, you can set up the equipment, pour the liquid, watch the balance settle, and record the result. The goal is not to replace a real laboratory—it is to make the reasoning behind common laboratory procedures easier to understand and practice.

The project currently includes two guided experiments:

- **Mass and Volume Measurement** — practice taring a balance, reading a graduated cylinder, and comparing the mass and volume of water.
- **Density of Liquids** — measure mass and volume, calculate `ρ = m / V`, and compare water, ethanol, glycerol, and mineral oil.

## Screenshots

> The repository does not currently contain committed screenshot files. The image slots below are ready for project screenshots to be added under `docs/screenshots/`.

<!--
After adding screenshots, replace the paths below with the actual files:

![3D laboratory overview](docs/screenshots/lab-overview.png)
*The main 3D workspace with the balance, graduated cylinder, beaker, and reagent dispenser.*

![Experiment workflow](docs/screenshots/experiment-workflow.png)
*The guided experiment panel showing the current procedure and measurements.*

![Density results](docs/screenshots/density-results.png)
*The results view for comparing measured and reference liquid densities.*
-->

<p align="center">
  <em>Interactive 3D workspace · Guided experiments · Live measurements</em>
</p>

## Highlights

### A lab you can interact with

- Move and position equipment on the workbench.
- Place containers on the digital balance.
- Switch between overview and experiment camera views.
- Inspect equipment and measurements through the lab HUD.
- Toggle laboratory lighting and heat effects.

### Measurements that respond to your actions

- Tare the balance to remove container mass.
- Track liquid volume in each container.
- Dispense liquid from the reagent bottle.
- Transfer liquid between the beaker and graduated cylinder.
- Let the balance stabilize after equipment or liquid changes.
- Record observations as you work through an experiment.

### Guided scientific workflows

Each experiment is represented as structured data containing its objectives, principles, required equipment, materials, formulas, steps, and hints. The validation system checks whether the workstation is ready before the simulation begins.

## How the experience works

1. **Choose an experiment** from the experiment selector.
2. **Prepare the workstation** with the required equipment.
3. **Set up the measurement** by placing a container on the balance and taring it.
4. **Add or transfer liquid** using the interactive controls.
5. **Read the result** from the balance and graduated cylinder.
6. **Calculate and record** the relevant measurement or density.
7. **Review the result** and reset the lab for another trial.

## Built with

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| 3D rendering | Three.js, React Three Fiber, `@react-three/drei` |
| State | Zustand |
| Styling | Tailwind CSS and custom CSS |
| Build tooling | Vite, esbuild |
| Motion and icons | Motion, lucide-react |
| AI integration | Google GenAI SDK |
| Server support | Express and dotenv |

## Project structure

```text
src/
├── chemistry/                 # Experiment, equipment, and material definitions
│   ├── equipment.ts
│   ├── experiments.ts
│   └── materials.ts
├── components/               # Interface panels, drawers, modals, and navigation
├── simulation/               # Measurements, validation, experiment flow, and audio
│   ├── ExperimentEngine.ts
│   ├── MeasurementSystem.ts
│   ├── ValidationSystem.ts
│   └── labAudio.ts
├── store/                    # Zustand laboratory state
│   └── labStore.ts
├── three/                    # 3D scene and React Three Fiber objects
├── types/                    # Shared TypeScript types
├── App.tsx                   # Application composition and flow overlays
└── main.tsx                  # Frontend entry point
```

## Run it locally

### Requirements

- Node.js 20 or newer
- npm or Bun
- A browser with WebGL support

### 1. Clone the repository

```bash
git clone https://github.com/123bruke/3d_labs.git
cd 3d_labs
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 3. Configure your environment

Create a local environment file from the example:

```bash
cp .env.example .env
```

Then update the values when your environment requires them:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

`GEMINI_API_KEY` is intended for Gemini-powered functionality. Do not commit real API keys to the repository. In AI Studio, configure secrets through the platform's Secrets panel instead of placing them in source control.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite on port `3000` |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript without emitting files |
| `npm run clean` | Remove generated build artifacts |

## A note on simulation accuracy

This is an educational simulation, not a laboratory-grade measurement instrument. Values are modeled to support the learning workflow, including balance readings, liquid capacities, tare offsets, density comparisons, and temperature-related lab state. Results should not be used for real-world chemical, medical, or engineering decisions.

## Contributing

If you have an idea for a new experiment, a more realistic interaction, or a better way to explain a chemistry concept, contributions are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/my-improvement`.
3. Make your changes and run `npm run lint` and `npm run build`.
4. Open a pull request with a short explanation and screenshots or a screen recording when the change affects the interface.

## License

No license has been declared for this repository yet. Until a license is added, the code should be treated as **all rights reserved**. If you plan to share or reuse the project, please add a license that matches your intended use.

## Acknowledgements

This project brings together React, Three.js, React Three Fiber, Zustand, Tailwind CSS, and the Google GenAI SDK to create a more approachable way to learn fundamental laboratory procedures.

---

<div align="center">
  Made for curious learners who would rather <strong>try the experiment</strong> than only read about it.
</div>
