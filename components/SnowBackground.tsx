"use client";
import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  r: number;       // radius
  speed: number;
  drift: number;   // horizontal drift speed
  driftOffset: number; // phase for sinusoidal sway
  opacity: number;
}

export default function SnowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let flakes: Flake[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const FLAKE_COUNT = 120;

    const makeFlake = (startOffscreen = false): Flake => ({
      x: Math.random() * canvas.width,
      y: startOffscreen ? -10 : Math.random() * canvas.height,
      r: 1.2 + Math.random() * 2.8,
      speed: 0.4 + Math.random() * 0.9,
      drift: 0.08 + Math.random() * 0.18,
      driftOffset: Math.random() * Math.PI * 2,
      opacity: 0.25 + Math.random() * 0.55,
    });

    for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake(false));

    let last = 0;
    const draw = (ts: number) => {
      const dt = Math.min(ts - last, 50);
      last = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of flakes) {
        // Gentle sinusoidal horizontal sway
        f.x += Math.sin(ts * 0.0005 + f.driftOffset) * f.drift;
        f.y += f.speed * (dt / 16);

        // Wrap back to top when off screen
        if (f.y > canvas.height + 10) {
          f.x = Math.random() * canvas.width;
          f.y = -10;
          f.r = 1.2 + Math.random() * 2.8;
          f.speed = 0.4 + Math.random() * 0.9;
          f.opacity = 0.25 + Math.random() * 0.55;
        }

        // Draw flake as a soft circle
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        grad.addColorStop(0, `rgba(240, 248, 255, ${f.opacity})`);
        grad.addColorStop(1, `rgba(210, 230, 255, 0)`);

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
