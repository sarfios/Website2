import { useEffect, useState } from "react";
import CatScene from "./components/CatScene";
import { useReveal } from "./hooks/useReveal";
import { setMuted } from "./lib/sound";
import {
  CatLogo,
  CloudIcon,
  CursorIcon,
  EnvelopeIcon,
  FishIcon,
  HandPetIcon,
  HeartOutline,
  MoonIcon,
  NoseBoopIcon,
  PawIcon,
  SpeakerIcon,
  StarIcon,
  SteamWish,
  YarnIcon,
} from "./components/icons";

const CAPSULE_URL =
  "https://image.qwenlm.ai/generated-images/1e3ea1b9-138e-4eff-b9b6-07a9ad073624/_result.png";

const SUPPORT_EMAIL = "support@whiskersofyesterday.com";
const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Wake me when Pip wakes up")}`;

/* ------------------------------------------------------------------ */
/* ambient background                                                  */
/* ------------------------------------------------------------------ */

const DRIFTERS = [
  { Icon: PawIcon, cls: "left-[4%] top-[16%] w-7", dur: "11s", delay: "0s", tint: "text-mist/10" },
  { Icon: FishIcon, cls: "left-[12%] top-[64%] w-9", dur: "13s", delay: "1.2s", tint: "text-frost/10" },
  { Icon: YarnIcon, cls: "left-[22%] top-[36%] w-8", dur: "10s", delay: "0.6s", tint: "text-blossom/10" },
  { Icon: StarIcon, cls: "left-[30%] top-[82%] w-4", dur: "9s", delay: "2s", tint: "text-mist/15" },
  { Icon: MoonIcon, cls: "left-[42%] top-[12%] w-8", dur: "14s", delay: "0.3s", tint: "text-frost/10" },
  { Icon: PawIcon, cls: "left-[55%] top-[70%] w-6", dur: "12s", delay: "1.8s", tint: "text-frost/10" },
  { Icon: StarIcon, cls: "left-[63%] top-[24%] w-3", dur: "8s", delay: "0.9s", tint: "text-mist/20" },
  { Icon: FishIcon, cls: "left-[72%] top-[52%] w-8", dur: "12s", delay: "2.4s", tint: "text-mist/10" },
  { Icon: YarnIcon, cls: "left-[82%] top-[80%] w-9", dur: "15s", delay: "0.2s", tint: "text-mist/10" },
  { Icon: StarIcon, cls: "left-[90%] top-[38%] w-4", dur: "10s", delay: "1.5s", tint: "text-blossom/15" },
  { Icon: PawIcon, cls: "left-[95%] top-[10%] w-6", dur: "11s", delay: "0.8s", tint: "text-frost/10" },
  { Icon: MoonIcon, cls: "left-[7%] top-[88%] w-6", dur: "13s", delay: "1s", tint: "text-mist/10" },
] as const;

