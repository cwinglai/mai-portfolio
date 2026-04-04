"use client";

export default function CloudBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Cloud 1 — large, top-left */}
      <div style={{
        position: "absolute",
        width: "750px",
        height: "450px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)",
        filter: "blur(55px)",
        top: "-10%",
        left: "-10%",
        animation: "cloudDrift1 22s ease-in-out infinite alternate",
      }} />

      {/* Cloud 2 — top-right */}
      <div style={{
        position: "absolute",
        width: "560px",
        height: "360px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 70%)",
        filter: "blur(50px)",
        top: "5%",
        right: "-6%",
        animation: "cloudDrift2 28s ease-in-out infinite alternate",
      }} />

      {/* Cloud 3 — center mass */}
      <div style={{
        position: "absolute",
        width: "700px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 55%, transparent 72%)",
        filter: "blur(70px)",
        top: "30%",
        left: "22%",
        animation: "cloudDrift3 34s ease-in-out infinite alternate",
      }} />

      {/* Cloud 4 — bottom-right */}
      <div style={{
        position: "absolute",
        width: "500px",
        height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)",
        filter: "blur(48px)",
        bottom: "8%",
        right: "4%",
        animation: "cloudDrift4 25s ease-in-out infinite alternate",
      }} />

      {/* Cloud 5 — bottom-left */}
      <div style={{
        position: "absolute",
        width: "420px",
        height: "280px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 50%, transparent 70%)",
        filter: "blur(45px)",
        bottom: "4%",
        left: "6%",
        animation: "cloudDrift5 19s ease-in-out infinite alternate",
      }} />
    </div>
  );
}
