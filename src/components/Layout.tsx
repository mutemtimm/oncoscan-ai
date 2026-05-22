import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

function DnaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M4 4c4 4 12 12 16 16M20 4C16 8 8 16 4 20M7 5h10M7 19h10M5 8h14M5 16h14" />
    </svg>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/detection", label: "Detection" },
  { to: "/about-disease", label: "About the Disease" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/team", label: "Our Team" },
] as const;

function Navbar() {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_-10px_rgba(10,22,40,0.15)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[#1a1040] text-white flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition">
            <DnaIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-navy text-lg leading-none">OncoScan AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Medical Diagnostic</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`nav-link text-sm font-medium text-navy/80 hover:text-primary transition-colors ${active ? "is-active" : ""}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden w-9 h-9 rounded-lg bg-white/70 border border-border flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white/90 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV.map((n) => {
                const active = location.pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium py-2 ${active ? "text-primary" : "text-navy/80"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[#1a1040] flex items-center justify-center">
              <DnaIcon className="w-5 h-5" />
            </div>
            <div className="font-extrabold tracking-tight text-lg">OncoScan AI</div>
          </div>
          <p className="text-sm text-blue-100/70 leading-relaxed max-w-xs">
            AI-powered histopathology analysis for early breast cancer detection.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-blue-100/80">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white transition">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-4">Disclaimer</h4>
          <p className="text-sm text-blue-100/70 leading-relaxed">
            This system is intended for educational and research purposes only. It is not a medical device and must not be used as a substitute for professional medical diagnosis.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200/60">
          <div>© 2026 OncoScan AI. All rights reserved.</div>
          <div>St. Mary University — AI Course Project 2026</div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Toaster position="top-right" richColors />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