function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* layered steam glows */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_-10%,rgba(102,192,244,0.13)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_-10%_40%,rgba(42,71,94,0.55)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_60%_110%,rgba(242,166,94,0.07)_0%,transparent_60%)]" />
      {/* drifting bits */}
      {DRIFTERS.map((d, i) => (
        <span
          key={i}
          className={`anim-drift absolute ${d.cls} ${d.tint}`}
          style={{ "--dur": d.dur, "--delay": d.delay } as React.CSSProperties}
        >
          <d.Icon className="w-full h-auto" />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* top bar                                                             */
/* ------------------------------------------------------------------ */

function TopBar({ muted, onToggleSound }: { muted: boolean; onToggleSound: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-4">
        <a href="#meet" className="flex items-center gap-2.5 group">
          <CatLogo className="w-8 h-8 transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-display font-semibold text-frost leading-none">
            Whiskers <span className="text-mist">of Yesterday</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-extrabold tracking-[0.18em] text-sprout border border-sprout/40 bg-sprout/10 rounded-full px-2 py-1">
            COMING SOON
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 mx-auto text-sm font-bold text-frost/60">
          {[
            ["Meet Pip", "#meet"],
            ["How to pet", "#how"],
            ["Wishlist", "#wishlist"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="relative py-1 transition-colors hover:text-mist after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-mist after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto md:ml-0 flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            title={muted ? "meows: off" : "meows: on"}
            className="p-2 rounded-md border border-white/10 text-frost/70 hover:text-mist hover:border-mist/50 transition-colors"
          >
            <SpeakerIcon muted={muted} className="w-[18px] h-[18px]" />
          </button>
          <a
            href="#wishlist"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-extrabold text-ink bg-[linear-gradient(to_right,#8bc53a,#588a1b)] hover:brightness-110 active:scale-95 transition px-3.5 py-2 rounded-sm"
          >
            <SteamWish className="w-4 h-4" />
            Wishlist
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* ticker                                                              */
/* ------------------------------------------------------------------ */

const TICKER_ITEMS = [
  "Certified cozy",
  "Purr-powered engine",
  "Yarn-grade physics",
  "Zero stress · zero timers",
  "Unlimited naps",
  "100% pettable",
  "Whisker-accurate",
  "Cloud-synced pets",
  "One very good cat",
];

function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden}>
      {TICKER_ITEMS.map((item) => (
        <span key={item + (hidden ? "-b" : "-a")} className="flex items-center">
          <span className="font-display font-medium tracking-wide text-frost/85 px-5 py-3 text-sm md:text-base whitespace-nowrap">
            {item}
          </span>
          <PawIcon className="w-3.5 h-3.5 text-mist/70" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 -rotate-[1.1deg] scale-[1.02] border-y border-mist/25 bg-[linear-gradient(to_right,#1b2838,#2a475e_50%,#1b2838)] shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      <div className="overflow-hidden">
        <div className="ticker-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* how to pet                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    Icon: CursorIcon,
    title: "Hover near Pip",
    text: "He'll follow your cursor with those big round eyes. He's polite like that. Blinking means trust — he blinks a lot.",
    offset: "md:ml-0",
  },
  {
    Icon: HandPetIcon,
    title: "Click to pet",
    text: "Every pet is counted, ranked, and synced to the cloud. Ranks go from “Stranger” to “Chosen Human”. There is no going back.",
    offset: "md:ml-[14%]",
  },
  {
    Icon: NoseBoopIcon,
    title: "Boop the nose (danger zone)",
    text: "One precise click on the pink triangle. He will have feelings about it. Forty pets and he naps on the job — and it's your fault.",
    offset: "md:ml-[5%]",
  },
];

function HowToPet() {
  return (
    <section id="how" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 py-24 md:py-32">
      <div className="reveal max-w-xl">
        <p className="flex items-center gap-2 text-mist font-extrabold text-xs tracking-[0.28em] uppercase">
          <PawIcon className="w-4 h-4" /> Field manual for humans
        </p>
        <h2 className="font-display font-semibold text-frost text-4xl md:text-6xl mt-4 leading-[1.02]">
          Three moves.
          <br />
          <span className="text-tabby font-light">One extremely smug cat.</span>
        </h2>
      </div>

      <ol className="relative mt-16 space-y-14">
        <span className="absolute left-[26px] top-2 bottom-2 border-l-2 border-dashed border-mist/20 hidden md:block" aria-hidden="true" />
        {STEPS.map((s, i) => (
          <li key={s.title} className={`reveal relative flex items-start gap-5 md:gap-8 ${s.offset} max-w-2xl`} style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="relative z-10 shrink-0 w-[52px] h-[52px] rounded-full border-2 border-mist/40 bg-deep grid place-items-center text-mist shadow-[0_0_25px_rgba(102,192,244,0.15)]">
              <s.Icon className="w-6 h-6" />
            </span>
            <div>
              <p className="font-display text-mist/35 font-semibold text-5xl md:text-6xl leading-none select-none">
                0{i + 1}
              </p>
              <h3 className="font-display font-semibold text-frost text-2xl md:text-3xl mt-2 group-hover:text-mist transition-colors">
                {s.title}
              </h3>
              <p className="mt-2 text-frost/65 leading-relaxed max-w-lg">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* wishlist                                                            */
/* ------------------------------------------------------------------ */

const TAGS = ["Cozy", "Cats", "Wholesome", "Point & Pet", "Nap Simulator", "Singleplayer"];

function Wishlist() {
  const [wished, setWished] = useState(false);
  return (
    <section id="wishlist" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 pb-24 md:pb-32">
      <div className="reveal rounded-xl overflow-hidden border border-white/10 bg-[linear-gradient(135deg,#2a475e_0%,#1b2838_60%)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
        <div className="grid md:grid-cols-2">
          {/* capsule art */}
          <div className="relative overflow-hidden group bg-panel">
            <img
              src={CAPSULE_URL}
              alt="Key art: Pip the tabby cat asleep on a knitted blanket by a moonlit window"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,26,33,0.55),transparent_45%)]" />
            <span className="absolute top-4 left-4 -rotate-3 bg-sprout text-ink font-display font-semibold text-sm tracking-wide px-3.5 py-1.5 rounded shadow-lg">
              COMING SOON
            </span>
            <span className="absolute bottom-4 left-4 text-[10px] font-extrabold tracking-[0.25em] text-frost/70 uppercase">
              Official nap · take one
            </span>
          </div>

          {/* copy */}
          <div className="p-7 md:p-10 flex flex-col">
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <span
                  key={t}
                  className="text-xs font-bold text-mist/90 bg-mist/10 border border-mist/20 rounded-sm px-2.5 py-1 hover:bg-mist/20 transition-colors cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>

            <h2 className="font-display font-semibold text-frost text-4xl md:text-5xl mt-6 leading-[1.03]">
              The nap is <span className="text-mist">loading…</span>
            </h2>
            <p className="mt-4 text-frost/70 leading-relaxed max-w-md">
              One rainy evening. One very good cat who remembers every pet you've ever given. We're still sewing the
              blankets — wishlist <em className="text-cream not-italic font-bold">Whiskers of Yesterday</em> on Steam and
              you'll know the exact moment Pip wakes up.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setWished((w) => !w)}
                className={`inline-flex items-center gap-2.5 font-extrabold text-ink px-6 py-3.5 rounded-sm transition-all duration-300 active:scale-95 ${
                  wished
                    ? "bg-[linear-gradient(to_right,#66c0f4,#1a9fff)] shadow-[0_8px_30px_rgba(102,192,244,0.35)]"
                    : "bg-[linear-gradient(to_right,#8bc53a,#588a1b)] hover:brightness-110 shadow-[0_8px_30px_rgba(164,208,7,0.25)]"
                }`}
              >
                {wished ? (
                  <>
                    <SteamWish className="w-5 h-5" />
                    On your list — Pip approves
                  </>
                ) : (
                  <>
                    <HeartOutline className="w-5 h-5" />
                    Wishlist on Steam
                  </>
                )}
              </button>
              <a
                href={MAILTO}
                className="inline-flex items-center gap-2.5 font-bold text-frost/85 border border-white/15 hover:border-mist hover:text-mist px-6 py-3.5 rounded-sm transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Email the studio
              </a>
            </div>

            <p className="mt-4 text-xs text-frost/45 font-semibold">
              {wished
                ? "Practice wishlists don't count. Yet. The real button goes live on Steam soon."
                : "The real Steam button unlocks at launch — this one is for practice pets."}{" "}
              Pip checks {SUPPORT_EMAIL} daily, between naps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer id="contact" className="relative z-10 scroll-mt-24 border-t border-white/5 bg-[linear-gradient(to_bottom,#171a21,#10121a)]">
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-10 text-center">
        <p className="reveal font-display font-light text-mist/80 tracking-[0.3em] text-xs uppercase">Transmission ends</p>
        <h2 className="reveal font-display font-semibold text-frost text-5xl md:text-7xl mt-5 leading-tight">
          See you soon, <span className="text-tabby">human.</span>
        </h2>
        <p className="reveal mt-4 text-frost/60 max-w-md mx-auto">
          Questions, fan art of Pip, or a formal complaint about the nose boop — the mailbox is open.
        </p>

        <a
          href={MAILTO}
          className="reveal group mt-9 inline-flex items-center gap-3 bg-cream text-ink font-display font-semibold text-lg px-7 py-4 rounded-full shadow-[0_15px_45px_rgba(255,232,201,0.15)] hover:shadow-[0_15px_55px_rgba(102,192,244,0.3)] hover:-translate-y-1 transition-all duration-300"
        >
          <EnvelopeIcon className="w-5 h-5 text-panel group-hover:text-link transition-colors" />
          {SUPPORT_EMAIL}
        </a>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-frost/35 font-semibold">
          <p className="flex items-center gap-2">
            <CatLogo className="w-5 h-5" />© 2026 Whiskers of Yesterday · coming soon to Steam
          </p>
          <p>Not affiliated with Valve Corporation. Pip inspected this website and found it acceptable.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* app                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [muted, setMutedState] = useState(false);
  useReveal();

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Background />
      <TopBar muted={muted} onToggleSound={() => setMutedState((m) => !m)} />

      <main className="relative z-10">
        {/* ---------- opening: the cat, obviously ---------- */}
        <section id="meet" className="scroll-mt-24 max-w-6xl mx-auto px-5 pt-28 md:pt-36 pb-20 md:pb-24">
          <div className="grid lg:grid-cols-[1.02fr_1fr] gap-14 lg:gap-10 items-center">
            <div className="reveal">
              <span className="inline-block -rotate-2 bg-mist text-ink font-display font-semibold text-[11px] tracking-[0.24em] uppercase px-3.5 py-2 rounded shadow-[0_8px_25px_rgba(102,192,244,0.3)]">
                A very cozy cat game
              </span>

              <h1 className="font-display mt-7 leading-[0.93]">
                <span className="block text-6xl md:text-8xl font-semibold text-frost">Whiskers</span>
                <span className="block mt-1 text-5xl md:text-7xl">
                  <span className="font-light text-mist/90">of&nbsp;</span>
                  <span className="font-semibold text-tabby">Yesterday</span>
                </span>
              </h1>

              <p className="mt-6 text-lg text-frost/70 leading-relaxed max-w-md">
                A soft little game about petting a cat who remembers everything. The kettle's not quite boiled and the
                blankets are still knitting — <span className="text-cream font-bold">it's coming soon.</span>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#wishlist"
                  className="inline-flex items-center gap-2.5 font-extrabold text-ink bg-[linear-gradient(to_right,#8bc53a,#588a1b)] hover:brightness-110 active:scale-95 px-6 py-3.5 rounded-sm shadow-[0_8px_30px_rgba(164,208,7,0.25)] transition-all"
                >
                  <SteamWish className="w-5 h-5" />
                  Wishlist on Steam
                </a>
                <a
                  href={MAILTO}
                  className="inline-flex items-center gap-2.5 font-bold text-frost/85 border border-white/15 hover:border-mist hover:text-mist px-6 py-3.5 rounded-sm transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Say hi to Pip
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-2.5">
                {[
                  { Icon: PawIcon, label: "100% pettable" },
                  { Icon: MoonIcon, label: "0 stress" },
                  { Icon: CloudIcon, label: "∞ naps" },
                  { Icon: CursorIcon, label: "press P to pet" },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-2 text-xs font-bold text-frost/65 border border-white/10 bg-deep/70 rounded-full px-3.5 py-2 hover:border-mist/50 hover:text-mist transition-colors cursor-default"
                  >
                    <c.Icon className="w-3.5 h-3.5 text-mist" />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: "120ms" }}>
              <CatScene />
              <p className="mt-3 text-center text-[11px] font-bold tracking-wide text-frost/40">
                ▲ live build · pet counter is legally binding
              </p>
            </div>
          </div>
        </section>

        <Ticker />
        <HowToPet />
        <Wishlist />
      </main>

      <Footer />
    </div>
  );
}
