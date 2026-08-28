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
        spawnHearts(clientX - r.left, clientY - r.top, 2);
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
    const dy = (e.clientY - (r.top + r.height * 0.36)) / r.height;
    setPupils({ x: clamp(dx * 11, -4.5, 4.5), y: clamp(dy * 9, -3, 4.5) });
  };

  /* ---------------- ambient life ---------------- */

  /* blink loop */
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

  /* keyboard: press P to pet */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "p" || e.repeat) return;
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      doPet(r.left + r.width * 0.49, r.top + r.height * 0.42);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doPet]);

  /* love-level ambient hearts */
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
          ONLINE
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
        {/* windowsill shadow */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-[linear-gradient(to_top,rgba(23,26,33,0.9),transparent)]" />

        {/* speech bubble */}
        {bubble && (
          <div
            key={bubble.id}
            className="bubble-pop absolute top-[6%] left-[16%] z-20 bg-cream text-ink font-display font-medium text-sm md:text-base px-4 py-2 rounded-xl rounded-bl-sm shadow-lg"
          >
            {bubble.text}
            <span className="absolute -bottom-1.5 left-3 w-3 h-3 bg-cream rotate-45" />
          </div>
        )}

        {/* zzz while sleeping */}
        {sleeping && (
          <>
            <span className="zzz left-[62%] top-[18%] text-lg" style={{ animationDelay: "0s" }}>
              z
            </span>
            <span className="zzz left-[66%] top-[12%] text-2xl" style={{ animationDelay: "0.85s" }}>
              z
            </span>
            <span className="zzz left-[70%] top-[6%] text-3xl" style={{ animationDelay: "1.7s" }}>
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

        <svg viewBox="0 0 420 400" className="relative z-10 w-full h-auto block" role="img" aria-label="Pip, a round orange tabby cat">
          {/* tail */}
          <g className="cat-tail">
            <path d="M 302 300 C 360 296 388 258 372 216" fill="none" stroke="#f2a65e" strokeWidth="30" strokeLinecap="round" />
            <circle cx="372" cy="214" r="15" fill="#d9873f" />
          </g>

          {/* body */}
          <g key={`sq-${pets}`} className="cat-squish">
            <ellipse className={sleeping ? "cat-breathe" : undefined} cx="205" cy="305" rx="122" ry="80" fill="#f2a65e" />
            <path d="M 100 262 q 16 -26 40 -36" fill="none" stroke="#d9873f" strokeWidth="13" strokeLinecap="round" />
            <path d="M 310 262 q -16 -26 -40 -36" fill="none" stroke="#d9873f" strokeWidth="13" strokeLinecap="round" />
            <ellipse cx="205" cy="322" rx="72" ry="46" fill="#ffe8c9" opacity="0.92" />

            {/* front paws */}
            <g>
              <ellipse cx="160" cy="356" rx="27" ry="15" fill="#f2a65e" />
              <ellipse cx="250" cy="356" rx="27" ry="15" fill="#f2a65e" />
              <path d="M 152 350 v 9 M 166 350 v 9 M 242 350 v 9 M 256 350 v 9" stroke="#d9873f" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* yarn ball */}
            <g className="yarn">
              <circle cx="92" cy="352" r="24" fill="#66c0f4" />
              <path
                d="M 70 352 a 22 22 0 0 1 44 0 M 74 341 q 18 13 36 0 M 74 363 q 18 -13 36 0"
                fill="none"
                stroke="#2a475e"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M 114 360 q 26 14 44 4" fill="none" stroke="#66c0f4" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>

            {/* head */}
            <g className="cat-head">
              {/* ears */}
              <path d="M 128 118 L 106 34 L 196 78 Z" fill="#f2a65e" />
              <path d="M 282 118 L 304 34 L 214 78 Z" fill="#f2a65e" />
              <path d="M 133 104 L 121 56 L 174 82 Z" fill="#e27396" opacity="0.75" />
              <path d="M 277 104 L 289 56 L 236 82 Z" fill="#e27396" opacity="0.75" />

              <ellipse cx="205" cy="152" rx="104" ry="90" fill="#f2a65e" />
              <path d="M 205 64 v 24 M 181 68 q 4 15 2 23 M 229 68 q -4 15 -2 23" fill="none" stroke="#d9873f" strokeWidth="9" strokeLinecap="round" />

              {/* blush — appears once you're friends */}
              {levelIdx >= 2 && (
                <>
                  <ellipse cx="130" cy="192" rx="15" ry="9" fill="#ff8fb3" opacity="0.55" />
                  <ellipse cx="280" cy="192" rx="15" ry="9" fill="#ff8fb3" opacity="0.55" />
                </>
              )}

              {/* muzzle */}
              <ellipse cx="205" cy="196" rx="60" ry="40" fill="#ffe8c9" />

              {/* eyes */}
              {[163, 247].map((cx) => (
                <g key={cx} transform={`translate(${cx} 142)`}>
                  <ellipse rx="16" ry="19" fill="#241a2e" />
                  <g transform={`translate(${pupils.x} ${pupils.y})`}>
                    <circle cx="-5" cy="-6" r="5" fill="#fff" />
                    <circle cx="5.5" cy="5" r="2.4" fill="#fff" opacity="0.85" />
                  </g>
                  <ellipse className={`eyelid ${eyesClosed ? "closed" : ""}`} rx="17" ry="20" fill="#f2a65e" />
                  {sleeping && <path d="M -13 1 q 13 9 26 0" fill="none" stroke="#241a2e" strokeWidth="4.5" strokeLinecap="round" />}
                </g>
              ))}

              {/* nose (boopable) */}
              <g key={`boop-${boopTick}`} className={boopTick > 0 ? "nose-boop" : undefined}>
                <path d="M 195 178 Q 205 171 215 178 Q 212 190 205 191 Q 198 190 195 178 Z" fill="#e27396" />
              </g>
              <circle cx="205" cy="184" r="17" fill="transparent" onPointerDown={onNoseDown} />

              {/* mouth */}
              <path
                d="M 190 204 q 7 8 15 1 q 8 7 15 -1"
                fill="none"
                stroke="#4a2c3a"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={happyMouth ? 0 : 1}
                style={{ transition: "opacity 0.15s" }}
              />
              <g opacity={happyMouth ? 1 : 0} style={{ transition: "opacity 0.15s" }}>
                <path d="M 188 202 q 17 21 34 0 z" fill="#5b2e42" />
                <ellipse cx="205" cy="210" rx="8" ry="4.5" fill="#ff8fb3" />
              </g>

              {/* whiskers */}
              <g stroke="#ffe8c9" strokeWidth="3" strokeLinecap="round" opacity="0.8">
                <path d="M 118 176 q -26 -2 -44 4" fill="none" />
                <path d="M 118 190 q -26 4 -42 12" fill="none" />
                <path d="M 121 162 q -24 -8 -42 -8" fill="none" />
                <path d="M 292 176 q 26 -2 44 4" fill="none" />
                <path d="M 292 190 q 26 4 42 12" fill="none" />
                <path d="M 289 162 q 24 -8 42 -8" fill="none" />
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
