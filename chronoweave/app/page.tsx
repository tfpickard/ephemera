"use client";

import { useEffect, useMemo, useState } from "react";

type Emotion =
  | "Wonder"
  | "Defiance"
  | "Grace"
  | "Curiosity"
  | "Resolve"
  | "Reverie"
  | "Velocity";

type EmotionProfile = {
  emotion: Emotion;
  glyph: string;
  tagline: string;
  colors: readonly [string, string, string];
  aura: string;
};

type ThreadState = "looming" | "reflection" | "archived";

type ThreadResolution = "weaved" | "released";

type ThreadInsights = {
  futureEcho: string;
  microRitual: string;
  signal: string;
  anchor: string;
  mantra: string;
  pattern: {
    name: string;
    colors: string[];
    glyph: string;
  };
  vector: [number, number];
};

type Thread = {
  id: string;
  title: string;
  horizon: number;
  emotion: Emotion;
  impact: string;
  trigger: string;
  createdAt: number;
  lifespanMs: number;
  energy: number;
  state: ThreadState;
  resolution?: ThreadResolution;
  insights: ThreadInsights;
};

const EMOTION_PROFILES: readonly EmotionProfile[] = [
  {
    emotion: "Wonder",
    glyph: "✶",
    tagline: "invite improbable allies",
    colors: ["#8FF0FF", "#FFB3FF", "#FFF2A8"],
    aura: "A luminous hush spreads from patient curiosity."
  },
  {
    emotion: "Defiance",
    glyph: "⚡",
    tagline: "re-code the expected",
    colors: ["#9EE37D", "#FF8FA3", "#FFE9B1"],
    aura: "Raw momentum converts friction into possibility."
  },
  {
    emotion: "Grace",
    glyph: "☽",
    tagline: "glide through thresholds",
    colors: ["#C7D3FF", "#A98BFF", "#FFD5EC"],
    aura: "Soft recalibrations ripple outward silently."
  },
  {
    emotion: "Curiosity",
    glyph: "❂",
    tagline: "follow glints of pattern",
    colors: ["#98F5FF", "#FFC6FF", "#FAFFAF"],
    aura: "Questions resonate like tuning forks."
  },
  {
    emotion: "Resolve",
    glyph: "✹",
    tagline: "anchor the improbable",
    colors: ["#FEB47B", "#FF6F91", "#FFD480"],
    aura: "Focused heat forges through doubt."
  },
  {
    emotion: "Reverie",
    glyph: "☄",
    tagline: "let awe do the heavy lifting",
    colors: ["#B4C5FF", "#EFB0FF", "#FFE0B5"],
    aura: "Dream logic seeps into waking plans."
  },
  {
    emotion: "Velocity",
    glyph: "➿",
    tagline: "surf the emergent",
    colors: ["#A0FFAF", "#7DE9FF", "#FFE585"],
    aura: "Acceleration becomes choreography."
  }
] as const;

const emotionMap = EMOTION_PROFILES.reduce(
  (acc, profile) => {
    acc[profile.emotion] = profile;
    return acc;
  },
  {} as Record<Emotion, EmotionProfile>
);

const triggerOptions = [
  "When the sky shifts color",
  "At the first ping from your inbox",
  "Whenever a stranger's laugh catches you",
  "After you close your laptop for the night",
  "As the kettle begins to whisper",
  "When your playlist surprises you",
  "Just after you dodge a notification",
  "As soon as you feel hesitation",
  "When the streetlights wake up",
  "Upon tasting the first sip of something warm"
];

const echoOpeners = [
  "In an alternate timeline,",
  "Future you murmurs that",
  "A ripple from next week insists",
  "A pocket universe is preparing",
  "Chronicles from tomorrow reveal",
  "An emergent ally signals",
  "The probability weaver hints",
  "A parallel morning makes clear"
];

const echoConnectors = [
  "the smallest courage",
  "an impossible kindness",
  "a reframed question",
  "an unguarded laugh",
  "the decision hiding in your posture",
  "the promise you whispered",
  "the wobble before delight",
  "a yes disguised as static"
];

const ritualActions = [
  "let your shoulders drop and inhale on a count of five",
  "draw the sigil in your palm with your thumb",
  "name one person who could help amplify it",
  "speak the intention into the nearest reflective surface",
  "tune your breath to the hum of passing electricity",
  "press your fingertips together and feel the warmth consolidate",
  "sketch the outline of the idea in the air",
  "send a seven-word note describing the spark to a friend"
];

