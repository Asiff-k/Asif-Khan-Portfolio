/**
 * Re-mounts on every navigation between projects: a moss panel covers the new
 * page and wipes away upward (0.6s, CSS only, so it never holds up the App
 * Router or hides content without JavaScript). Off with reduced motion.
 */
export default function ProjectTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div aria-hidden className="page-wipe" />
    </>
  );
}
