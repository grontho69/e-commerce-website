"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const FadeIn = ({ children, delay = 0, direction = "up", duration = 0.8 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    let x = 0;
    let y = 0;
    if (direction === "up") y = 30;
    if (direction === "down") y = -30;
    if (direction === "left") x = 30;
    if (direction === "right") x = -30;

    gsap.fromTo(
      element,
      { opacity: 0, x, y },
      { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        duration, 
        delay, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        }
      }
    );
  }, [delay, direction, duration]);

  return <div ref={elementRef}>{children}</div>;
};

export const StaggerContainer = ({ children, staggerAmount = 0.1, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const items = el.children;
    
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: staggerAmount,
        delay,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      }
    );
  }, [staggerAmount, delay]);

  return <div ref={containerRef}>{children}</div>;
};