const signalPhrases = [
  "a chromatic echo",
  "a fleeting scent of petrichor",
  "a chord progression that stutters",
  "the second star from the left",
  "a notification that feels like déjà vu",
  "the exact angle of sunlight that once found you",
  "a lyric that was not in the song yesterday",
  "an unfamiliar bird call"
];

const anchorObjects = [
  "a sticky note folded into a mini prism",
  "an origami star smuggled into your pocket",
  "the corner of your favorite page",
  "a rogue paperclip bent into a helix",
  "the next receipt you would usually toss",
  "a piece of packaging that deserves better",
  "a pebble that fits behind your ear",
  "the inside cover of your notebook"
];

const patternDescriptors = [
  "Tidal Lattice",
  "Signal Bloom",
  "Gravity Sketch",
  "Reverb Spiral",
  "Aurora Circuit",
  "Echo Loom",
  "Nebula Kinship",
  "Sovereign Drift"
];

const reciprocityPreambles = [
  "If these two threads met at twilight",
  "Imagine braiding their pulses",
  "Let their frequencies harmonize",
  "Suppose they co-design a gesture",
  "Invite a rendezvous between them",
  "When their cadences overlap"
];

const reciprocityDirectives = [
  "script a single sentence they would co-sign",
  "design a mnemonic artifact that references both",
  "schedule a micro-adventure that satisfies each",
  "record a 20-second audio spell to replay later",
  "trade artifacts between their future holders",
  "host a 90-second retrospective after the fact"
];

const reciprocityCatalysts = [
  "Share the resulting evidence with someone unexpected.",
  "Document the blend as a glyph in your notes.",
  "Let the experiment evaporate after you whisper it once.",
  "Archive the memory as coordinates on a map you draw.",
  "Offer gratitude to whichever thread follows through first.",
  "Send proof to a friend who will keep you honest."
];

function createDeterministicRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function extractKeyword(text: string, fallback: string) {
  const words = text
    .split(/[^A-Za-z]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 4);
  if (!words.length) {
    return fallback;
  }
  const sorted = [...words].sort((a, b) => b.length - a.length);
  return sorted[0].toLowerCase();
}

function generateInsights(
  id: string,
  title: string,
  emotion: Emotion,
  impact: string,
  horizon: number,
  trigger: string
): ThreadInsights {
  const profile = emotionMap[emotion];
  const keyword = extractKeyword(impact || title, "your intention");
  const seed = `${id}-${title}-${emotion}-${horizon}-${trigger}-${impact}`;
  const rand = createDeterministicRandom(seed);

  const futureEcho = `${pick(echoOpeners, rand)} ${pick(
    echoConnectors,
    rand
  )} becomes inevitable when ${keyword} is honored.`;

  const microRitual = `Each time ${trigger.toLowerCase()}, ${pick(
    ritualActions,
    rand
  )}. Then whisper \"${title}\" once.`;

  const signal = `Listen for ${pick(signalPhrases, rand)} — that's the confirmation ping.`;

  const anchor = `Tuck ${pick(anchorObjects, rand)} nearby as a temporary anchor.`;

  const patternName = `${profile.glyph} ${pick(patternDescriptors, rand)}`;
  const extraColor = `hsla(${Math.floor(rand() * 360)}, 92%, ${60 +
    Math.floor(rand() * 20)}%, 0.85)`;

  const mantra = `${profile.glyph} ${profile.tagline.toUpperCase()} — ${
    keyword.includes(" ") ? keyword : keyword.toUpperCase()
  } pulses ${horizon} steps ahead.`;

  return {
    futureEcho,
    microRitual,
    signal,
    anchor,
    mantra,
    pattern: {
      name: patternName,
      colors: [...profile.colors, extraColor],
      glyph: profile.glyph
    },
    vector: [rand(), rand()]
  };
}

function energyNarrative(energy: number, state: ThreadState) {
  if (state === "archived") {
    return "Archived — resonance logged.";
  }
  if (state === "reflection") {
    return "Phase shift pending your decision.";
  }
  if (energy > 66) {
    return "Looming brightly.";
  }
  if (energy > 33) {
    return "Vibrating steadily.";
  }
  if (energy > 10) {
    return "Signal flickering.";
  }
  return "Almost ready to resolve.";
}

