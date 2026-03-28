"use client";

import { useRef, useState, useEffect } from "react";

const CARD_GRADIENT =
  "linear-gradient(to bottom, #7C90B3 0%, #92A3C2 50%, #A9B4D1 100%)";
const FLIP_DURATION_MS = 600;
const FLIP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const DRAG_THRESHOLD_PX = 40;
const CLICK_MAX_MOVE_PX = 10;

type NameCard3DProps = {
  flipped: boolean;
  onFlip: () => void;
  onFlipBack: () => void;
  onViewPortfolio: () => void;
  onBackToHome?: () => void;
  isExiting?: boolean;
  isOnPortfolioPage?: boolean;
};

export default function NameCard3D({
  flipped,
  onFlip,
  onFlipBack,
  onViewPortfolio,
  onBackToHome,
  isExiting = false,
  isOnPortfolioPage = false,
}: NameCard3DProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasFlippedBackThisGestureRef = useRef(false);
  const [rot, setRot] = useState({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, a: 0 });
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsHovered(false);
  }

  function onEnter() {
    setIsHovered(true);
  }

  function handleFrontClick() {
    if (isOnPortfolioPage && onBackToHome) {
      onBackToHome();
      return;
    }
    if (flipped || isFlipping || isExiting) return;
    setIsFlipping(true);
    onFlip();
  }

  function handleFlipTransitionEnd() {
    setIsFlipping(false);
  }

  function tryFlipBack() {
    if (isOnPortfolioPage && onBackToHome) {
      onBackToHome();
      return;
    }
    if (isExiting || isFlipping || !flipped) return;
    if (hasFlippedBackThisGestureRef.current) return;
    hasFlippedBackThisGestureRef.current = true;
    setIsFlipping(true);
    onFlipBack();
  }

  function handleBackMouseDown(e: React.MouseEvent) {
    if (e.button !== 0 || isExiting || isFlipping) return;
    hasFlippedBackThisGestureRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }

  function handleBackClick(e: React.MouseEvent) {
    if (isOnPortfolioPage && onBackToHome) {
      onBackToHome();
      return;
    }
    if ((e.target as HTMLElement).closest("button")) return;
    tryFlipBack();
  }

  // Global listeners for drag-to-flip-back (works when mouse leaves the card)
  useEffect(() => {
    if (!isDragging || !flipped) return;

    const onMove = (e: MouseEvent) => {
      const s = dragStartRef.current;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
        tryFlipBack();
        setIsDragging(false);
      }
    };
    const onUp = (e: MouseEvent) => {
      const s = dragStartRef.current;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (!hasFlippedBackThisGestureRef.current && Math.hypot(dx, dy) < CLICK_MAX_MOVE_PX) {
        tryFlipBack();
      }
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, flipped]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="w-[420px] md:w-[440px]"
      style={{ perspective: "1200px" }}
    >
      {/* Tilt layer — preserves 3D and applies mouse tilt */}
      <div
        className="relative w-full h-[220px] transition-transform duration-300"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rot.rx}deg) rotateY(${rot.ry}deg)`,
          transition:
            glare.a === 0
              ? "transform 400ms ease"
              : "transform 40ms linear",
        }}
      >
        {/* Flip container — rotates 180deg on Y when flipped */}
        <div
          className="relative w-full h-full rounded-3xl"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${flipped ? 180 : 0}deg)`,
            transition: `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING}`,
          }}
          onTransitionEnd={handleFlipTransitionEnd}
        >
          {/* ——— FRONT FACE ——— */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleFrontClick}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !flipped && !isFlipping) {
                e.preventDefault();
                handleFrontClick();
              }
            }}
            className="absolute inset-0 cursor-pointer rounded-3xl overflow-hidden border border-black/15 select-none outline-none focus:outline-none focus-visible:outline-none"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              background: CARD_GRADIENT,
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {glare.a > 0.01 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.a}) 0%, rgba(255,255,255,0) 55%)`,
                  mixBlendMode: "overlay",
                }}
              />
            )}
            <div
              className="relative h-full p-7 flex flex-col justify-between"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-start justify-between">
                <div className="text-white/90 text-lg font-semibold tracking-[0.2em]" />
                <div className="text-white/90 text-sm">2003</div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  WING LAI
                </h1>
                <p className="mt-2 text-white/80">AI • Data systems • Clean builds</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-white/85 text-sm">GRAD DATE 04/27</div>
                <div
                  className="relative h-9 w-14 rounded-xl bg-white/20 border border-white/25 overflow-hidden"
                  style={{ transform: "translateZ(12px)" }}
                  title="chip"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-6 h-4 border border-white/40 rounded-sm">
                      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/35" />
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/35" />
                      <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/35" />
                      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/35" />
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 4px)",
                    }}
                  />
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
          </div>

          {/* ——— BACK FACE ——— */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleBackClick}
            onMouseDown={handleBackMouseDown}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && flipped && !isFlipping && !isExiting) {
                e.preventDefault();
                tryFlipBack();
              }
            }}
            className="absolute inset-0 cursor-pointer rounded-3xl overflow-hidden border border-black/15 select-none outline-none focus:outline-none focus-visible:outline-none"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: CARD_GRADIENT,
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {glare.a > 0.01 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.a}) 0%, rgba(255,255,255,0) 55%)`,
                  mixBlendMode: "overlay",
                }}
              />
            )}
            <div
              className="relative h-full p-8 flex flex-col items-center justify-center text-center pointer-events-none"
              style={{ transform: "translateZ(30px)" }}
            >
              <p className="text-white/90 text-sm leading-relaxed max-w-[280px] mb-6">
                Welcome to my portfolio!



                Click below to find out more.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOnPortfolioPage && onBackToHome) {
                    onBackToHome();
                  } else {
                    onViewPortfolio();
                  }
                }}
                className="pointer-events-auto px-6 py-3 rounded-xl bg-white/20 border border-white/25 text-white font-medium tracking-wide hover:bg-white/30 hover:border-white/35 transition-all duration-200"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
