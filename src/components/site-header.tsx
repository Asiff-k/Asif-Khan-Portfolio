"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { nav, site, socials } from "@/content/site";
import { springDefault } from "@/lib/motion";
import { CloseIcon, MenuIcon } from "./icons";
import { RollText } from "./roll-text";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    root.dataset.menu = "open";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current || !buttonRef.current) return;
      // Keep focus inside the menu button and the open panel.
      const items = [buttonRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    function onResize() {
      if (window.matchMedia("(min-width: 64rem)").matches) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = previous;
      delete root.dataset.menu;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="page-x flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-3" aria-label={`${site.name}, home`}>
          <span className="font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
            {site.name}
          </span>
          <span className="t-stamp hidden text-fg-muted sm:inline">{site.location}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="t-label py-2 transition-colors duration-150 hover:text-accent aria-[current=page]:text-accent"
                >
                  <RollText text={item.label} />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="t-stamp pressable inline-flex items-center bg-fg px-4 py-3 text-on-fg hover:bg-accent"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="t-stamp pressable -mr-2 inline-flex items-center gap-2 px-2 py-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id="mobile-menu"
            data-lenis-prevent
            ref={panelRef}
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={reduce ? { duration: 0.15 } : springDefault}
          >
            <nav aria-label="Main" className="page-x py-6">
              <ul>
                {[...nav, { label: "Contact", href: "/#contact" }].map((item, i) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex items-baseline justify-between py-4 aria-[current=page]:text-accent"
                    >
                      <span className="t-title">{item.label}</span>
                      <span className="t-stamp text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="t-label text-fg-soft hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