function formatHorizon(days: number) {
  if (days <= 3) {
    return `${days * 4} hours`; // accelerate for playful pacing
  }
  if (days <= 7) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  const weeks = Math.max(1, Math.round(days / 7));
  return `${weeks} week${weeks > 1 ? "s" : ""}`;
}

function computeBalance(
  threads: Thread[]
): { score: number; interpretation: string } {
  const fulfilled = threads.filter(
    (thread) => thread.resolution === "weaved"
  ).length;
  const released = threads.filter(
    (thread) => thread.resolution === "released"
  ).length;
  const active = threads.filter((thread) => thread.state === "looming").length;
  const baseScore = (fulfilled + 1) / (released + 1);
  const score = Math.round(baseScore * 100) / 100;
  let interpretation = "Temporal balance calibrating.";
  if (score > 1.6) {
    interpretation = "Future-self is grinning ear to ear.";
  } else if (score > 1.2) {
    interpretation = "Trajectory leaning toward luminous outcomes.";
  } else if (score < 0.8) {
    interpretation = "Consider releasing something to make room.";
  } else if (active > 4) {
    interpretation = "Plenty of threads to keep your present busy.";
  }
  return { score, interpretation };
}

function pairThreadsNarrative(threads: Thread[], selectedIds: string[]) {
  if (selectedIds.length !== 2) {
    return null;
  }
  const [firstId, secondId] = selectedIds;
  const first = threads.find((thread) => thread.id === firstId);
  const second = threads.find((thread) => thread.id === secondId);
  if (!first || !second) {
    return null;
  }
  const rand = createDeterministicRandom(`${first.id}-${second.id}`);
  return `${pick(reciprocityPreambles, rand)}: ${pick(
    reciprocityDirectives,
    rand
  )} ${pick(reciprocityCatalysts, rand)}`;
}

function createThread(
  title: string,
  horizon: number,
  emotion: Emotion,
  impact: string,
  trigger: string
): Thread {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
  const lifespanMs = (horizon + 4) * 6000 + Math.floor(Math.random() * 12000);
  const insights = generateInsights(id, title, emotion, impact, horizon, trigger);
  return {
    id,
    title,
    horizon,
    emotion,
    impact,
    trigger,
    createdAt: Date.now(),
    lifespanMs,
    energy: 100,
    state: "looming",
    insights
  };
}

