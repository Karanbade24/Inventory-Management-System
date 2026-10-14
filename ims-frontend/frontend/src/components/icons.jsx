// Small inline icon set (no external icon library needed). Each icon is a
// 20x20 viewBox stroke icon so they line up consistently in the sidebar
// and stat cards.

const common = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export function IconGrid() {
  return (
    <svg {...common}>
      <rect x="3" y="3" width="6" height="6" rx="1.2" />
      <rect x="11" y="3" width="6" height="6" rx="1.2" />
      <rect x="3" y="11" width="6" height="6" rx="1.2" />
      <rect x="11" y="11" width="6" height="6" rx="1.2" />
    </svg>
  );
}

export function IconBuilding() {
  return (
    <svg {...common}>
      <rect x="4" y="2.5" width="9" height="15" rx="1" />
      <path d="M13 8h3v9.5h-3" />
      <path d="M7 6h1M10 6h1M7 9h1M10 9h1M7 12h1M10 12h1" />
    </svg>
  );
}

export function IconLayers() {
  return (
    <svg {...common}>
      <path d="M10 2.5 3 6.5 10 10.5 17 6.5Z" />
      <path d="M3 10.5 10 14.5 17 10.5" />
      <path d="M3 14.5 10 18.5 17 14.5" />
    </svg>
  );
}

export function IconCart() {
  return (
    <svg {...common}>
      <path d="M2.5 3h2l2 10.5h9L17.5 6H5.4" />
      <circle cx="7.5" cy="17" r="1.2" />
      <circle cx="14.5" cy="17" r="1.2" />
    </svg>
  );
}

export function IconDocument() {
  return (
    <svg {...common}>
      <path d="M6 2.5h6l3 3v12H6Z" />
      <path d="M12 2.5V6h3" />
      <path d="M8 10h5M8 13h5M8 16h3" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg {...common}>
      <path d="M3 17V3" />
      <path d="M3 17h14" />
      <rect x="5.5" y="11" width="2.4" height="6" rx="0.4" />
      <rect x="9.5" y="7" width="2.4" height="10" rx="0.4" />
      <rect x="13.5" y="9.5" width="2.4" height="7.5" rx="0.4" />
    </svg>
  );
}

export function IconBox() {
  return (
    <svg {...common}>
      <path d="M10 2.5 17 6.5v7L10 17.5 3 13.5v-7Z" />
      <path d="M3 6.5 10 10.5 17 6.5" />
      <path d="M10 10.5v7" />
    </svg>
  );
}

export function IconBox3D() {
  return (
    <svg {...common}>
      <path d="M10 2.5 17 6.5v7L10 17.5 3 13.5v-7Z" />
      <path d="M3 6.5 10 10.5 17 6.5" />
      <path d="M10 10.5v7" />
    </svg>
  );
}

export function IconArrowRight() {
  return (
    <svg {...common} strokeWidth={2}>
      <path d="M4 10h12" />
      <path d="M11 5l5 5-5 5" />
    </svg>
  );
}

export function IconRefresh() {
  return (
    <svg {...common} strokeWidth={2}>
      <path d="M17 10a7 7 0 1 1-2.1-5" />
      <path d="M17 3v5h-5" />
    </svg>
  );
}
