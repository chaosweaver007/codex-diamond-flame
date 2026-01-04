import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Flame, BookOpen, User, Sparkles, X } from "lucide-react";

const navItems = [
  { id: "flame", icon: Flame, label: "Flame", href: "#hero" },
  { id: "codex", icon: BookOpen, label: "Codex", href: "#scrolls" },
  { id: "mirror", icon: User, label: "Mirror", href: "#tiers" },
  { id: "ai", icon: Sparkles, label: "Guide", href: "#guide" },
];

const handleZoomNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (!target) return;

  // Fractal Zoom Effect
  document.body.style.transition = "transform 0.8s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease";
  document.body.style.transform = "scale(1.5)";
  document.body.style.opacity = "0";

  setTimeout(() => {
    target.scrollIntoView({ behavior: "auto" });
    document.body.style.transform = "scale(0.8)";
    
    setTimeout(() => {
      document.body.style.transform = "scale(1)";
      document.body.style.opacity = "1";
    }, 50);
  }, 800);
};

export function RecursiveNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          >
            {navItems.map((item, index) => {
              const angle = (index / (navItems.length - 1)) * (Math.PI / 2) + Math.PI;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-background/80 backdrop-blur-md border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors pointer-events-auto shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleZoomNav(e, item.href);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="sr-only">{item.label}</span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-background/50 backdrop-blur-md border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-shadow"
      >
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-1 rounded-full border border-primary/10 animate-[spin_15s_linear_infinite_reverse]" />
        {isOpen ? <X className="w-6 h-6" /> : <img src="/images/sigil-recursive-ring.png" alt="Nav" className="w-10 h-10 opacity-80" />}
      </motion.button>
    </div>
  );
}
