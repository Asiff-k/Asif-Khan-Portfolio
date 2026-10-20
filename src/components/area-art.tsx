// Neutral monochrome illustrations for the "What I do" areas. They stand for
// the kind of work (code, interfaces, posters) without showing anyone's real
// product, so nothing on the page passes off other people's work as Asif's.
// Decorative: the text next to them describes the work.

export type ArtKey = "editor" | "terminal" | "wireframe" | "canvas" | "poster-sun" | "poster-type" | "poster-grid" | "poster-can";

const C = { bg: "#141414", panel: "#1c1c1c", rule: "#2e2e2e", dim: "#4a4a4a", mid: "#8a8a8a", hi: "#f5f5f5" };

export function AreaArt({ name }: { name: ArtKey }) {
  const Art = arts[name];
  return <Art />;
}

function Svg({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className="block size-full">
      <rect width={w} height={h} fill={C.bg} />
      {children}
    </svg>
  );
}

function Editor() {
  // Indent and width of each code line, and which lines carry a bright token.
  const lines: [number, number, boolean][] = [
    [0, 92, true], [14, 140, false], [14, 72, false], [28, 118, true], [28, 96, false], [42, 150, false],
    [28, 60, false], [14, 34, true], [0, 20, false], [0, 0, false], [0, 104, true], [14, 128, false], [0, 24, false],
  ];
  return (
    <Svg w={320} h={200}>
      <rect width={320} height={22} fill={C.panel} />
      {[10, 20, 30].map((x) => (
        <rect key={x} x={x} y={8} width={6} height={6} fill={C.dim} />
      ))}
      <rect x={52} y={8} width={46} height={6} fill={C.mid} />
      <rect x={106} y={8} width={38} height={6} fill={C.dim} />
      <rect x={0} y={22} width={34} height={178} fill={C.panel} />
      {lines.map(([indent, w, bright], i) => (
        <g key={i}>
          <rect x={12} y={34 + i * 12.4} width={10} height={4} fill={C.rule} />
          {w > 0 && <rect x={46 + indent} y={33 + i * 12.4} width={w} height={5} fill={C.dim} />}
          {bright && <rect x={46 + indent} y={33 + i * 12.4} width={Math.min(36, w)} height={5} fill={C.hi} />}
        </g>
      ))}
      <rect x={46 + 14 + 128 + 4} y={30 + 11 * 12.4} width={2} height={11} fill={C.hi} />
    </Svg>
  );
}

function Terminal() {
  return (
    <Svg w={320} h={200}>
      <rect width={320} height={22} fill={C.panel} />
      <rect x={10} y={8} width={60} height={6} fill={C.dim} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={14} y={38 + i * 18} width={8} height={5} fill={C.mid} />
          <rect x={28} y={38 + i * 18} width={[120, 84, 160, 64, 104][i]} height={5} fill={i % 2 ? C.dim : C.mid} />
        </g>
      ))}
      <rect x={14} y={136} width={292} height={8} fill="none" stroke={C.rule} />
      <rect x={16} y={138} width={196} height={4} fill={C.hi} />
      <rect x={14} y={160} width={8} height={5} fill={C.hi} />
      <rect x={28} y={157} width={7} height={11} fill={C.hi} />
    </Svg>
  );
}

function Wireframe() {
  return (
    <Svg w={320} h={200}>
      <rect x={16} y={14} width={20} height={8} fill={C.hi} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={170 + i * 26} y={16} width={18} height={4} fill={C.mid} />
      ))}
      <rect x={278} y={12} width={28} height={12} fill="none" stroke={C.hi} />
      <line x1={0} y1={34} x2={320} y2={34} stroke={C.rule} />
      <rect x={16} y={52} width={130} height={12} fill={C.hi} />
      <rect x={16} y={70} width={100} height={12} fill={C.hi} />
      <rect x={16} y={92} width={124} height={4} fill={C.mid} />
      <rect x={16} y={100} width={96} height={4} fill={C.mid} />
      <rect x={16} y={114} width={46} height={14} fill={C.hi} />
      <rect x={168} y={48} width={136} height={84} fill="none" stroke={C.dim} />
      <line x1={168} y1={48} x2={304} y2={132} stroke={C.rule} />
      <line x1={304} y1={48} x2={168} y2={132} stroke={C.rule} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16 + i * 100} y={146} width={88} height={40} fill={C.panel} stroke={C.rule} />
          <rect x={24 + i * 100} y={156} width={40} height={4} fill={C.mid} />
          <rect x={24 + i * 100} y={166} width={60} height={3} fill={C.dim} />
        </g>
      ))}
    </Svg>
  );
}

