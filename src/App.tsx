import { useState } from "react";
import BrokenCountdown from "./components/BrokenCountdown";
import { useReveal } from "./hooks/useReveal";
import {
  CatLogo,
  DiscordIcon,
  EnvelopeIcon,
  FishIcon,
  HeartOutline,
  MoonIcon,
  PawIcon,
  StarIcon,
  SteamWish,
  YarnIcon,
} from "./components/icons";

const CAPSULE_URL =
  "https://image.qwenlm.ai/generated-images/de7d75e9-f0ec-45ef-930a-caa12b9a1c83/_result.png";

const IMG_DOOR =
  "https://image.qwenlm.ai/generated-images/13b676e1-b3ae-4e30-8aa7-c9256d3d1d10/_result.png";
const IMG_PHOTO =
  "https://image.qwenlm.ai/generated-images/4f43cce8-0ff0-4e94-ba3b-c6b6b9751177/_result.png";
const IMG_SUITCASE =
  "https://image.qwenlm.ai/generated-images/c3e2a0ba-d4e2-4ef9-962f-2c29c2e2a0bd/_result.png";

const SUPPORT_EMAIL = "support@whiskersofyesterday.com";
const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Meow — question about Whiskers of Yesterday")}`;

const DISCORD_URL = "https://discord.gg/whiskersofyesterday";
const DISCORD_HANDLE = "discord.gg/whiskersofyesterday";

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

