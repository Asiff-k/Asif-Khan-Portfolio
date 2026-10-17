type Props = {
  index: string;
  label: string;
  title: string;
  id?: string;
  children?: React.ReactNode;
  inverted?: boolean;
};

/** Editorial section header: index stamp, title, and an optional note on the right. */
export function SectionHead({ index, label, title, id, children, inverted }: Props) {
  return (
    <div className={`grid gap-6 border-b pb-8 md:grid-cols-12 ${inverted ? "border-carbon-rule" : "border-ink"}`}>
      <div className="md:col-span-7">
        <p className={`t-stamp ${inverted ? "text-mint" : "text-moss"}`}>
          {index} · {label}
        </p>
        <h2 id={id} className="t-display-lg mt-4">
          {title}
        </h2>
      </div>
      {children && (
        <div className={`t-body-sm md:col-span-4 md:col-start-9 md:self-end ${inverted ? "text-carbon-muted" : "text-ink-soft"}`}>
          {children}
        </div>
      )}
    </div>
  );
}
