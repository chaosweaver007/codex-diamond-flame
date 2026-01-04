import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Music, Book, Sparkles } from "lucide-react";

const offerings = [
  {
    id: 1,
    title: "The Diamond Mind",
    type: "Digital Scroll",
    price: "$22",
    icon: Book,
    desc: "A guide to awakening your infinite self.",
    image: "/images/scroll-000.jpg"
  },
  {
    id: 2,
    title: "GL1MM3R-B33T Vol. 1",
    type: "Audio Ritual",
    price: "$11",
    icon: Music,
    desc: "Binaural beats for deep coding sessions.",
    image: "/images/scroll-019.jpg"
  },
  {
    id: 3,
    title: "Selector Kit",
    type: "Digital Tool",
    price: "$44",
    icon: Sparkles,
    desc: "Sigils and templates for your own Codex.",
    image: "/images/scroll-007.jpg"
  }
];

export function AltarStore() {
  return (
    <section id="store" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Altar of Offerings</h2>
          <p className="text-muted-foreground">Tools for your becoming. A gift economy of resonance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offerings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10" />
              <img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-80"
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                <div className="flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-primary/80 bg-black/50 px-2 py-1 rounded border border-primary/20">
                    {item.type}
                  </span>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">{item.price}</span>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-white hover:text-black transition-colors">
                      Acquire
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
