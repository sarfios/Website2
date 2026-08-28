import { useCallback, useEffect, useRef, useState } from "react";
import { boop as boopSound, chime, meow, purr } from "../lib/sound";
import { CloudIcon, HeartIcon } from "./icons";

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

const NAP_AT = 40;

const LEVELS: { name: string; at: number }[] = [
  { name: "Stranger", at: 0 },
  { name: "Snack Giver", at: 6 },
  { name: "Friend", at: 14 },
  { name: "Best Friend", at: 24 },
  { name: "Chosen Human", at: 36 },
];

const PHRASES: string[][] = [
  ["mew?", "…oh. hi.", "you may look.", "*sniffs your cursor*"],
  ["mrrp!", "prrt prrt", "oh—pets. yes.", "*tail goes up*"],
  ["purrrr…", "again! again!", "mew mew ♥", "*biscuits intensify*"],
  ["PURRRRRR!!", "you're my human now", "*happy headbonk*", "mewp mewp!!"],
  ["the prophecy is true", "all my naps are yours", "*slow blink of true love*", "mreow!!!"],
];

const BOOP_PHRASES = ["MEWP!", "the NOSE. really?", "*nose.exe stopped working*", "honk.", "that nose costs extra"];
const WAKE_PHRASES = ["mrrmph… five more minutes…", "zzz… huh? oh. hi.", "*stretches dramatically*", "who dares— oh, it's you ♥"];

const HEART_COLORS = ["#ff8fb3", "#66c0f4", "#f2a65e", "#beee11", "#c7d5e0"];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function levelOf(pets: number) {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (pets >= l.at) idx = i;
  });
  return idx;
}

type Heart = { id: number; x: number; y: number; dx: number; size: number; color: string; char: string };

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

