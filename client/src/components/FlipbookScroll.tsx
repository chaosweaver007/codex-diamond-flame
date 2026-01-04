import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

interface ScrollProps {
  id: string;
  title: string;
  image: string;
  content: string;
}

export function FlipbookScroll({ id, title, image, content }: ScrollProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        layoutId={`scroll-${id}`}
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/30 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <span className="text-xs font-mono text-primary tracking-widest uppercase mb-2 block">
            Scroll {id}
          </span>
          <h3 className="font-serif text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              layoutId={`scroll-${id}`}
              className="bg-[#0a0a0a] w-full max-w-2xl h-[80vh] rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(255,215,0,0.1)] flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-1/3 h-48 md:h-full">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="font-serif text-2xl font-bold text-white">{title}</h2>
                  <p className="text-primary text-sm mt-1">Scroll {id}</p>
                </div>
              </div>
              
              <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[url('/images/texture-altar.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <div className="relative z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="absolute top-0 right-0 p-2 hover:text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="prose prose-invert prose-p:font-serif prose-headings:font-serif max-w-none mt-8">
                    <p className="text-lg leading-relaxed text-gray-300 first-letter:text-5xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                      {content}
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
        )}
      </AnimatePresence>
    </>
  );
}
