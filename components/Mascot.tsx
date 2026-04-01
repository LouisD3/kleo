'use client';

export type MascotEmotion = 'idle' | 'thinking' | 'celebrate' | 'sad';

interface Props {
  emotion: MascotEmotion;
  /** 'floating' = fixed bottom-right widget (default). 'inline' = sits in the DOM flow. */
  variant?: 'floating' | 'inline';
  /** SVG size in px (default 80) */
  size?: number;
}

const ANIM: Record<MascotEmotion, string> = {
  idle:      'mascot-float',
  thinking:  'mascot-think',
  celebrate: 'mascot-celebrate',
  sad:       'mascot-sad',
};

const MESSAGES: Record<MascotEmotion, string> = {
  idle:      '',
  thinking:  '¡Revisando!',
  celebrate: '¡Genial! 🎉',
  sad:       '¡Tú puedes!',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Eyes({ emotion }: { emotion: MascotEmotion }) {
  if (emotion === 'celebrate') {
    return (
      <>
        <circle cx={29} cy={37} r={10} fill="white" />
        <circle cx={29} cy={36} r={6} fill="#0284C7" />
        <circle cx={31} cy={33} r={2.5} fill="white" />
        <circle cx={51} cy={37} r={10} fill="white" />
        <circle cx={51} cy={36} r={6} fill="#0284C7" />
        <circle cx={53} cy={33} r={2.5} fill="white" />
        {/* star accents */}
        <text x={19} y={44} fontSize={9} textAnchor="middle">✦</text>
        <text x={61} y={44} fontSize={9} textAnchor="middle">✦</text>
      </>
    );
  }

  if (emotion === 'sad') {
    return (
      <>
        {/* left */}
        <circle cx={29} cy={38} r={10} fill="white" />
        <circle cx={29} cy={41} r={6} fill="#0284C7" />
        <circle cx={31} cy={38} r={2.5} fill="white" />
        <path d="M 19 32 Q 29 37 39 32" fill="#7DD3FA" />
        <path d="M 20 27 L 38 31" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        {/* right */}
        <circle cx={51} cy={38} r={10} fill="white" />
        <circle cx={51} cy={41} r={6} fill="#0284C7" />
        <circle cx={53} cy={38} r={2.5} fill="white" />
        <path d="M 41 32 Q 51 37 61 32" fill="#7DD3FA" />
        <path d="M 42 31 L 60 27" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (emotion === 'thinking') {
    return (
      <>
        {/* left — looking up */}
        <circle cx={29} cy={37} r={10} fill="white" />
        <circle cx={30} cy={33} r={6} fill="#0284C7" />
        <circle cx={32} cy={31} r={2.5} fill="white" />
        {/* right */}
        <circle cx={51} cy={37} r={10} fill="white" />
        <circle cx={52} cy={33} r={6} fill="#0284C7" />
        <circle cx={54} cy={31} r={2.5} fill="white" />
        {/* raised brow */}
        <path d="M 43 24 L 62 21" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </>
    );
  }

  // idle
  return (
    <>
      <circle cx={29} cy={37} r={10} fill="white" />
      <circle cx={30} cy={38} r={6} fill="#0284C7" />
      <circle cx={32} cy={35} r={2.5} fill="white" />
      <circle cx={51} cy={37} r={10} fill="white" />
      <circle cx={52} cy={38} r={6} fill="#0284C7" />
      <circle cx={54} cy={35} r={2.5} fill="white" />
    </>
  );
}

function Mouth({ emotion }: { emotion: MascotEmotion }) {
  if (emotion === 'celebrate')
    return <path d="M 22 54 Q 40 68 58 54" fill="none" stroke="#0369A1" strokeWidth={3} strokeLinecap="round" />;
  if (emotion === 'sad')
    return <path d="M 27 59 Q 40 51 53 59" fill="none" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" />;
  if (emotion === 'thinking')
    return <path d="M 30 55 Q 38 60 48 56" fill="none" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" />;
  return <path d="M 24 54 Q 40 65 56 54" fill="none" stroke="#0369A1" strokeWidth={2.5} strokeLinecap="round" />;
}

function Arms({ emotion }: { emotion: MascotEmotion }) {
  // pivot points (top-center of each arm)
  const lp = '9, 74';
  const rp = '71, 74';

  if (emotion === 'celebrate') {
    return (
      <>
        <g transform={`rotate(-130, ${lp})`}>
          <rect x={2} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        </g>
        <g transform={`rotate(130, ${rp})`}>
          <rect x={64} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        </g>
      </>
    );
  }
  if (emotion === 'thinking') {
    return (
      <>
        <rect x={2} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        <g transform={`rotate(-65, ${rp})`}>
          <rect x={64} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        </g>
      </>
    );
  }
  if (emotion === 'sad') {
    return (
      <>
        <g transform={`rotate(18, ${lp})`}>
          <rect x={2} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        </g>
        <g transform={`rotate(-18, ${rp})`}>
          <rect x={64} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
        </g>
      </>
    );
  }
  return (
    <>
      <rect x={2} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
      <rect x={64} y={74} width={14} height={26} rx={7} fill="#1CB0F6" />
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// ── Shared SVG body (used by both variants) ──────────────────────────────────

function MascotSVG({ emotion, size = 80 }: { emotion: MascotEmotion; size?: number }) {
  const h = Math.round(size * (112 / 80));
  return (
    <div className="relative">
      {emotion === 'celebrate' && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2 text-sm mascot-sparkle pointer-events-none">
          <span>✨</span><span>🌟</span><span>✨</span>
        </div>
      )}
      {emotion === 'thinking' && (
        <div className="absolute -top-5 right-1 text-xs font-black text-blue-400 tracking-widest mascot-dots pointer-events-none">
          •••
        </div>
      )}
      <div className={ANIM[emotion]}>
        <svg viewBox="0 0 80 112" width={size} height={h} xmlns="http://www.w3.org/2000/svg">
          <rect x={37} y={5} width={6} height={12} rx={3} fill="#94A3B8" />
          <circle cx={40} cy={5} r={6} fill="#FCD34D" />
          <rect x={8} y={12} width={64} height={55} rx={20} fill="#1CB0F6" />
          <rect x={13} y={18} width={54} height={43} rx={14} fill="#7DD3FA" />
          <Eyes emotion={emotion} />
          <Mouth emotion={emotion} />
          <rect x={18} y={71} width={44} height={38} rx={13} fill="#0EA5E9" />
          <rect x={23} y={79} width={12} height={5} rx={2.5} fill="#38BDF8" />
          <rect x={45} y={79} width={12} height={5} rx={2.5} fill="#38BDF8" />
          <circle cx={40} cy={95} r={5} fill={emotion === 'sad' ? '#F87171' : '#4ADE80'} />
          <Arms emotion={emotion} />
        </svg>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Mascot({ emotion, variant = 'floating', size = 80 }: Props) {
  const message = MESSAGES[emotion];

  if (variant === 'inline') {
    return <MascotSVG emotion={emotion} size={size} />;
  }

  // floating
  return (
    <div className="fixed bottom-6 right-4 z-50 select-none pointer-events-none flex items-end gap-2">
      {message && (
        <div className="bg-white rounded-2xl px-3 py-2 text-xs font-black text-gray-700 shadow-lg border-2 border-gray-100 mb-5 whitespace-nowrap animate-pop-in">
          {message}
        </div>
      )}
      <MascotSVG emotion={emotion} size={size} />
    </div>
  );
}
