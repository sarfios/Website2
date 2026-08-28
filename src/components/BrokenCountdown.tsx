import { useEffect, useState } from "react";

const CHARS = "▒▓░#%&@?!0123456789";
const LABELS = ["days", "hours", "min", "sec"] as const;

const rand2 = () =>
  CHARS[Math.floor(Math.random() * CHARS.length)] + CHARS[Math.floor(Math.random() * CHARS.length)];

const pickTwo = (): [number, number] => {
  const a = Math.floor(Math.random() * 4);
  let b = Math.floor(Math.random() * 4);
  while (b === a) b = Math.floor(Math.random() * 4);
  return [a, b];
};

/**
 * A launch countdown — except it's broken, because nobody knows
 * when the game is coming out. Ticks politely, then two cells
 * glitch out at the same time.
 */
export default function BrokenCountdown() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [vals, setVals] = useState<[number, number, number, number]>([56, 13, 37, 52]);
  const [scr, setScr] = useState<(string | null)[]>([null, null, null, null]);
  const [jitterCells, setJitterCells] = useState<number[]>([]);
  const [status, setStatus] = useState("status: ticking… probably");

  /* honest ticking */
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setVals(([d, h, m, s]) => {
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) d = 56;
        return [d, h, m, s];
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  /* the broken part — two cells at a time */
  useEffect(() => {
    if (reduced) {
      setScr(["??", "??", "??", "??"]);
      setStatus("status: honestly, no idea");
      return;
    }
    let alive = true;
    let scheduleId: number;
    let scrambleId: number;

    const schedule = () => {
      scheduleId = window.setTimeout(() => {
        if (!alive) return;
        const [a, b] = pickTwo();
        setJitterCells([a, b]);
        setStatus("status: recalculating…");
        let n = 0;
        scrambleId = window.setInterval(() => {
          if (!alive) return;
          n += 1;
          setScr((prev) => {
            const c = [...prev];
            c[a] = rand2();
            c[b] = rand2();
            return c;
          });
          if (n >= 9) {
            window.clearInterval(scrambleId);
            const lostA = Math.random() < 0.42;
            const lostB = Math.random() < 0.42;
            setScr((prev) => {
              const c = [...prev];
              c[a] = lostA ? "??" : null;
              c[b] = lostB ? "??" : null;
              return c;
            });
            setJitterCells([]);
            setStatus(
              lostA && lostB
                ? "status: lost track of time (again) (relatable)"
                : lostA || lostB
                  ? "status: lost one of them somewhere"
                  : "status: ticking… probably"
            );
            if (alive) schedule();
          }
        }, 80);
      }, 3200 + Math.random() * 3600);
    };

    schedule();
    return () => {
      alive = false;
      window.clearTimeout(scheduleId);
      window.clearInterval(scrambleId);
    };
  }, [reduced]);

  const display = (i: number) => (scr[i] !== null ? scr[i] : String(vals[i]).padStart(2, "0"));

  return (
    <section id="when" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 py-24 md:py-28">
      <div className="reveal text-center">
        <p className="text-mist font-extrabold text-xs tracking-[0.28em] uppercase">
          Launch countdown <span className="text-blossom">(slightly broken)</span>
        </p>

        <div
          className="mt-8 flex items-start justify-center gap-2 sm:gap-3"
          role="timer"
          aria-label="Time until launch: unknown. The clock is broken on purpose."
        >
          {LABELS.map((label, i) => (
            <div key={label} className="flex items-start gap-2 sm:gap-3">
              <div className="flex flex-col items-center">
                <div className="relative rounded-md border border-white/10 bg-[linear-gradient(to_bottom,#2a475e,#1b2838_48%,#17222e)] overflow-hidden shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
                  <span className="absolute inset-x-2 top-1/2 h-px bg-black/40 z-10" aria-hidden="true" />
                  <span
                    className={`block font-display font-semibold text-4xl md:text-6xl text-mist tabular-nums px-3 py-3 md:px-5 md:py-4 ${
                      jitterCells.includes(i) ? "glitching" : ""
                    }`}
                  >
                    {display(i)}
                  </span>
                </div>
                <span className="mt-2 text-[10px] font-extrabold tracking-[0.22em] uppercase text-frost/40">
                  {label}
                </span>
              </div>
              {i < 3 && (
                <span className="colon-blink font-display font-semibold text-3xl md:text-5xl text-frost/25 pt-3 md:pt-4 select-none">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-7 text-sm text-frost/55 font-semibold">
          We don't know when it lands either — that's why the clock is like this.
          <span className="text-mist/80"> {status}</span>
        </p>
        <p className="mt-1.5 text-xs font-bold tracking-[0.22em] uppercase text-frost/30">
          ETA: when it's cozy enough
        </p>
      </div>
    </section>
  );
}
