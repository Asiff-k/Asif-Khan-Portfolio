/**
 * Text roll for nav links: on hover or keyboard focus each letter rolls up to
 * a second copy, one after another. The letters are aria-hidden; the plain
 * text stays for screen readers. CSS only (see .roll in globals.css), and off
 * on touch and with reduced motion.
 */
export function RollText({ text }: { text: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="roll-letters">
        {[...text].map((ch, i) => {
          const c = ch === " " ? " " : ch;
          return (
            <span key={i} className="roll-char" style={{ "--i": i } as React.CSSProperties}>
              <span>{c}</span>
              <span>{c}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
