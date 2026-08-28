type IconProps = { className?: string };

export function PawIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="12" cy="15.5" rx="5.4" ry="4.4" />
      <circle cx="5" cy="9.8" r="2.4" />
      <circle cx="9.4" cy="6.6" r="2.4" />
      <circle cx="14.6" cy="6.6" r="2.4" />
      <circle cx="19" cy="9.8" r="2.4" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 20.5C7 16.6 3.2 13.3 3.2 9.4 3.2 6.6 5.4 4.5 8 4.5c1.7 0 3.1.8 4 2.1.9-1.3 2.3-2.1 4-2.1 2.6 0 4.8 2.1 4.8 4.9 0 3.9-3.8 7.2-8.8 11.1z" />
    </svg>
  );
}

export function HeartOutline({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.8C7.7 16.5 4.4 13.6 4.4 10.2c0-2.3 1.8-4 3.9-4 1.5 0 2.8.8 3.7 2 .9-1.2 2.2-2 3.7-2 2.1 0 3.9 1.7 3.9 4 0 3.4-3.3 6.3-7.6 9.6z"
      />
    </svg>
  );
}

export function FishIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3.5 12c2.6-3.8 6.4-6 10.4-6 2.6 0 5 1 6.6 2.6l-2 3.4 2 3.4C18.9 17 16.5 18 13.9 18 9.9 18 6.1 15.8 3.5 12z" />
      <path d="M2.5 8.6 6 12l-3.5 3.4c-.6-2.2-.6-4.6 0-6.8z" opacity=".7" />
      <circle cx="15.4" cy="10.4" r="1.15" fill="#171a21" />
    </svg>
  );
}

export function YarnIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="11" cy="12" r="7.2" />
      <path strokeLinecap="round" d="M4.6 9.5c4.2 1 8.6 1 12.8 0M4.6 14.5c4.2-1 8.6-1 12.8 0M8.2 5.6c1.8 4.2 1.8 8.6 0 12.8M13.8 5.6c-1.8 4.2-1.8 8.6 0 12.8" />
      <path strokeLinecap="round" d="M17.5 15.5c2.3 1.4 3.5 3.4 3.9 5.5" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.5 14.2A8.5 8.5 0 0 1 9.8 4.5a8.5 8.5 0 1 0 9.7 9.7z" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3.2l2.5 5.6 6.1.6-4.6 4.1 1.3 6-5.3-3.1-5.3 3.1 1.3-6L3.4 9.4l6.1-.6z" />
    </svg>
  );
}

export function CloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.5 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 16.6 8.7 4.4 4.4 0 0 1 17.5 18h-11z" />
    </svg>
  );
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

export function CursorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 3.5 18.5 11l-5.6 1.4 3 5.7-2.7 1.4-3-5.7L6 17.5z" />
    </svg>
  );
}

export function HandPetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12.5V6.8a1.6 1.6 0 0 1 3.2 0v4.4m0-5.6a1.6 1.6 0 0 1 3.2 0v5.6m0-4a1.6 1.6 0 0 1 3.2 0v7.4c0 3.6-2.4 6-6 6-3.2 0-4.6-1.6-6.4-4.6L3.6 13c-.8-1.3.8-2.7 2-1.8L8 13.6"
      />
    </svg>
  );
}

export function NoseBoopIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v3M5.5 6.5l1.8 2M18.5 6.5l-1.8 2" />
      <path
        fill="currentColor"
        stroke="none"
        d="M8.6 12.2c1-2 2.2-3 3.4-3s2.4 1 3.4 3c.9 1.8.6 3.6-.6 4.8a4 4 0 0 1-5.6 0c-1.2-1.2-1.5-3-.6-4.8z"
      />
    </svg>
  );
}

export function SpeakerIcon({ className, muted }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path strokeLinejoin="round" d="M4 9.5h3.2L12 5.4v13.2l-4.8-4.1H4z" fill="currentColor" stroke="none" />
      {muted ? (
        <path strokeLinecap="round" d="m15.5 9.5 5 5m0-5-5 5" />
      ) : (
        <path strokeLinecap="round" d="M15.5 9a4.3 4.3 0 0 1 0 6M18 6.8a8 8 0 0 1 0 10.4" />
      )}
    </svg>
  );
}

export function CatLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M7 13 5 3.8 14.5 9Z" fill="var(--color-tabby)" />
      <path d="M25 13 27 3.8 17.5 9Z" fill="var(--color-tabby)" />
      <circle cx="16" cy="17.5" r="10.5" fill="var(--color-tabby)" />
      <circle cx="12.2" cy="15.5" r="1.6" fill="#171a21" />
      <circle cx="19.8" cy="15.5" r="1.6" fill="#171a21" />
      <path d="M14.6 20.4q1.4 1.5 2.8 0" stroke="#171a21" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M16 18.4l-1.3 1.4h2.6z" fill="#e27396" />
      <path d="M4.5 15.5 1 14.5M4.5 18.5 1.2 19.5M27.5 15.5 31 14.5M27.5 18.5l3.3 1" stroke="var(--color-frost)" strokeWidth="1" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function SteamWish({ className }: IconProps) {
  /* a little steam-whistle heart: heart with steam curls */
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path
        fill="currentColor"
        stroke="none"
        d="M12 20.5C7 16.6 3.2 13.3 3.2 9.4 3.2 6.6 5.4 4.5 8 4.5c1.7 0 3.1.8 4 2.1.9-1.3 2.3-2.1 4-2.1 2.6 0 4.8 2.1 4.8 4.9 0 3.9-3.8 7.2-8.8 11.1z"
      />
      <path strokeLinecap="round" d="M9 2.8c-.8.9-.8 1.7 0 2.4M15 2.2c-.8.9-.8 1.7 0 2.4" opacity=".85" />
    </svg>
  );
}