function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-4">
        <a href="#when" className="flex items-center gap-2.5 group">
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
            ["Countdown", "#when"],
            ["The game", "#about"],
            ["The den", "#den"],
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

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Join the Discord"
            title="Join the den"
            className="p-2 rounded-md border border-white/10 text-frost/70 hover:text-white hover:bg-[#5865F2] hover:border-[#5865F2] transition-colors"
          >
            <DiscordIcon className="w-[18px] h-[18px]" />
          </a>
          <a
            href="#wishlist"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-ink bg-[linear-gradient(to_right,#8bc53a,#588a1b)] hover:brightness-110 active:scale-95 transition px-3.5 py-2 rounded-sm"
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
/* opening: the broken clock first, then the name                      */
/* ------------------------------------------------------------------ */

function Masthead() {
  return (
    <section id="meet" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 pt-16 md:pt-24 pb-20 md:pb-24">
      <div className="grid lg:grid-cols-[1.02fr_1fr] gap-14 lg:gap-12 items-center">
        <div className="reveal">
          <span className="inline-block -rotate-2 bg-mist text-ink font-display font-semibold text-[11px] tracking-[0.24em] uppercase px-3.5 py-2 rounded shadow-[0_8px_25px_rgba(102,192,244,0.3)]">
            A cozy home-alone cat game
          </span>

          <h1 className="font-display mt-7 leading-[0.93]">
            <span className="block text-6xl md:text-8xl font-semibold text-frost">Whiskers</span>
            <span className="block mt-1 text-5xl md:text-7xl">
              <span className="font-light text-mist/90">of&nbsp;</span>
              <span className="font-semibold text-tabby">Yesterday</span>
            </span>
          </h1>

          <p className="mt-6 text-lg text-frost/70 leading-relaxed max-w-md">
            The humans went on vacation. The cats stayed — and every memory in the house started to glow. Explore them
            together, up to 8 cats. <span className="text-cream font-bold">Coming soon.</span>
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
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 font-extrabold text-white bg-[#5865F2] hover:bg-[#4752C4] hover:-translate-y-0.5 active:scale-95 px-6 py-3.5 rounded-sm shadow-[0_8px_30px_rgba(88,101,242,0.35)] transition-all"
            >
              <DiscordIcon className="w-5 h-5" />
              Join the Discord
            </a>
          </div>
          <p className="mt-3.5 text-xs font-semibold text-frost/40">
            or whisper to{" "}
            <a href={MAILTO} className="text-mist hover:text-frost hover:underline transition-colors">
              {SUPPORT_EMAIL}
            </a>
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            {[
              { Icon: HeartOutline, label: "up to 8 cats" },
              { Icon: MoonIcon, label: "memory doors" },
              { Icon: StarIcon, label: "0 stress · no timers" },
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

        {/* key art */}
        <figure className="reveal group relative" style={{ transitionDelay: "120ms" }}>
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-panel rotate-1 group-hover:rotate-0 transition-transform duration-500 ease-out shadow-[0_35px_90px_-25px_rgba(0,0,0,0.85)]">
            <img
              src={CAPSULE_URL}
              alt="Key art: two real cats asleep on a vintage photo album, a packed suitcase by the door"
              className="w-full aspect-[16/11] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,26,33,0.65),transparent_45%)]" />
            <span className="absolute top-4 left-4 -rotate-3 bg-sprout text-ink font-display font-semibold text-sm tracking-wide px-3.5 py-1.5 rounded shadow-lg">
              COMING SOON
            </span>
            <figcaption className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-wide text-frost/80">
              <PawIcon className="w-3.5 h-3.5 text-mist shrink-0" />
              Official key art · the night the house woke up
            </figcaption>
          </div>
          <span className="absolute -bottom-4 -right-2 md:-right-5 rotate-3 bg-deep border border-mist/30 text-mist text-[10px] font-extrabold tracking-[0.18em] uppercase px-3 py-2 rounded shadow-lg">
            The humans are away
          </span>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ticker                                                              */
/* ------------------------------------------------------------------ */

const TICKER_ITEMS = [
  "Home alone",
  "Up to 8 cats",
  "Memory doors",
  "Certified cozy",
  "Suitcase approved",
  "No timers · no losing",
  "Unlimited naps",
  "Discord den open",
  "Purr-powered engine",
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
/* about the game                                                      */
/* ------------------------------------------------------------------ */

const VIGNETTES = [
  {
    src: IMG_DOOR,
    alt: "Two cats walking down a dark hallway where every framed photo glows",
    cap: "Every photo in the hallway is a door",
    cls: "-rotate-2 w-[88%]",
  },
  {
    src: IMG_PHOTO,
    alt: "A cat stepping through a glowing vintage photograph into a sunlit summer garden",
    cap: "One perfect summer, four paws at a time",
    cls: "rotate-2 w-[74%] ml-auto -mt-12",
  },
  {
    src: IMG_SUITCASE,
    alt: "Two cats napping together inside an open suitcase on a rainy window seat",
    cap: "Between chapters: suitcase duty",
    cls: "-rotate-1 w-[80%] -mt-10",
  },
];

const FACTS = [
  "co-op for up to 8 cats — couch or online",
  "every memory is a little world to wander",
  "the cats stay cats: pettable, nap-prone, judgmental",
];

function About() {
  return (
    <section id="about" className="relative z-10 scroll-mt-24">
      <div className="bg-[linear-gradient(135deg,#2a475e_0%,#1e3a52_45%,#1b2838_100%)] border-y border-mist/15">
        <div className="max-w-6xl mx-auto px-5 py-24 md:py-32 grid lg:grid-cols-[1fr_1.05fr] gap-16 lg:gap-12 items-center">
          <div className="reveal">
            <p className="text-mist font-extrabold text-xs tracking-[0.28em] uppercase">About this game</p>
            <h2 className="font-display font-semibold text-frost text-4xl md:text-6xl mt-4 leading-[1.02]">
              Home alone.
              <br />
              <span className="text-mist font-light">The whole past to explore.</span>
            </h2>

            <div className="mt-7 space-y-4 text-frost/70 leading-relaxed max-w-xl">
              <p>
                The humans left for vacation — and at night the house starts to hum. Photos, ticket stubs, the good
                sofa: all glowing. Step inside the memories, together, gently.
              </p>
              <p>No timers. No losing. Just cats, nostalgia, and room on the sofa for everyone.</p>
            </div>

            <ul className="mt-8 space-y-3">
              {FACTS.map((f) => (
                <li key={f} className="flex items-start gap-3 text-frost/75">
                  <PawIcon className="w-4 h-4 mt-1 shrink-0 text-sprout" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal relative" style={{ transitionDelay: "140ms" }}>
            {VIGNETTES.map((v) => (
              <figure
                key={v.src}
                className={`group relative ${v.cls} rounded-lg overflow-hidden border border-white/10 bg-panel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out hover:rotate-0 hover:-translate-y-1.5`}
              >
                <img
                  src={v.src}
                  alt={v.alt}
                  loading="lazy"
                  className="w-full h-44 md:h-56 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,26,33,0.7),transparent_45%)]" />
                <figcaption className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-3.5 py-2.5 text-[11px] font-bold tracking-wide text-frost/80">
                  <PawIcon className="w-3 h-3 text-mist shrink-0" />
                  {v.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* the discord den                                                     */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  { name: "the-den", note: "welcome mat" },
  { name: "memory-jars", note: "screenshot dump" },
  { name: "cat-pics", note: "mandatory" },
  { name: "bug-hunting", note: "snags & sneezes" },
];

function DiscordDen() {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    };
    const fallback = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = DISCORD_URL;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* noop */
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(DISCORD_URL).then(done).catch(() => {
        fallback();
        done();
      });
    } else {
      fallback();
      done();
    }
  };

  return (
    <section id="den" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 py-24 md:py-28">
      <div className="reveal relative overflow-hidden rounded-lg border border-white/15 bg-[linear-gradient(120deg,#5865F2_0%,#4752C4_60%,#3d46a8_100%)] shadow-[0_40px_100px_-30px_rgba(88,101,242,0.55)]">
        {/* watermark */}
        <DiscordIcon className="absolute -right-12 -bottom-16 w-72 h-72 text-white/[0.07] rotate-12 pointer-events-none" />
        <PawIcon className="absolute -left-8 -top-10 w-40 h-40 text-white/[0.06] -rotate-12 pointer-events-none" />

        <div className="relative grid md:grid-cols-[1.05fr_0.95fr] gap-12 p-8 md:p-12 items-center">
          {/* pitch */}
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.24em] uppercase text-white/85 bg-black/20 border border-white/25 rounded-full px-3.5 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sprout-light pulse-online" />
              Pip is online — napping in #the-den
            </p>

            <h2 className="font-display font-semibold text-white text-4xl md:text-6xl mt-6 leading-[1.02]">
              The den is <span className="text-cream">open.</span>
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed max-w-md">
              Dev updates, cozy screenshots, and one channel where cat pictures are mandatory. Come claim your spot on
              the good sofa before launch day.
            </p>

            <div className="mt-7 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-white/55">Invite</span>
              <code className="font-bold text-sm text-cream bg-black/25 border border-white/20 rounded-sm px-3.5 py-2">
                {DISCORD_HANDLE}
              </code>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 font-extrabold text-[#5865F2] bg-white hover:bg-cream hover:-translate-y-0.5 active:scale-95 px-6 py-3.5 rounded-sm shadow-[0_12px_35px_rgba(0,0,0,0.3)] transition-all"
              >
                <DiscordIcon className="w-5 h-5" />
                Join the Discord
              </a>
              <button
                onClick={copyInvite}
                className={`inline-flex items-center gap-2.5 font-bold px-6 py-3.5 rounded-sm border transition-all active:scale-95 ${
                  copied
                    ? "border-sprout-light/70 text-sprout-light bg-black/20"
                    : "border-white/35 text-white hover:bg-white/10"
                }`}
              >
                {copied ? "copied ✓" : "Copy invite"}
              </button>
            </div>
          </div>

          {/* server card */}
          <div className="relative">
            <div className="rotate-1 hover:rotate-0 transition-transform duration-500 ease-out rounded-lg overflow-hidden bg-[#313338] border border-black/40 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]">
              {/* banner */}
              <div className="h-16 bg-[linear-gradient(120deg,#2a475e,#5865F2)] relative">
                <PawIcon className="absolute right-4 top-4 w-5 h-5 text-white/30" />
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-end gap-3">
                  <span className="-mt-7 w-14 h-14 rounded-full bg-[#5865F2] border-[5px] border-[#313338] grid place-items-center shrink-0">
                    <CatLogo className="w-8 h-8" />
                  </span>
                  <div className="pb-0.5">
                    <p className="font-display font-semibold text-white leading-tight">Whiskers of Yesterday</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-sprout-light">
                        <span className="w-2 h-2 rounded-full bg-sprout-light pulse-online" />
                        187 online
                      </span>
                      <span className="text-white/35">· 2,412 cozy people</span>
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[10px] font-extrabold tracking-[0.2em] uppercase text-white/30">
                  Text channels
                </p>
                <ul className="mt-2 space-y-0.5">
                  {CHANNELS.map((c) => (
                    <li
                      key={c.name}
                      className="group flex items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-bold text-white/55 hover:text-white hover:bg-white/5 hover:translate-x-1 transition-all cursor-default"
                    >
                      <span className="text-white/30 group-hover:text-white/60 transition-colors">#</span>
                      {c.name}
                      <span className="ml-auto text-[10px] font-extrabold tracking-wide uppercase text-white/25 group-hover:text-cream/60 transition-colors">
                        {c.note}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center gap-2.5 text-xs font-bold text-white/50">
                  <span className="w-5 h-5 rounded-full bg-tabby grid place-items-center text-[9px] font-black text-ink">
                    P
                  </span>
                  Pip is typing
                  <span className="flex items-center text-white/70">
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                    <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* wishlist                                                            */
/* ------------------------------------------------------------------ */

const TAGS = ["Cozy", "Cats", "Co-op (up to 8)", "Exploration", "Wholesome", "Nap Simulator"];

function Wishlist() {
  const [wished, setWished] = useState(false);
  return (
    <section id="wishlist" className="relative z-10 scroll-mt-24 max-w-6xl mx-auto px-5 py-24 md:py-32">
      <div className="reveal rounded-xl overflow-hidden border border-white/10 bg-[linear-gradient(135deg,#2a475e_0%,#1b2838_60%)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
        <div className="grid md:grid-cols-2">
          <div className="relative overflow-hidden group bg-panel">
            <img
              src={CAPSULE_URL}
              alt="Key art: two real cats asleep on a vintage photo album, a packed suitcase by the door"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,26,33,0.55),transparent_45%)]" />
            <span className="absolute top-4 left-4 -rotate-3 bg-sprout text-ink font-display font-semibold text-sm tracking-wide px-3.5 py-1.5 rounded shadow-lg">
              COMING SOON
            </span>
            <span className="absolute bottom-4 left-4 text-[10px] font-extrabold tracking-[0.25em] text-frost/70 uppercase">
              The humans are away · the memories are awake
            </span>
          </div>

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
              The humans come back eventually. The game arrives when it's ready — wishlist{" "}
              <em className="text-cream not-italic font-bold">Whiskers of Yesterday</em> on Steam and be first through
              the photo.
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
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 font-bold text-frost/85 border border-white/15 hover:border-[#5865F2] hover:text-white px-6 py-3.5 rounded-sm transition-colors"
              >
                <DiscordIcon className="w-5 h-5" />
                Join the den
              </a>
            </div>

            <p className="mt-4 text-xs text-frost/45 font-semibold">
              The real Steam button unlocks at launch — this one is for practice pets. Pip checks {SUPPORT_EMAIL}{" "}
              daily, between naps.
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

        <a
          href={MAILTO}
          className="reveal group mt-9 inline-flex items-center gap-3 bg-cream text-ink font-display font-semibold text-lg px-7 py-4 rounded-full shadow-[0_15px_45px_rgba(255,232,201,0.15)] hover:shadow-[0_15px_55px_rgba(102,192,244,0.3)] hover:-translate-y-1 transition-all duration-300"
        >
          <EnvelopeIcon className="w-5 h-5 text-panel group-hover:text-link transition-colors" />
          {SUPPORT_EMAIL}
        </a>

        <div className="reveal mt-7 flex items-center justify-center gap-4 text-sm font-bold text-frost/50">
          <span className="hidden sm:block w-10 border-t border-white/10" />
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-white hover:-translate-y-0.5 transition-all"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            {DISCORD_HANDLE}
          </a>
          <span className="hidden sm:block w-10 border-t border-white/10" />
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-frost/35 font-semibold">
          <p className="flex items-center gap-2">
            <CatLogo className="w-5 h-5" />© 2026 Whiskers of Yesterday · coming soon to Steam
          </p>
          <p>Not affiliated with Valve Corporation. The cats inspected this website and found it acceptable.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* app                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  useReveal();

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Background />
      <TopBar />

      <main className="relative z-10">
        <BrokenCountdown />
        <Masthead />
        <Ticker />
        <About />
        <DiscordDen />
        <Wishlist />
      </main>

      <Footer />
    </div>
  );
}
