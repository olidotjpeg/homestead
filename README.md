# 🌸 The Homestead Garden

A gentle daily living support app for your partner. A pastel pink and sage green garden where completing daily tasks grows flowers, with Clover the owl companion powered by Claude.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) and enter your Anthropic API key on the first screen.

## Project structure

```
src/
├── types/
│   └── index.ts          # All shared TypeScript types
├── constants/
│   ├── config.ts         # WATER_GOAL, API config, storage keys, Clover's system prompt
│   ├── microSteps.ts     # Tiny step-by-step breakdowns per task
│   ├── moods.ts          # Mood options
│   ├── plants.ts         # Plant definitions (name, task, colours)
│   └── theme.ts          # Colour palette and font constants
├── lib/
│   └── persistence.ts    # localStorage save/load with daily reset logic
├── hooks/
│   └── useClover.ts      # Clover chat hook (API calls, message state)
├── styles/
│   └── global.css        # Animations, scrollbar, utility classes
├── components/
│   ├── ApiKeyScreen.tsx  # First-run API key entry
│   ├── CloverChat.tsx    # Chat interface with Clover
│   ├── GardenScene.tsx   # The main garden with all 8 plants
│   ├── MoodPicker.tsx    # Morning mood selector
│   ├── NewDayBanner.tsx  # Gentle new-day notification
│   ├── PlantSVG.tsx      # Individual SVG plant renderer
│   ├── TaskRow.tsx       # Task item with micro-steps
│   └── WaterTracker.tsx  # Water jug and intake tracker
├── App.tsx               # Root component — wires everything together
└── main.tsx              # Entry point
```

## Features

- **Garden that grows** — each of 8 daily tasks tends a different plant (Rose, Peony, Sweet Pea, Cherry Blossom, Mint, Chamomile, Foxglove, Strawberry)
- **Saves progress** — state persists across page refreshes, keyed by date
- **Daily reset** — at midnight the garden resets to fresh soil; a gentle banner shows yesterday's count
- **Micro-steps** — each task can expand into 4 tiny concrete steps to help with starting; completing all steps auto-ticks the task
- **Low spoon mode** — collapses to 3 tasks and notifies Clover
- **Clover chat** — powered by Claude Haiku via the Anthropic API
- **Water tracker** — a fillable pink watering can

## Customising tasks

Edit `src/constants/plants.ts` to change task labels and plant names, and `src/constants/microSteps.ts` to update the tiny steps for each one.

## Deploying

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

The `dist/` folder can be deployed to Vercel, Netlify, or any static host.

## API key

The app stores the Anthropic API key in `localStorage` — it never leaves the browser except in direct calls to `api.anthropic.com`. To change it, click "change api key" in the app header.
