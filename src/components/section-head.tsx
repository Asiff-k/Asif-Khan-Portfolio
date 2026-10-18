type Props = {
  index: string;
  label: string;
  title: string;
  id?: string;
  children?: React.ReactNode;
};

/**
 * Editorial section header: index stamp, title, and an optional note on the right.
 * Colours follow the current scene (light or dark).
 */
export function SectionHead({ index, label, title, id, children }: Props) {
  return (
    <div className="grid gap-6 border-b border-line-strong pb-8 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="t-stamp text-accent">
          {index} · {label}
        </p>
        <h2 id={id} data-reveal="heading" className="t-display-lg mt-4">
          {title}
        </h2>
      </div>
      {children && (
        <div className="t-body-sm text-fg-soft md:col-span-4 md:col-start-9 md:self-end">{children}</div>
      )}
    </div>
  );
}
