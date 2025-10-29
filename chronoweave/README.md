# Chronoweave — Temporal Accord Loom

Chronoweave is a speculative productivity playground for temporal diplomacy. Instead of
tracking to-do items, you weave **threads**—ephemeral treaties with your future self—that
slowly decay unless you ritualize them. It blends experiential design, speculative
foresight, and playful accountability into a visual loom that can be hosted on Vercel in a
single click.

## Why it feels different
- **Real-time decay mechanics.** Every thread has a living energy bar that fades in real
time. When it expires, you must either honour it or release it with gratitude.
- **Speculative insights without AI.** Procedurally generated micro-rituals, future echoes,
and sensory signals remix your own words instead of hallucinating with a model.
- **Reciprocity experiments.** Select any two threads to auto-draft a collaborative
experiment, encouraging you to combine ambitions that rarely co-exist.
- **Resonance field.** A living orbital map shows curiosity vectors for each thread so you
can sense how your commitments cluster.

## Getting started locally

```bash
pnpm install # or npm install
pnpm dev     # or npm run dev
```

The app lives at `http://localhost:3000` by default.

## Deploying to Vercel

1. Push this directory to a Git repository or add it to an existing mono-repo.
2. In Vercel, create a new project and select the `chronoweave` folder.
3. Set the framework preset to **Next.js** (it will be detected automatically).
4. Deploy — no environment variables are required.

## Folder structure

```
chronoweave/
├── app/
│   ├── globals.css        # Cosmic styling for the loom
│   ├── layout.tsx         # Global metadata + layout
│   └── page.tsx           # Entire Chronoweave experience
├── next.config.js         # Next.js configuration
├── package.json           # Scripts & dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # You are here
```

## Credits
Chronoweave was handcrafted for ephemera seekers who believe future selves deserve
handwritten treaties, not cold obligations. Steal this concept, remix it, and tell us what
your experiments unlock.