function ResonanceField({ threads }: { threads: Thread[] }) {
  if (!threads.length) {
    return (
      <div className="resonance-field card">
        <p>
          Every intention you weave will appear here as an orbiting light. Select two to
          discover how they might collaborate.
        </p>
      </div>
    );
  }

  return (
    <div className="resonance-field card">
      <svg viewBox="0 0 100 100" className="resonance-canvas" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="resonance-center" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(143, 240, 255, 0.8)" />
            <stop offset="70%" stopColor="rgba(143, 240, 255, 0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#resonance-center)" opacity="0.4" />
        {threads.map((thread) => {
          const [vx, vy] = thread.insights.vector;
          const x = 12 + vx * 76;
          const y = 12 + vy * 76;
          const color = thread.insights.pattern.colors[0];
          const size = 6 + (thread.energy / 100) * 10;
          const stroke = thread.state === "looming" ? "rgba(143, 240, 255, 0.6)" : "rgba(248, 255, 138, 0.45)";
          return (
            <g key={thread.id}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="transparent"
                stroke={stroke}
                strokeWidth="0.8"
              />
              <circle cx={x} cy={y} r={size * 0.7} fill={color} opacity="0.4" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="4" fill="#0C1223">
                {emotionMap[thread.emotion].glyph}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="resonance-caption">
        <span className="badge">Collective Resonance</span>
        <p>
          Threads drift according to their curiosity vectors. Brighter orbits are closer
          to the present, while faded ones await reflection.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [impact, setImpact] = useState("Reframe how I open my mornings.");
  const [horizon, setHorizon] = useState(5);
  const [emotion, setEmotion] = useState<Emotion>("Curiosity");
  const [trigger, setTrigger] = useState(triggerOptions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.state !== "looming") {
            return thread;
          }
          const elapsed = Date.now() - thread.createdAt;
          const fraction = Math.min(1, elapsed / thread.lifespanMs);
          const nextEnergy = Math.max(0, 100 - fraction * 100);
          if (nextEnergy === thread.energy && fraction < 1) {
            return thread;
          }
          if (fraction >= 1) {
            return { ...thread, energy: 0, state: "reflection" };
          }
          return { ...thread, energy: nextEnergy };
        })
      );
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    const looming = threads.filter((thread) => thread.state === "looming").length;
    const reflection = threads.filter((thread) => thread.state === "reflection").length;
    const archived = threads.filter((thread) => thread.state === "archived").length;
    const { score, interpretation } = computeBalance(threads);
    const averageEnergy =
      threads.length === 0
        ? 0
        : Math.round(
            threads.reduce((acc, thread) => acc + thread.energy, 0) / threads.length
          );
    return { looming, reflection, archived, score, interpretation, averageEnergy };
  }, [threads]);

  const reciprocityNarrative = useMemo(
    () => pairThreadsNarrative(threads, selectedIds),
    [threads, selectedIds]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setTitle("");
      return;
    }
    setThreads((prev) => [
      createThread(title.trim(), horizon, emotion, impact.trim(), trigger),
      ...prev
    ]);
    setTitle("");
  };

  const handleResolution = (id: string, resolution: ThreadResolution) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? { ...thread, resolution, state: "archived", energy: resolution === "weaved" ? 100 : 5 }
          : thread
      )
    );
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length === 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const randomizeSeed = () => {
    const randomEmotion = pick(EMOTION_PROFILES, Math.random).emotion;
    const randomTrigger = triggerOptions[Math.floor(Math.random() * triggerOptions.length)];
    const randomHorizon = 3 + Math.floor(Math.random() * 9);
    const sampleIntentions = [
      "Prototype the boldest idea in my backlog.",
      "Transform my commute into a creative lab.",
      "Turn restless energy into a healing ritual.",
      "Invite unlikely collaborators to orbit this idea.",
      "Upgrade my Tuesday mornings into something cinematic."
    ];
    setEmotion(randomEmotion);
    setTrigger(randomTrigger);
    setHorizon(randomHorizon);
    setImpact(sampleIntentions[Math.floor(Math.random() * sampleIntentions.length)]);
    setTitle("Slipstream " + pick(patternDescriptors, Math.random));
  };

  return (
    <main>
      <header className="hero card">
        <div>
          <span className="badge">Temporal Accord Studio</span>
          <h1>
            Weave treaties with your <span className="gradient-text">future self</span>.
          </h1>
          <p>
            Chronoweave is a laboratory for temporal diplomacy. Design micro-rituals,
            listen for signals, and negotiate momentum between who you are now and who you
            are becoming. Threads decay in real-time, inviting decisive, playful action.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={randomizeSeed}>
              Surprise me with a wild thread
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setThreads([])}
              disabled={!threads.length}
            >
              Clear loom
            </button>
          </div>
        </div>
        <div className="hero-metrics card">
          <div>
            <span className="metric-label">Temporal balance</span>
            <div className="metric-value">{metrics.score.toFixed(2)}</div>
            <p>{metrics.interpretation}</p>
            <div className="balance-bar">
              <div
                style={{ width: `${Math.min(100, metrics.score * 50)}%` }}
                className="balance-bar-fill"
              />
            </div>
          </div>
          <div className="metric-grid">
            <div>
              <span className="metric-number">{metrics.looming}</span>
              <small>looming</small>
            </div>
            <div>
              <span className="metric-number">{metrics.reflection}</span>
              <small>awaiting reflection</small>
            </div>
            <div>
              <span className="metric-number">{metrics.archived}</span>
              <small>archived</small>
            </div>
            <div>
              <span className="metric-number">{metrics.averageEnergy}%</span>
              <small>avg. energy</small>
            </div>
          </div>
        </div>
      </header>

      <section className="creation-lab">
        <form className="composer card" onSubmit={handleSubmit}>
          <h2>Create a new thread</h2>
          <p>Shape a future promise, define its trigger, and let it simmer in the loom.</p>
          <div className="form-grid">
            <div>
              <label htmlFor="title">Thread name</label>
              <input
                id="title"
                value={title}
                placeholder="Plot a renegade dawn"
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="horizon">Horizon (playful days)</label>
              <input
                id="horizon"
                type="range"
                min={1}
                max={14}
                value={horizon}
                onChange={(event) => setHorizon(Number(event.target.value))}
              />
              <small>{formatHorizon(horizon)}</small>
            </div>
            <div>
              <label htmlFor="emotion">Emotional fuel</label>
              <select
                id="emotion"
                value={emotion}
                onChange={(event) => setEmotion(event.target.value as Emotion)}
              >
                {EMOTION_PROFILES.map((profile) => (
                  <option key={profile.emotion} value={profile.emotion}>
                    {profile.glyph} {profile.emotion} — {profile.tagline}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="trigger">Trigger condition</label>
              <select
                id="trigger"
                value={trigger}
                onChange={(event) => setTrigger(event.target.value)}
              >
                {triggerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="impact">Why it matters</label>
            <textarea
              id="impact"
              rows={3}
              value={impact}
              placeholder="Describe the ripple you want to cause."
              onChange={(event) => setImpact(event.target.value)}
            />
          </div>
          <footer className="composer-footer">
            <button type="submit">Loom this thread</button>
            <small>Threads fade into reflection if untouched. Archive them intentionally.</small>
          </footer>
        </form>
        <ResonanceField threads={threads} />
      </section>

      <section className="thread-gallery">
        <div className="gallery-head">
          <h2>Active threads</h2>
          <p>
            Select two threads to negotiate a reciprocity experiment. Archived threads keep
            their glow as receipts for your temporal diplomacy.
          </p>
        </div>
        <div className="grid">
          {threads.length === 0 ? (
            <div className="empty card">
              <p>
                The loom is quiet. Seed a thread and watch it orbit — Chronoweave works best
                with audacious intentions.
              </p>
            </div>
          ) : (
            threads.map((thread) => {
              const profile = emotionMap[thread.emotion];
              const selected = selectedIds.includes(thread.id);
              return (
                <article
                  key={thread.id}
                  className={`thread-card card ${selected ? "selected" : ""} ${thread.state}`}
                  onClick={() => toggleSelected(thread.id)}
                  style={{
                    borderColor: selected
                      ? "rgba(248, 255, 138, 0.8)"
                      : "rgba(124, 180, 255, 0.18)",
                    background: `radial-gradient(circle at 20% 20%, ${thread.insights.pattern.colors[0]}33, transparent 55%), radial-gradient(circle at 80% 20%, ${thread.insights.pattern.colors[1]}22, transparent 45%), var(--panel)`
                  }}
                >
                  <header>
                    <span className="glyph">{profile.glyph}</span>
                    <div>
                      <h3>{thread.title}</h3>
                      <small>{profile.tagline}</small>
                    </div>
                    <span className="emotion-tag">{thread.emotion}</span>
                  </header>
                  <p className="aura">{profile.aura}</p>
                  <p className="insight">{thread.insights.futureEcho}</p>
                  <div className="insight-block">
                    <h4>Micro-ritual</h4>
                    <p>{thread.insights.microRitual}</p>
                  </div>
                  <div className="insight-block">
                    <h4>Signal to notice</h4>
                    <p>{thread.insights.signal}</p>
                  </div>
                  <div className="insight-block">
                    <h4>Anchor</h4>
                    <p>{thread.insights.anchor}</p>
                  </div>
                  <div className="mantra">{thread.insights.mantra}</div>
                  <div className="energy">
                    <div className="energy-bar">
                      <div
                        className="energy-bar-fill"
                        style={{ width: `${Math.max(6, thread.energy)}%` }}
                      />
                    </div>
                    <small>{energyNarrative(thread.energy, thread.state)}</small>
                    <small>
                      Horizon: {formatHorizon(thread.horizon)} • Trigger: {thread.trigger.toLowerCase()}
                    </small>
                  </div>
                  {thread.state === "reflection" && (
                    <div className="resolution-panel">
                      <button type="button" onClick={() => handleResolution(thread.id, "weaved")}>I lived it</button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => handleResolution(thread.id, "released")}
                      >
                        Release with gratitude
                      </button>
                    </div>
                  )}
                  {thread.state === "archived" && thread.resolution && (
                    <div className={`archive-tag ${thread.resolution}`}>
                      {thread.resolution === "weaved" ? "Fulfilled" : "Released"}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      {reciprocityNarrative && (
        <section className="reciprocity card">
          <h2>Reciprocity experiment</h2>
          <p>{reciprocityNarrative}</p>
          <small>
            Deselect a card to draft a new experiment. Reciprocity experiments reset after
            completion.
          </small>
        </section>
      )}

      <footer className="footer">
        <p>
          Chronoweave is a speculative tool for creative futurists. Host it on Vercel, share
          your wildest treaties, and document what actually happened.
        </p>
      </footer>
    </main>
  );
}
