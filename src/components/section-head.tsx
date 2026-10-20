type Props = {
  index: string;
  label: string;
  title: string;
  id?: string;
  children?: React.ReactNode;
};

/**
 * Section header: a small pill badge (index and label), the title, and an
 * optional note on the right.
 */
export function SectionHead({ index, label, title, id, children }: Props) {
  return (
    <div className="grid gap-6 pb-10 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="pill-badge" data-reveal="fade">
          <span className="font-mono text-[0.6875rem] text-fg-muted">{index}</span> {label}
        </p>
        <h2 id={id} data-reveal="heading" className="t-display-lg mt-4">
          {title}
        </h2>
      </div>
      {children && (
        <p className="t-body-sm text-fg-soft md:col-span-4 md:col-start-9 md:self-end">{children}</p>
      )}
    </div>
  );
}
