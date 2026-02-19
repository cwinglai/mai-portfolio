"use client";

import { useRef, useState } from "react";

export default function NameCard3D() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [rot, setRot] = useState({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, a: 0 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const maxTilt = 13;
    const ry = (px - 0.5) * (maxTilt * 2);
    const rx = -(py - 0.5) * (maxTilt * 2);

    setRot({ rx, ry });
    setGlare({ x: px * 100, y: py * 100, a: 0.55 });
  }

  function onLeave() {
    setRot({ rx: 0, ry: 0 });
    setGlare({ x: 50, y: 50, a: 0 });
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-[420px] md:w-[440px]"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative h-[220px] rounded-3xl overflow-hidden border border-white/12 shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rot.rx}deg) rotateY(${rot.ry}deg)`,
          transition:
            glare.a === 0
              ? "transform 400ms ease"
              : "transform 40ms linear",
          background:
            "linear-gradient(to bottom, #7C90B3 0%, #92A3C2 50%, #A9B4D1 100%)",
        }}
      >
        {/* Soft vignette */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.a}) 0%, rgba(255,255,255,0) 55%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Card Content */}
        <div
          className="relative h-full p-7 flex flex-col justify-between"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Top Row */}
          <div className="flex items-start justify-between">
            <div className="text-white/90 text-lg font-semibold tracking-[0.2em]">
              {/* intentionally left minimal */}
            </div>
            <div className="text-white/90 text-sm">2003</div>
          </div>

          {/* Name + Tagline */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              WING LAI
            </h1>
            <p className="mt-2 text-white/80">
              AI • Data systems • Clean builds
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between">
            <div className="text-white/85 text-sm">
              GRAD DATE 04/27
            </div>

            <div
  className="relative h-9 w-14 rounded-xl bg-white/20 border border-white/25 overflow-hidden"
  style={{ transform: "translateZ(12px)" }}
  title="chip"
>
  {/* Center block */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-6 h-4 border border-white/40 rounded-sm">
      
      {/* Top branch */}
      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/35" />
      
      {/* Bottom branch */}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/35" />

      {/* Left branch */}
      <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/35" />

      {/* Right branch */}
      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/35" />
    </div>
  </div>

  {/* Subtle horizontal brushed texture */}
  <div
    className="absolute inset-0 opacity-15"
    style={{
      background:
        "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 4px)",
    }}
  />

  {/* Metallic shine */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 70%)",
    }}
  />
</div>
          </div>
        </div>

        {/* Subtle texture overlay */}
      </div>
    </div>
  );
}