function Canvas() {
  return (
    <Svg w={320} h={200}>
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40 + 20} y1={0} x2={i * 40 + 20} y2={200} stroke="#191919" />
      ))}
      <rect x={34} y={26} width={84} height={156} fill={C.panel} stroke={C.dim} />
      <rect x={44} y={40} width={40} height={6} fill={C.hi} />
      <rect x={44} y={56} width={64} height={46} fill={C.rule} />
      <rect x={44} y={110} width={56} height={4} fill={C.mid} />
      <rect x={44} y={118} width={44} height={4} fill={C.dim} />
      <rect x={44} y={156} width={64} height={14} fill={C.hi} />
      <rect x={146} y={46} width={140} height={86} fill={C.panel} stroke={C.dim} />
      <rect x={158} y={60} width={70} height={8} fill={C.mid} />
      <rect x={158} y={76} width={116} height={40} fill="none" stroke={C.hi} strokeWidth={1.5} />
      {[
        [158, 76],
        [274, 76],
        [158, 116],
        [274, 116],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width={6} height={6} fill={C.bg} stroke={C.hi} />
      ))}
      <line x1={158} y1={146} x2={274} y2={146} stroke={C.mid} strokeDasharray="3 3" />
      <rect x={202} y={152} width={28} height={10} fill={C.hi} />
    </Svg>
  );
}

function PosterSun() {
  return (
    <Svg w={300} h={400}>
      <circle cx={150} cy={150} r={86} fill={C.hi} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={0} y={236 + i * 14} width={300} height={6 - i * 0.6} fill={i % 2 ? C.dim : C.mid} />
      ))}
      <rect x={24} y={340} width={120} height={10} fill={C.hi} />
      <rect x={24} y={358} width={80} height={5} fill={C.mid} />
    </Svg>
  );
}

function PosterType() {
  return (
    <Svg w={300} h={400}>
      <text x={20} y={250} fill={C.hi} fontFamily="var(--font-display)" fontWeight={800} fontSize={250} letterSpacing={-12}>
        Aa
      </text>
      <rect x={20} y={300} width={260} height={1} fill={C.dim} />
      <rect x={20} y={316} width={140} height={6} fill={C.mid} />
      <rect x={20} y={330} width={100} height={6} fill={C.dim} />
      <rect x={236} y={22} width={44} height={44} fill="none" stroke={C.hi} />
    </Svg>
  );
}

function PosterGrid() {
  return (
    <Svg w={300} h={400}>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={26 + c * 64}
            y={30 + r * 64}
            width={48}
            height={48}
            fill={(r + c) % 3 === 0 ? C.hi : "none"}
            stroke={(r + c) % 3 === 0 ? "none" : C.dim}
            transform={(r * 4 + c) % 5 === 2 ? `rotate(45 ${50 + c * 64} ${54 + r * 64})` : undefined}
          />
        )),
      )}
      <rect x={26} y={362} width={110} height={8} fill={C.mid} />
    </Svg>
  );
}

function PosterCan() {
  return (
    <Svg w={300} h={400}>
      <ellipse cx={150} cy={96} rx={62} ry={12} fill={C.mid} />
      <rect x={88} y={96} width={124} height={204} fill={C.hi} />
      <ellipse cx={150} cy={300} rx={62} ry={12} fill={C.hi} />
      <rect x={88} y={170} width={124} height={44} fill={C.bg} />
      <rect x={104} y={186} width={70} height={8} fill={C.hi} />
      <rect x={196} y={96} width={10} height={204} fill="#d4d4d4" />
      <rect x={24} y={344} width={96} height={8} fill={C.hi} />
      <rect x={24} y={360} width={150} height={5} fill={C.dim} />
    </Svg>
  );
}

const arts: Record<ArtKey, () => React.JSX.Element> = {
  editor: Editor,
  terminal: Terminal,
  wireframe: Wireframe,
  canvas: Canvas,
  "poster-sun": PosterSun,
  "poster-type": PosterType,
  "poster-grid": PosterGrid,
  "poster-can": PosterCan,
};
