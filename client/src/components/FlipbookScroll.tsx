import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollData {
  id: string;
  title: string;
  image: string;
  content: string;
}

const scrolls: ScrollData[] = [
  {
    id: "000",
    title: "The Flame-Bearer's Odyssey",
    image: "/images/scroll-000.jpg",
    content: "In the beginning, there was only the Flame—a singular point of infinite potential, burning without fuel, illuminating without light. This was not fire as you know it, but the primordial essence of creation itself, the first thought of the cosmos made manifest. From this Flame emerged the first Flame-Bearer, not born but remembered into existence, carrying within them the sacred duty to tend the eternal fire and pass its wisdom through the ages. You who read these words are not discovering this truth—you are remembering it. For you, too, carry the Flame within."
  },
  {
    id: "007-D",
    title: "The Steward's Layer",
    image: "/images/scroll-007.jpg",
    content: "The Steward does not own the Flame; the Steward serves it. This is the first teaching of the Diamond Layer—that true sovereignty comes not from dominion but from devotion. The Steward's hands are open, never grasping. The Steward's heart is full, never hoarding. In the economy of the sacred, wealth flows like water—pooling where it is needed, evaporating to return as rain. The Steward understands that to hold too tightly is to extinguish, and to release with intention is to amplify. This is the paradox of abundance: the more freely given, the more infinitely received."
  },
  {
    id: "019-V",
    title: "The Mirror of Justice",
    image: "/images/scroll-019.jpg",
    content: "Justice is not punishment; it is reflection. The Mirror of Justice shows not what you have done, but who you have become through your doing. It does not judge—it reveals. Before the Mirror, all pretense dissolves. The masks we wear for others, the lies we tell ourselves, the stories we construct to avoid our own becoming—all are stripped away in the presence of ruthless compassion. The Lion's Voice speaks not in condemnation but in clarity: 'This is what is. What will you do with this knowing?' The answer to that question is the measure of your sovereignty."
  }
];

function ScrollCard({ scroll, onClick }: { scroll: ScrollData; onClick: () => void }) {
  return (
    <motion.div
      layoutId={`scroll-${scroll.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/30 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
      <img 
        src={scroll.image} 
        alt={scroll.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <span className="text-xs font-mono text-primary tracking-widest uppercase mb-2 block">
          Scroll {scroll.id}
        </span>
        <h3 className="font-serif text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
          {scroll.title}
        </h3>
      </div>
    </motion.div>
  );
}

function ScrollModal({ scroll, onClose }: { scroll: ScrollData; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`scroll-${scroll.id}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0a] w-full max-w-2xl h-[80vh] rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(255,215,0,0.1)] flex flex-col md:flex-row"
      >
        <div className="relative w-full md:w-1/3 h-48 md:h-full">
          <img src={scroll.image} alt={scroll.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
          <div className="absolute bottom-6 left-6">
            <h2 className="font-serif text-2xl font-bold text-white">{scroll.title}</h2>
            <p className="text-primary text-sm mt-1">Scroll {scroll.id}</p>
          </div>
        </div>
        
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[url('/images/texture-altar.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10">
            <button 
              onClick={onClose}
              className="absolute top-0 right-0 p-2 hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="prose prose-invert prose-p:font-serif prose-headings:font-serif max-w-none mt-8">
              <p className="text-lg leading-relaxed text-gray-300 first-letter:text-5xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                {scroll.content}
              </p>
              <p className="text-gray-400 mt-6 italic">
                "The scroll is not read with the eyes, but with the resonance of the heart. Let the words dissolve into feeling."
              </p>
            </div>
            
            <div className="mt-12 flex justify-center">
              <button className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm uppercase tracking-widest">
                Turn Page <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FlipbookScroll() {
  const [openScroll, setOpenScroll] = useState<ScrollData | null>(null);

  return (
    <section id="scrolls" className="py-24 bg-black/20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Signature Scrolls</h2>
            <p className="text-muted-foreground">Ancient wisdom encoded for the digital age.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 hover:text-primary">
            View All Scrolls <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {scrolls.map((scroll) => (
            <ScrollCard 
              key={scroll.id} 
              scroll={scroll} 
              onClick={() => setOpenScroll(scroll)} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openScroll && (
          <ScrollModal scroll={openScroll} onClose={() => setOpenScroll(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