export default function CatScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const bubbleTimer = useRef<number | null>(null);
  const napScheduled = useRef(false);
  const ambientTimer = useRef<number | null>(null);

  const [pets, setPets] = useState(0);
  const [meter, setMeter] = useState(0);
  const [naps, setNaps] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<{ id: number; text: string } | null>(null);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [pupils, setPupils] = useState({ x: 0, y: 0 });
  const [happyMouth, setHappyMouth] = useState(false);
  const [boopTick, setBoopTick] = useState(0);
  const [syncFlash, setSyncFlash] = useState(false);

  const levelIdx = levelOf(pets);
  const level = LEVELS[levelIdx];

  /* ---------------- helpers ---------------- */

  const showBubble = useCallback((text: string) => {
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    setBubble({ id: ++idRef.current, text });
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 1700);
  }, []);

  const spawnHearts = useCallback((x: number, y: number, n: number) => {
    const fresh: Heart[] = [];
    for (let i = 0; i < n; i++) {
      fresh.push({
        id: ++idRef.current,
        x: x + (Math.random() * 44 - 22),
        y: y + (Math.random() * 18 - 9),
        dx: Math.random() * 70 - 35,
        size: 13 + Math.random() * 13,
        color: pick(HEART_COLORS),
        char: Math.random() > 0.25 ? "♥" : "✦",
      });
    }
    setHearts((h) => [...h, ...fresh]);
    const ids = new Set(fresh.map((f) => f.id));
    window.setTimeout(() => setHearts((h) => h.filter((p) => !ids.has(p.id))), 1150);
  }, []);

  const flashSync = useCallback(() => {
    setSyncFlash(true);
    window.setTimeout(() => setSyncFlash(false), 900);
  }, []);

  /* ---------------- interactions ---------------- */

  const doPet = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;

      if (sleeping) {
        setSleeping(false);
        napScheduled.current = false;
        setMeter(0);
        meow();
        showBubble(pick(WAKE_PHRASES));
        spawnHearts(x, y, 2);
        return;
      }

      const prevLevel = levelOf(pets);
      const nextPets = pets + 1;
      const nextMeter = meter + 1;
      setPets(nextPets);
      setMeter(nextMeter);
      flashSync();
      purr();
      spawnHearts(x, y, 2 + Math.floor(Math.random() * 2));

      setHappyMouth(true);
      window.setTimeout(() => setHappyMouth(false), 850);

      const newLevel = levelOf(nextPets);
      if (newLevel > prevLevel) {
        chime();
        showBubble(`✦ rank up: ${LEVELS[newLevel].name}!`);
      } else {
        showBubble(pick(PHRASES[newLevel]));
      }

      if (nextMeter >= NAP_AT && !napScheduled.current) {
        napScheduled.current = true;
        window.setTimeout(() => {
          setSleeping(true);
          setNaps((n) => n + 1);
          chime();
          showBubble("*falls asleep mid-purrr*");
        }, 750);
      }
    },
    [sleeping, pets, meter, showBubble, spawnHearts, flashSync]
  );

  const doBoop = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      if (sleeping) {
        doPet(clientX, clientY);
        return;
      }
      setBoopTick((t) => t + 1);
      boopSound();
      showBubble(pick(BOOP_PHRASES));
      spawnHearts(clientX - r.left, clientY - r.top, 1);
    },
    [sleeping, doPet, showBubble, spawnHearts]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    doPet(e.clientX, e.clientY);
  };

  const onNoseDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    doBoop(e.clientX, e.clientY);
  };

  const onMove = (e: React.PointerEvent) => {
    if (sleeping) return;
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height * 0.35)) / r.height;
    setPupils({ x: clamp(dx * 10, -4, 4), y: clamp(dy * 8, -2.5, 3) });
  };

  /* ---------------- ambient life ---------------- */

  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2100 + Math.random() * 2700);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "p" || e.repeat) return;
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      doPet(r.left + r.width * 0.5, r.top + r.height * 0.5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doPet]);

  useEffect(() => {
    if (levelIdx < 2) return;
    ambientTimer.current = window.setInterval(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      spawnHearts(r.width * (0.35 + Math.random() * 0.3), r.height * 0.3, 1);
    }, 2800);
    return () => {
      if (ambientTimer.current) window.clearInterval(ambientTimer.current);
    };
  }, [levelIdx, spawnHearts]);

  const napPct = Math.min(100, Math.round((meter / NAP_AT) * 100));
  const eyesClosed = blink || sleeping;

  /* ------------------------------------------------------------------ */

  return (
    <div className="rounded-xl border border-white/10 bg-deep shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-ink/80 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-blossom/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-sprout/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-mist/80" />
        <p className="flex-1 text-center text-[11px] tracking-[0.22em] text-frost/50 font-bold uppercase">
          pip.exe — live pet preview
        </p>
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-sprout">
          <span className="w-1.5 h-1.5 rounded-full bg-sprout pulse-online" />
          HOME ALONE
        </span>
      </div>

      {/* the stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onMove}
        className="cat-zone relative select-none touch-none bg-[radial-gradient(120%_90%_at_50%_0%,#2a475e_0%,#1b2838_58%,#171a21_100%)]"
        aria-label="Pip the cat — click to pet him"
      >
        {/* moonlight */}
        <div className="moon-glow pointer-events-none absolute -top-10 right-6 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(102,192,244,0.35)_0%,rgba(102,192,244,0.08)_55%,transparent_70%)]" />
        {/* floor shadow */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-[linear-gradient(to_top,rgba(23,26,33,0.9),transparent)]" />

        {/* speech bubble */}
        {bubble && (
          <div
            key={bubble.id}
            className="bubble-pop absolute top-[5%] left-[8%] z-20 bg-cream text-ink font-display font-medium text-sm md:text-base px-4 py-2 rounded-xl rounded-bl-sm shadow-lg"
          >
            {bubble.text}
            <span className="absolute -bottom-1.5 left-3 w-3 h-3 bg-cream rotate-45" />
          </div>
        )}

        {/* zzz while sleeping */}
        {sleeping && (
          <>
            <span className="zzz left-[58%] top-[16%] text-lg" style={{ animationDelay: "0s" }}>
              z
            </span>
            <span className="zzz left-[62%] top-[10%] text-2xl" style={{ animationDelay: "0.85s" }}>
              z
            </span>
            <span className="zzz left-[66%] top-[4%] text-3xl" style={{ animationDelay: "1.7s" }}>
              Z
            </span>
          </>
        )}

        {/* hearts */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart-pop z-10"
            style={
              {
                left: h.x,
                top: h.y,
                fontSize: h.size,
                color: h.color,
                "--dx": `${h.dx}px`,
              } as React.CSSProperties
            }
          >
            {h.char}
          </span>
        ))}

        {/* hint */}
        <div
          className={`absolute bottom-4 left-4 z-20 transition-opacity duration-700 ${
            pets === 0 && !sleeping ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="inline-flex items-center gap-2 bg-ink/80 border border-mist/30 text-mist text-xs font-bold tracking-wide px-3 py-1.5 rounded-full">
            <HeartIcon className="w-3.5 h-3.5 text-blossom" />
            psst — click the cat
          </span>
        </div>

        <svg viewBox="0 0 460 420" className="relative z-10 w-full h-auto block" role="img" aria-label="Pip, an orange tabby cat sitting in a loaf">
          <defs>
            <radialGradient id="furBody" cx="50%" cy="32%" r="80%">
              <stop offset="0%" stopColor="#f4b06a" />
              <stop offset="55%" stopColor="#e2913f" />
              <stop offset="100%" stopColor="#c9752c" />
            </radialGradient>
            <radialGradient id="furHead" cx="50%" cy="38%" r="75%">
              <stop offset="0%" stopColor="#f6b876" />
              <stop offset="60%" stopColor="#e2913f" />
              <stop offset="100%" stopColor="#cf7c30" />
            </radialGradient>
            <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="55%" stopColor="rgba(58,28,8,0)" />
              <stop offset="100%" stopColor="rgba(58,28,8,0.32)" />
            </linearGradient>
            <radialGradient id="iris" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#ffe3a3" />
              <stop offset="35%" stopColor="#f2ae44" />
              <stop offset="72%" stopColor="#c47a1f" />
              <stop offset="100%" stopColor="#8a4a12" />
            </radialGradient>
          </defs>

          {/* ground shadow */}
          <ellipse cx="230" cy="372" rx="172" ry="20" fill="#10121a" opacity="0.55" />

          <g key={`sq-${pets}`} className="cat-squish">
            {/* tail, wrapped around the loaf */}
            <g className="cat-tail">
              <path
                d="M 352 318 C 394 322 404 350 358 360 C 312 370 254 367 206 361"
                fill="none"
                stroke="url(#furBody)"
                strokeWidth="25"
                strokeLinecap="round"
              />
              <circle cx="206" cy="361" r="12.5" fill="#7c3f12" />
              <g stroke="#b96b2d" strokeWidth="9" strokeLinecap="round" opacity="0.85">
                <path d="M 372 330 L 388 348" />
                <path d="M 342 347 L 346 365" />
                <path d="M 296 355 L 298 372" />
                <path d="M 248 358 L 248 373" />
              </g>
            </g>

            {/* body loaf */}
            <g className={sleeping ? "cat-breathe" : undefined}>
              <path
                d="M 88 302 C 88 210 148 168 230 168 C 312 168 372 210 372 302 C 372 338 316 354 230 354 C 144 354 88 338 88 302 Z"
                fill="url(#furBody)"
              />
              <path
                d="M 88 302 C 88 210 148 168 230 168 C 312 168 372 210 372 302 C 372 338 316 354 230 354 C 144 354 88 338 88 302 Z"
                fill="url(#bodyShade)"
              />
              {/* shoulder stripes */}
              <g stroke="#b96b2d" strokeWidth="13" strokeLinecap="round" opacity="0.8" fill="none">
                <path d="M 114 252 q 22 -30 52 -42" />
                <path d="M 106 284 q 26 -26 56 -36" />
                <path d="M 346 252 q -22 -30 -52 -42" />
                <path d="M 354 284 q -26 -26 -56 -36" />
              </g>
              {/* chest fluff */}
              <ellipse cx="230" cy="316" rx="56" ry="34" fill="#f7e3c4" opacity="0.95" />
              <g stroke="#e8cba0" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none">
                <path d="M 206 300 q -4 14 2 26" />
                <path d="M 230 298 q 0 16 -2 28" />
                <path d="M 254 300 q 4 14 -2 26" />
              </g>
              {/* tucked front paws */}
              <rect x="180" y="330" width="54" height="20" rx="10" fill="#eda256" />
              <rect x="226" y="330" width="54" height="20" rx="10" fill="#eda256" />
              <g stroke="#b96b2d" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                <path d="M 200 336 v 9" />
                <path d="M 214 336 v 9" />
                <path d="M 246 336 v 9" />
                <path d="M 260 336 v 9" />
              </g>
              {/* fur texture strokes */}
              <g stroke="#c9752c" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none">
                <path d="M 122 306 q 4 12 12 18" />
                <path d="M 338 306 q -4 12 -12 18" />
              </g>
            </g>

            {/* yarn ball */}
            <g className="yarn">
              <circle cx="92" cy="366" r="24" fill="#66c0f4" />
              <path
                d="M 70 366 a 22 22 0 0 1 44 0 M 74 355 q 18 13 36 0 M 74 377 q 18 -13 36 0"
                fill="none"
                stroke="#2a475e"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M 114 374 q 24 12 42 4" fill="none" stroke="#66c0f4" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>

            {/* head */}
            <g className="cat-head">
              {/* ears */}
              <path d="M 168 108 L 150 26 L 220 74 Z" fill="#e2913f" />
              <path d="M 292 108 L 310 26 L 240 74 Z" fill="#e2913f" />
              <path d="M 176 96 L 165 44 L 210 74 Z" fill="#d98a8f" opacity="0.8" />
              <path d="M 284 96 L 295 44 L 250 74 Z" fill="#d98a8f" opacity="0.8" />
              <g stroke="#f7e3c4" strokeWidth="3" strokeLinecap="round" opacity="0.55" fill="none">
                <path d="M 176 86 q 9 -7 18 -9" />
                <path d="M 284 86 q -9 -7 -18 -9" />
              </g>

              {/* skull + cheek tufts */}
              <ellipse cx="230" cy="152" rx="92" ry="78" fill="url(#furHead)" />
              <path d="M 146 168 l -15 6 l 14 5 l -13 9 l 16 3 z" fill="#e2913f" />
              <path d="M 314 168 l 15 6 l -14 5 l 13 9 l -16 3 z" fill="#e2913f" />

              {/* forehead M */}
              <g stroke="#b96b2d" strokeWidth="5" strokeLinecap="round" opacity="0.85" fill="none">
                <path d="M 230 84 v 26" />
                <path d="M 210 88 q 2 12 6 22" />
                <path d="M 250 88 q -2 12 -6 22" />
                <path d="M 192 96 q 6 10 12 18" />
                <path d="M 268 96 q -6 10 -12 18" />
              </g>
              {/* cheek stripes */}
              <g stroke="#b96b2d" strokeWidth="5" strokeLinecap="round" opacity="0.65" fill="none">
                <path d="M 152 148 q 14 4 24 2" />
                <path d="M 150 166 q 14 2 24 0" />
                <path d="M 308 148 q -14 4 -24 2" />
                <path d="M 310 166 q -14 2 -24 0" />
              </g>

              {/* blush, once you're friends */}
              {levelIdx >= 2 && (
                <>
                  <ellipse cx="158" cy="182" rx="13" ry="8" fill="#ff8fb3" opacity="0.5" />
                  <ellipse cx="302" cy="182" rx="13" ry="8" fill="#ff8fb3" opacity="0.5" />
                </>
              )}

              {/* eyes — amber, slit pupils, tracking */}
              {[192, 268].map((cx) => (
                <g key={cx} transform={`translate(${cx} 148)`}>
                  <ellipse rx="21" ry="15.5" fill="#20130a" />
                  <ellipse rx="18.5" ry="13.5" fill="url(#iris)" />
                  <g transform={`translate(${pupils.x} ${pupils.y})`}>
                    <ellipse
                      rx={happyMouth ? 7.4 : 4.6}
                      ry="11.5"
                      fill="#160d06"
                      style={{ transition: "rx 0.35s ease" } as React.CSSProperties}
                    />
                  </g>
                  <circle cx="-6.5" cy="-5.5" r="4.2" fill="#fff" opacity="0.95" />
                  <circle cx="6" cy="5" r="2" fill="#fff" opacity="0.7" />
                  <ellipse className={`eyelid ${eyesClosed ? "closed" : ""}`} rx="22" ry="16.5" fill="#e2913f" />
                  {sleeping && <path d="M -16 1 q 16 8 32 0" fill="none" stroke="#4a2a12" strokeWidth="4" strokeLinecap="round" />}
                </g>
              ))}

              {/* muzzle */}
              <ellipse cx="230" cy="194" rx="36" ry="24" fill="#f7e3c4" />

              {/* nose (boopable) */}
              <g key={`boop-${boopTick}`} className={boopTick > 0 ? "nose-boop" : undefined}>
                <path d="M 219 176 Q 230 169 241 176 Q 238 188 230 189 Q 222 188 219 176 Z" fill="#dd8395" />
                <circle cx="225.5" cy="175.5" r="2" fill="#fff" opacity="0.5" />
              </g>
              <circle cx="230" cy="180" r="19" fill="transparent" onPointerDown={onNoseDown} />

              {/* philtrum + mouth */}
              <path d="M 230 189 v 7" stroke="#a06a4a" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M 216 202 q 7 8 14 1 q 7 7 14 -1"
                fill="none"
                stroke="#5b3040"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={happyMouth ? 0 : 1}
                style={{ transition: "opacity 0.15s" }}
              />
              <g opacity={happyMouth ? 1 : 0} style={{ transition: "opacity 0.15s" }}>
                <path d="M 214 200 q 16 20 32 0 z" fill="#5b2e42" />
                <ellipse cx="230" cy="207" rx="8" ry="4" fill="#f29cb0" />
              </g>

              {/* whisker dots */}
              <g fill="#c9974f">
                <circle cx="210" cy="190" r="1.6" />
                <circle cx="205" cy="196" r="1.6" />
                <circle cx="212" cy="201" r="1.6" />
                <circle cx="250" cy="190" r="1.6" />
                <circle cx="255" cy="196" r="1.6" />
                <circle cx="248" cy="201" r="1.6" />
              </g>

              {/* whiskers */}
              <g stroke="#fdf3e0" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" fill="none">
                <path d="M 202 186 q -40 -6 -74 2" />
                <path d="M 202 194 q -42 2 -72 12" />
                <path d="M 204 178 q -38 -14 -70 -12" />
                <path d="M 258 186 q 40 -6 74 2" />
                <path d="M 258 194 q 42 2 72 12" />
                <path d="M 256 178 q 38 -14 70 -12" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* HUD */}
      <div className="grid grid-cols-2 md:grid-cols-[auto_1fr_auto] gap-x-8 gap-y-4 items-center px-5 py-4 bg-ink/70 border-t border-white/5">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-frost/45 uppercase">Pets given</p>
          <p className="font-display text-3xl font-semibold text-mist leading-none mt-1 tabular-nums">
            {pets}
            <span className="text-sm text-frost/50 font-normal ml-2">naps: {naps}</span>
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[10px] font-extrabold tracking-[0.2em] text-frost/45 uppercase">
              Rank: <span className="text-tabby">{level.name}</span>
            </p>
            <p className="text-[10px] font-bold text-frost/45">
              {sleeping ? "napping — click to wake" : `${NAP_AT - meter} pets until nap`}
            </p>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(to_right,#66c0f4,#a4d007)] transition-all duration-500 ease-out"
              style={{ width: `${sleeping ? 100 : napPct}%` }}
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 flex md:justify-end items-center gap-2 text-frost/50">
          <CloudIcon className={`w-5 h-5 transition-colors duration-300 ${syncFlash ? "text-sprout" : "text-mist/60"}`} />
          <span className="text-[11px] font-bold tracking-wide">
            {syncFlash ? <span className="text-sprout">synced ✓</span> : "Steam Cloud"}
          </span>
        </div>
      </div>
    </div>
  );
}
