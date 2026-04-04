"use client";
import { useEffect, useRef } from "react";

// Flat-top hexagons
const HEX_SIZE = 92;
const GAP = 3;
const WAVE_INTERVAL = 3800;
const WAVE_SPEED = 160;
const MAX_ELEV = 26;

// Flat-top: vertices at 0°, 60°, 120°, 180°, 240°, 300°
function hexVertices(cx: number, cy: number, r: number) {
  const verts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return verts;
}

// Flat-top grid layout
function hexToPixel(col: number, row: number, size: number) {
  const x = size * 1.5 * col;
  const y = size * Math.sqrt(3) * (row + 0.5 * (col & 1));
  return { x, y };
}

interface HexCell {
  col: number;
  row: number;
  x: number;
  y: number;
  elev: number;
  target: number;
  phase: number;
  freq: number;
}

export default function HexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let waveTimer: ReturnType<typeof setTimeout>;
    let cells: HexCell[][] = [];
    let rows = 0;
    let cols = 0;

    const buildGrid = () => {
      // Extra padding because canvas is rotated/scaled
      cols = Math.ceil((canvas.width * 1.5) / (HEX_SIZE * 1.5)) + 4;
      rows = Math.ceil((canvas.height * 1.5) / (HEX_SIZE * Math.sqrt(3))) + 4;
      const prev = cells;
      cells = [];
      for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
          const { x, y } = hexToPixel(c, r, HEX_SIZE);
          const old = prev[r]?.[c];
          cells[r][c] = {
            col: c, row: r, x, y,
            elev: old?.elev ?? Math.random() * 4,
            target: old?.target ?? 0,
            phase: old?.phase ?? Math.random() * Math.PI * 2,
            // Much slower idle oscillation
            freq: old?.freq ?? 0.05 + Math.random() * 0.07,
          };
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildGrid();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const getNeighbors = (r: number, c: number): HexCell[] => {
      // Flat-top neighbor offsets
      const isOdd = c & 1;
      const dirs = isOdd
        ? [[0,1],[0,-1],[1,0],[-1,0],[1,-1],[-1,-1]]
        : [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1]];
      return dirs.map(([dc,dr]) => cells[r+dr]?.[c+dc]).filter(Boolean) as HexCell[];
    };

    const triggerWave = () => {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const origin = cells[r]?.[c];
      if (!origin) return;
      const visited = new Set<HexCell>();
      let queue = [origin];
      visited.add(origin);
      let ring = 0;
      const propagate = () => {
        const next: HexCell[] = [];
        queue.forEach((cell) => {
          const strength = Math.max(0, 1 - ring * 0.10);
          if (strength > cell.target) cell.target = strength;
          getNeighbors(cell.row, cell.col).forEach((n) => {
            if (!visited.has(n)) { visited.add(n); next.push(n); }
          });
        });
        queue = next;
        ring++;
        if (ring < 11 && queue.length > 0) setTimeout(propagate, WAVE_SPEED);
      };
      propagate();
    };

    const scheduleWave = () => {
      triggerWave();
      waveTimer = setTimeout(scheduleWave, WAVE_INTERVAL + Math.random() * 1500);
    };
    scheduleWave();

    const fillFace = (pts: [number, number][], fillStyle: string | CanvasGradient) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    let last = 0;
    const draw = (ts: number) => {
      const dt = Math.min(ts - last, 50) / 1000;
      const time = ts / 1000;
      last = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const r_inner = HEX_SIZE - GAP;

      const flat: HexCell[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) flat.push(cells[r][c]);
      flat.sort((a, b) => a.y - b.y);

      for (const cell of flat) {
        // Slow idle float
        const idle = 2 + Math.sin(time * cell.freq + cell.phase) * 2.5;

        // Mouse boost
        let mBoost = 0;
        if (mouse) {
          const dx = cell.x - mouse.x;
          const dy = cell.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = HEX_SIZE * 3.5;
          if (dist < radius) {
            mBoost = Math.pow(1 - dist / radius, 2) * MAX_ELEV * 0.8;
          }
        }

        // Very slow wave target decay
        if (cell.target > 0) cell.target = Math.max(0, cell.target - dt * 0.18);
        const waveElev = cell.target * MAX_ELEV;

        // Slow elevation smoothing
        const targetElev = Math.max(idle + mBoost, waveElev + idle);
        cell.elev += (targetElev - cell.elev) * Math.min(1, dt * 1.4);

        const e = cell.elev;
        const cx = cell.x;
        const cy = cell.y;

        const top = hexVertices(cx, cy - e, r_inner);
        const base = hexVertices(cx, cy, r_inner);

        // Flat-top visible side faces: bottom-right (v0-v1), bottom (v1-v2), bottom-left (v2-v3)
        const sideFaces = [
          { a: 0, b: 1, shade: 0.78 }, // right
          { a: 1, b: 2, shade: 0.52 }, // bottom-right
          { a: 2, b: 3, shade: 0.62 }, // bottom-left
        ];

        for (const { a, b, shade } of sideFaces) {
          const pts: [number, number][] = [top[a], top[b], base[b], base[a]];
          const alpha = 0.16 + (e / MAX_ELEV) * 0.26;
          fillFace(pts, `rgba(80, 105, 160, ${alpha * shade})`);
        }

        // Top face
        ctx.beginPath();
        ctx.moveTo(top[0][0], top[0][1]);
        for (let i = 1; i < 6; i++) ctx.lineTo(top[i][0], top[i][1]);
        ctx.closePath();

        const elevFrac = e / MAX_ELEV;
        const grad = ctx.createRadialGradient(
          cx - r_inner * 0.2, cy - e - r_inner * 0.2, 0,
          cx, cy - e, r_inner
        );
        grad.addColorStop(0,   `rgba(242, 250, 255, ${0.14 + elevFrac * 0.24})`);
        grad.addColorStop(0.6, `rgba(210, 230, 255, ${0.08 + elevFrac * 0.15})`);
        grad.addColorStop(1,   `rgba(170, 205, 245, ${0.04 + elevFrac * 0.08})`);
        ctx.fillStyle = grad;

        ctx.save();
        ctx.shadowColor = `rgba(40, 60, 110, ${0.08 + elevFrac * 0.28})`;
        ctx.shadowBlur = 5 + elevFrac * 20;
        ctx.shadowOffsetX = elevFrac * 4;
        ctx.shadowOffsetY = elevFrac * 6;
        ctx.fill();
        ctx.restore();

        // Edge highlight
        ctx.beginPath();
        ctx.moveTo(top[0][0], top[0][1]);
        for (let i = 1; i < 6; i++) ctx.lineTo(top[i][0], top[i][1]);
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 + elevFrac * 0.16})`;
        ctx.lineWidth = elevFrac > 0.4 ? 1.2 : 0.7;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(waveTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        // Rotate and scale to create the angled perspective look
        top: "-20%",
        left: "-15%",
        width: "130%",
        height: "130%",
        transform: "rotate(-22deg)",
        transformOrigin: "center center",
      }}
    />
  );
}
