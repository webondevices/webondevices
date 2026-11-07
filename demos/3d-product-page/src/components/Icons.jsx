const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Search = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const User = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>
)
export const Cart = (p) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20" r="1.2" /><circle cx="17" cy="20" r="1.2" />
  </svg>
)
export const Heart = (p) => (
  <svg {...base} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
)
export const Truck = (p) => (
  <svg {...base} {...p}>
    <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" />
  </svg>
)
export const Box = (p) => (
  <svg {...base} {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>
)
export const Shield = (p) => (
  <svg {...base} {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const Star = ({ fill = 1, ...p }) => (
  <svg {...base} {...p} strokeWidth={1.2}>
    <defs>
      <linearGradient id={`sf${fill}`}>
        <stop offset={fill} stopColor="currentColor" />
        <stop offset={fill} stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1-4.5-4.2 6.1-.8L12 3Z"
      fill={`url(#sf${fill})`}
    />
  </svg>
)
export const Arrow = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const Chevron = ({ dir = 'down', ...p }) => {
  const r = { down: 0, left: 90, up: 180, right: -90 }[dir]
  return (
    <svg {...base} {...p} style={{ transform: `rotate(${r}deg)`, ...p.style }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
export const Plus = (p) => (
  <svg {...base} {...p} strokeWidth={2}><path d="M12 6v12M6 12h12" /></svg>
)
export const Close = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const Drag = (p) => (
  <svg {...base} {...p}>
    <path d="M8 12h8M5 9l-3 3 3 3M19 9l3 3-3 3" />
    <path d="M12 4v3M12 17v3" opacity="0.5" />
  </svg>
)
export const Mountain = (p) => (
  <svg {...base} {...p}><path d="m2 20 7-12 4 6 3-4 6 10H2Z" /><path d="m7.5 10.5 1.5 1.5 1.5-1.5" /></svg>
)
export const Laces = (p) => (
  <svg {...base} {...p}>
    <path d="M6 5h12M6 10h12M6 15h12" /><path d="M6 5 18 10M18 5 6 10M6 10l12 5M18 10 6 15" opacity="0.6" />
    <path d="M10 15c-1 2.5-2 4-4 5M14 15c1 2.5 2 4 4 5" />
  </svg>
)
export const Drop = (p) => (
  <svg {...base} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /><path d="M9 15a3 3 0 0 0 3 3" /></svg>
)
export const Heel = (p) => (
  <svg {...base} {...p}><path d="M6 3v11c0 3 2 6 6 6h6c1.5 0 2-1 2-2v-1c0-1-1-2-3-2h-3c-2 0-3-1-3-3V3" /></svg>
)
export const Toe = (p) => (
  <svg {...base} {...p}><path d="M3 17h13c3 0 5-1.5 5-4 0-2-2-3.5-5-4l-5-1-3-3H3v12Z" /><path d="M14 8.5c2 .5 3 2 3 4.5" /></svg>
)
export const Layers = (p) => (
  <svg {...base} {...p}><path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z" /><path d="m3 13 9 4.5 9-4.5" /><path d="m3 17 9 4.5 9-4.5" opacity="0.5" /></svg>
)
export const Grip = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3c-2 3-2 15 0 18h10c2-3 2-15 0-18H7Z" />
    <path d="M9 7h6M8.5 10.5h7M8.5 14h7M9 17.5h6" />
  </svg>
)
export const Leaf = (p) => (
  <svg {...base} {...p}><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19 13 11" /></svg>
)
export const Rotate = (p) => (
  <svg {...base} {...p}><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v4h-4" /></svg>
)
