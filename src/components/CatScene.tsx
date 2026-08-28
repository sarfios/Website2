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
  ["mew?", "…oh. hi.", "you may look.", "*sniffs your sleeve* …you smell like 2007."],
  ["mrrp!", "prrt prrt", "oh—pets. yes.", "*tail goes up*"],
  ["purrrr…", "again! again!", "*tells you about the attic*", "*biscuits intensify*"],
  ["PURRRRRR!!", "you're my human now", "*happy headbonk*", "wait till Bibi hears about you"],
  ["the prophecy is true", "all my naps are yours", "*slow blink of true love*", "let's go find yesterday ♥"],
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
  const dilateTimer = useRef<number | null>(null);

  const [pets, setPets] = useState(0);
  const [meter, setMeter] = useState(0);
  const [naps, setNaps] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  const [blink, setBlink] = useState(false);
  const [dilated, setDilated] = useState(false);
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

  const dilate = useCallback(() => {
    setDilated(true);
    if (dilateTimer.current) window.clearTimeout(dilateTimer.current);
    dilateTimer.current = window.setTimeout(() => setDilated(false), 800);
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
      dilate();
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
    [sleeping, pets, meter, showBubble, spawnHearts, flashSync, dilate]
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
      dilate();
      boopSound();
      showBubble(pick(BOOP_PHRASES));
      spawnHearts(clientX - r.left, clientY - r.top, 1);
    },
    [sleeping, doPet, showBubble, spawnHearts, dilate]
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
    const dy = (e.clientY - (r.top + r.height * 0.3)) / r.height;
    setPupils({ x: clamp(dx * 10, -4, 4), y: clamp(dy * 8, -2.5, 3.5) });
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
      spawnHearts(r.width * (0.35 + Math.random() * 0.3), r.height * 0.28, 1);
    }, 2800);
    return () => {
      if (ambientTimer.current) window.clearInterval(ambientTimer.current);
    };
  }, [levelIdx, spawnHearts]);

  const napPct = Math.min(100, Math.round((meter / NAP_AT) * 100));
  const eyesClosed = blink || sleeping;

  const pupilStyle: React.CSSProperties = {
    transform: dilated ? "scaleX(1.6)" : "scaleX(1)",
    transformOrigin: "center",
    transformBox: "fill-box",
    transition: "transform 0.3s ease",
  };

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
        {/* floor shadow */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-[linear-gradient(to_top,rgba(23,26,33,0.9),transparent)]" />

        {/* speech bubble */}
        {bubble && (
          <div
            key={bubble.id}
            className="bubble-pop absolute top-[5%] left-[12%] z-20 bg-cream text-ink font-display font-medium text-sm md:text-base px-4 py-2 rounded-xl rounded-bl-sm shadow-lg"
          >
            {bubble.text}
            <span className="absolute -bottom-1.5 left-3 w-3 h-3 bg-cream rotate-45" />
          </div>
        )}

        {/* zzz while sleeping */}
        {sleeping && (
          <>
            <span className="zzz left-[62%] top-[16%] text-lg" style={{ animationDelay: "0s" }}>
              z
            </span>
            <span className="zzz left-[66%] top-[10%] text-2xl" style={{ animationDelay: "0.85s" }}>
              z
            </span>
            <span className="zzz left-[70%] top-[4%] text-3xl" style={{ animationDelay: "1.7s" }}>
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

        <svg viewBox="0 0 420 440" className="relative z-10 w-full h-auto block" role="img" aria-label="Pip, a fluffy orange tabby cat">
          <defs>
            <radialGradient id="furGrad" cx="42%" cy="32%" r="80%">
              <stop offset="0%" stopColor="#f9bd77" />
              <stop offset="55%" stopColor="#ef9f52" />
              <stop offset="100%" stopColor="#d9803a" />
            </radialGradient>
            <radialGradient id="chestGrad" cx="50%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#fff1dc" />
              <stop offset="100%" stopColor="#f3d6ab" />
            </radialGradient>
            <radialGradient id="irisGrad" cx="35%" cy="30%" r="85%">
              <stop offset="0%" stopColor="#ffe49a" />
              <stop offset="55%" stopColor="#f2b13e" />
              <stop offset="100%" stopColor="#c67f22" />
            </radialGradient>
          </defs>

          {/* ground shadow */}
          <ellipse cx="210" cy="414" rx="150" ry="18" fill="#0e1118" opacity="0.55" />

          <g key={`sq-${pets}`} className="cat-squish">
            {/* tail (behind body) */}
            <g className="cat-tail">
              <path d="M 302 336 C 366 332 398 282 376 232" fill="none" stroke="#e8934a" strokeWidth="32" strokeLinecap="round" />
              <path
                d="M 302 336 C 366 332 398 282 376 232"
                fill="none"
                stroke="#b96a2b"
                strokeWidth="32"
                strokeLinecap="butt"
                strokeDasharray="14 30"
                opacity="0.85"
              />
              <circle cx="376" cy="230" r="16" fill="#a85a20" />
            </g>

            {/* body */}
            <g className={sleeping ? "cat-breathe" : undefined}>
              <path
                d="M 210 200 C 140 206 96 262 94 322 C 92 372 128 408 210 410 C 292 408 328 372 326 322 C 324 262 280 206 210 200 Z"
                fill="url(#furGrad)"
              />
              {/* haunch shading */}
              <path d="M 122 292 C 112 330 118 372 148 396" fill="none" stroke="#c9762f" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
              <path d="M 298 292 C 308 330 302 372 272 396" fill="none" stroke="#c9762f" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
              {/* tabby stripes on flanks & shoulders */}
              <g stroke="#b96a2b" strokeLinecap="round" fill="none" opacity="0.75">
                <path d="M 112 262 q 20 6 30 26" strokeWidth="11" />
                <path d="M 104 300 q 24 8 36 30" strokeWidth="12" />
                <path d="M 112 342 q 22 10 30 28" strokeWidth="11" />
                <path d="M 308 262 q -20 6 -30 26" strokeWidth="11" />
                <path d="M 316 300 q -24 8 -36 30" strokeWidth="12" />
                <path d="M 308 342 q -22 10 -30 28" strokeWidth="11" />
                <path d="M 150 222 q 16 10 20 26" strokeWidth="10" />
                <path d="M 270 222 q -16 10 -20 26" strokeWidth="10" />
              </g>
              {/* chest fluff */}
              <ellipse cx="210" cy="330" rx="62" ry="78" fill="url(#chestGrad)" />
              <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.25" fill="none">
                <path d="M 196 296 q 4 12 0 20" />
                <path d="M 224 296 q -4 12 0 20" />
                <path d="M 210 310 q 3 12 0 20" />
              </g>
              {/* front legs */}
              <path d="M 176 306 C 170 342 168 372 174 398 L 206 398 C 210 372 208 340 204 308 Z" fill="#e08c42" />
              <path d="M 216 308 C 212 340 212 372 214 398 L 246 398 C 252 372 250 342 244 306 Z" fill="#e08c42" />
              <ellipse cx="188" cy="400" rx="24" ry="12" fill="#f2a65e" />
              <ellipse cx="232" cy="400" rx="24" ry="12" fill="#f2a65e" />
              <g stroke="#b96a2b" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 182 392 v 10 M 194 392 v 10" />
                <path d="M 226 392 v 10 M 238 392 v 10" />
              </g>
            </g>

            {/* neck ruff */}
            <g stroke="#f7dcb8" strokeWidth="3" strokeLinecap="round" opacity="0.55" fill="none">
              <path d="M 172 226 q 8 14 20 18" />
              <path d="M 248 226 q -8 14 -20 18" />
              <path d="M 210 230 q 0 12 0 20" />
            </g>

            {/* head */}
            <g className="cat-head">
              {/* ears */}
              <path d="M 138 96 C 124 70 116 40 120 18 C 121 10 130 10 136 16 C 156 34 174 50 188 60 C 168 68 150 80 138 96 Z" fill="url(#furGrad)" />
              <path d="M 282 96 C 296 70 304 40 300 18 C 299 10 290 10 284 16 C 264 34 246 50 232 60 C 252 68 270 80 282 96 Z" fill="url(#furGrad)" />
              <path d="M 140 84 C 132 66 128 46 131 32 C 144 44 160 56 172 62 C 160 68 148 76 140 84 Z" fill="#e8917f" opacity="0.85" />
              <path d="M 280 84 C 288 66 292 46 289 32 C 276 44 260 56 248 62 C 260 68 272 76 280 84 Z" fill="#e8917f" opacity="0.85" />
              <g stroke="#f7dcb8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" fill="none">
                <path d="M 134 60 q -5 10 -3 18" />
                <path d="M 286 60 q 5 10 3 18" />
              </g>

              <ellipse cx="210" cy="146" rx="86" ry="76" fill="url(#furGrad)" />

              {/* cheek fluff */}
              <g stroke="#e8934a" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none">
                <path d="M 130 168 l -14 6 M 132 182 l -16 4 M 136 196 l -13 8" />
                <path d="M 290 168 l 14 6 M 288 182 l 16 4 M 284 196 l 13 8" />
              </g>

              {/* tabby M on forehead */}
              <g stroke="#b96a2b" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85">
                <path d="M 210 74 L 210 96" />
                <path d="M 190 78 q 3 12 2 22" />
                <path d="M 230 78 q -3 12 -2 22" />
                <path d="M 172 88 q 6 10 6 18" />
                <path d="M 248 88 q -6 10 -6 18" />
              </g>
              {/* cheek stripes */}
              <g stroke="#b96a2b" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7">
                <path d="M 128 146 q 16 2 26 10" />
                <path d="M 126 162 q 18 4 28 12" />
                <path d="M 292 146 q -16 2 -26 10" />
                <path d="M 294 162 q -18 4 -28 12" />
              </g>

              {/* blush — appears once you're friends */}
              {levelIdx >= 2 && (
                <>
                  <ellipse cx="138" cy="186" rx="14" ry="8" fill="#ff8fb3" opacity="0.4" />
                  <ellipse cx="282" cy="186" rx="14" ry="8" fill="#ff8fb3" opacity="0.4" />
                </>
              )}

              {/* eyes */}
              {[
                { cx: 166, rot: -6 },
                { cx: 254, rot: 6 },
              ].map(({ cx, rot }) => (
                <g key={cx} transform={`translate(${cx} 140) rotate(${rot})`}>
                  <ellipse rx="19" ry="15" fill="url(#irisGrad)" stroke="#7a4a1e" strokeOpacity="0.5" strokeWidth="2" />
                  <g transform={`translate(${pupils.x} ${pupils.y})`}>
                    <g style={pupilStyle}>
                      <ellipse rx="5.5" ry="12" fill="#1d1424" />
                    </g>
                  </g>
                  <circle cx="-6" cy="-5" r="3.2" fill="#fff" opacity="0.9" />
                  <circle cx="6" cy="4" r="1.8" fill="#fff" opacity="0.8" />
                  <ellipse className={`eyelid ${eyesClosed ? "closed" : ""}`} rx="20" ry="16" fill="#e8934a" />
                  {sleeping && <path d="M -16 0 Q 0 9 16 0" fill="none" stroke="#4a2c1a" strokeWidth="4" strokeLinecap="round" />}
                </g>
              ))}

              {/* muzzle */}
              <ellipse cx="210" cy="192" rx="34" ry="20" fill="#e8c79a" opacity="0.55" />
              <ellipse cx="194" cy="184" rx="24" ry="16" fill="#f7dcb8" />
              <ellipse cx="226" cy="184" rx="24" ry="16" fill="#f7dcb8" />
              <ellipse cx="210" cy="206" rx="15" ry="9" fill="#f7dcb8" />
              {/* whisker dots */}
              <g fill="#c9a06a" opacity="0.65">
                <circle cx="186" cy="176" r="1.2" />
                <circle cx="190" cy="182" r="1.2" />
                <circle cx="185" cy="188" r="1.2" />
                <circle cx="234" cy="176" r="1.2" />
                <circle cx="230" cy="182" r="1.2" />
                <circle cx="235" cy="188" r="1.2" />
              </g>

              {/* nose (boopable) */}
              <g key={`boop-${boopTick}`} className={boopTick > 0 ? "nose-boop" : undefined}>
                <path d="M 201 168 Q 210 163 219 168 Q 217 178 210 179 Q 203 178 201 168 Z" fill="#e28693" />
                <path d="M 204 167 q 6 -3 12 0" fill="none" stroke="#f2a8b4" strokeWidth="2" strokeLinecap="round" />
              </g>
              <circle cx="210" cy="172" r="15" fill="transparent" onPointerDown={onNoseDown} />

              {/* philtrum + mouth */}
              <path d="M 210 179 L 210 186" stroke="#b98d68" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M 210 186 q -7 7 -14 1 M 210 186 q 7 7 14 1"
                fill="none"
                stroke="#6b4a3a"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={happyMouth ? 0 : 1}
                style={{ transition: "opacity 0.15s" }}
              />
              <g opacity={happyMouth ? 1 : 0} style={{ transition: "opacity 0.15s" }}>
                <path d="M 196 186 Q 210 204 224 186 Z" fill="#5b2e42" />
                <ellipse cx="210" cy="193" rx="7" ry="4" fill="#ff8fb3" />
              </g>

              {/* whiskers */}
              <g stroke="#fff0d8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" fill="none">
                <path d="M 180 166 Q 140 152 108 150" />
                <path d="M 178 172 Q 130 162 92 166" />
                <path d="M 176 180 Q 128 180 90 190" />
                <path d="M 178 188 Q 136 198 104 210" />
                <path d="M 240 166 Q 280 152 312 150" />
                <path d="M 242 172 Q 290 162 328 166" />
                <path d="M 244 180 Q 292 180 330 190" />
                <path d="M 242 188 Q 284 198 316 210" />
              </g>

              {/* crown fur texture */}
              <g stroke="#d9803a" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none">
                <path d="M 186 74 q 2 10 0 16" />
                <path d="M 234 74 q -2 10 0 16" />
              </g>
              <g stroke="#ffd9a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none">
                <path d="M 150 160 q 6 14 4 22" />
                <path d="M 270 160 q -6 14 -4 22" />
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
