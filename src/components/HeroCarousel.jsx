"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import Container from "./Container";
import gsap from "gsap";

const slides = [
  {
    id: 1,
    title: "Vivid Essence.",
    subtitle: "Redefining the silhouettes of modern craftsmanship. Bold, intentional, and undeniably unique.",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000&auto=format&fit=crop",
    link: "/products",
    badge: "New Season Ingress"
  },
  {
    id: 2,
    title: "Signature Soul.",
    subtitle: "The bridge between tradition and the future. Our core collection reimagined for your journey.",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2000&auto=format&fit=crop",
    link: "/products?filter=exclusive",
    badge: "Exclusive Release"
  },
  {
    id: 3,
    title: "Urban Archive.",
    subtitle: "Practical utility meets high-end aesthetic. The definitive streetwear for the modern explorer.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
    link: "/products?search=drop",
    badge: "Limited Drop"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { y: 100, opacity: 0, scale: 0.9, skewY: 10 },
        { y: 0, opacity: 1, scale: 1, skewY: 0, duration: 1.2, ease: "power4.out" }
      );
      gsap.fromTo(imageRef.current,
        { scale: 1.2 },
        { scale: 1, duration: 2, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [current]);

  return (
    <section ref={containerRef} className="relative h-[90vh] w-full overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover brightness-50 contrast-[1.1]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={`badge-${current}`}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
              {slides[current].badge}
            </span>
          </motion.div>

          <div ref={titleRef}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] uppercase">
               <span className="block text-white">{slides[current].title.split(" ")[0]}</span>
               <span className="block text-primary">{slides[current].title.split(" ")[1]}</span>
            </h1>

            <p className="text-sm md:text-xl text-white/80 mb-8 md:mb-12 max-w-2xl font-medium leading-relaxed">
              {slides[current].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link href={slides[current].link} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-10 h-14 text-sm font-bold uppercase tracking-widest bg-primary text-black hover:bg-white transition-all">
                  Explore Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button onClick={handlePrev} className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-sm border border-white/10">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex space-x-1.5">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? "bg-primary w-6" : "bg-white/20 w-2"}`}
                    />
                  ))}
                </div>
                <button onClick={handleNext} className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-sm border border-white/10">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-10 left-12 flex items-center gap-4 opacity-70">
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/60">Explore Archive</span>
      </div>
    </section>
  );
}

