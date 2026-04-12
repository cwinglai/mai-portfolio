"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NameCard3D from "../components/NameCard3D";
import SnowBackground from "../components/SnowBackground";
import CloudBackground from "../components/CloudBackground";

// Replace with your Web3Forms access key from https://web3forms.com
const WEB3FORMS_ACCESS_KEY = "04d6a1b1-1fc7-42a1-a6d4-206390403640";

export default function Home() {
  const [flipped, setFlipped] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<"none" | "cover" | "uncover">("none");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...formData }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  function handleViewPortfolio() {
    setTransitionPhase("cover");
    setTimeout(() => {
      setEntered(true);
      setExiting(false);
      setTransitionPhase("uncover");
    }, 680);
    setTimeout(() => setTransitionPhase("none"), 1300);
  }

  function handleBackToLanding() {
    setTransitionPhase("cover");
    setTimeout(() => {
      setEntered(false);
      setFlipped(false);
      setTransitionPhase("uncover");
    }, 680);
    setTimeout(() => setTransitionPhase("none"), 1300);
  }

  const typingDuration = 1000;
  const arrowDelay = 150;

  // Lock scroll on landing screen
  useEffect(() => {
    document.body.style.overflow = entered ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [entered]);

  // Welcome fade-in on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Typing + arrow logic
  useEffect(() => {
    if (!entered) {
      setTypingDone(false);
      setShowArrow(false);
      const typingTimer = setTimeout(() => setTypingDone(true), typingDuration);
      const arrowTimer = setTimeout(() => setShowArrow(true), typingDuration + arrowDelay);
      return () => {
        clearTimeout(typingTimer);
        clearTimeout(arrowTimer);
      };
    }
  }, [entered]);


  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    if (!entered) return;
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            } else {
              entry.target.classList.remove("visible");
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 800);
    return () => clearTimeout(timer);
  }, [entered]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main
      className="relative min-h-screen text-white"
      style={{
        background:
          "linear-gradient(to bottom, #7C90B3 0%, #92A3C2 50%, #A9B4D1 100%)",
      }}
    >
      {/* CLOUD BACKGROUND — portfolio view only */}
      {entered && <CloudBackground />}

      {/* GLASS PORTAL TRANSITION OVERLAY */}
      {transitionPhase !== "none" && (
        <div
          className="fixed inset-0 z-[200] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(175,195,225,0.82) 0%, rgba(140,163,196,0.90) 50%, rgba(120,145,182,0.95) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            animation:
              transitionPhase === "cover"
                ? "portalCover 0.68s cubic-bezier(0.76, 0, 0.24, 1) forwards"
                : "portalUncover 0.58s cubic-bezier(0.76, 0, 0.24, 1) forwards",
          }}
        />
      )}

      {/* STICKY NAV */}
      {entered && (
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

            {/* LOGO */}
            <div className="text-lg font-bold tracking-wide">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent" style={{ fontFamily: "Plank, sans-serif" }}>
                {"wing"}
              </span>
            </div>

            {/* NAV LINKS */}
            <div className="flex gap-12 text-sm tracking-widest uppercase text-white/80">
              <button
                onClick={() => scrollTo("about")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                About
              </button>
              <button
                onClick={() => scrollTo("projects")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                Projects
              </button>
              <button
                onClick={() => scrollTo("skills")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                Skills
              </button>
              <button
                onClick={() => scrollTo("experience")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                Experience
              </button>
              <button
                onClick={() => scrollTo("education")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                Education
              </button>
              <button
                onClick={() => scrollTo("resume")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
              Resume
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="relative pb-1 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
              >
                Contact
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HERO SECTION */}
      {entered ? (
        /* SPLIT LAYOUT — Desktop: 2 columns, Mobile: Stacked */
        <div className="relative z-10 min-h-[80vh] flex items-center px-8 py-24">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[45%_55%] gap-12 items-center">
            {/* LEFT COLUMN — Hero name */}
            <div className="flex justify-center md:justify-start reveal-left">
              <div className="relative inline-block">
                <div
                  onClick={handleBackToLanding}
                  className="hero-name"
                  style={{
                    fontFamily: "Plank, cursive",
                    fontWeight: 400,
                    fontSize: "clamp(4rem, 9vw, 7.5rem)",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(220,235,255,0.90) 50%, rgba(185,210,250,0.80) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px rgba(200,225,255,0.75)) drop-shadow(0 0 60px rgba(170,205,255,0.45)) drop-shadow(0 0 100px rgba(150,190,255,0.25)) drop-shadow(0 2px 8px rgba(60,80,140,0.3))",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Wing<br />Lai
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — About */}
            <div id="about" className="text-left scroll-mt-28 reveal-right">
              <h2 className="text-4xl font-bold mb-6 font-space">About</h2>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <p className="text-white/80 leading-relaxed">
                  I'm a third year Computer Science major with a Psychology minor at the University of Alberta. Two fields that are really about the same thing: understanding how systems think. Most of what I do involves a lot of tweaking, adjusting, and trying again until it clicks. That being said, I enjoy building with AI and working with data, especially when the end result is something people can actually use.

Outside of school, you can find me on the golf course, where the process is pretty much the same, just with more fresh air.




                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LANDING LAYOUT — Centered card */
        <div className="relative flex flex-col items-center min-h-screen justify-center">
          <SnowBackground />
          {/* Fade overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 1%, #8A9ABF 75%, #92A3C2 100%)",
            }}
          />
          {/* WELCOME */}
          {!flipped && (
            <h1
              className={`text-white/80 text-lg font-medium mb-2 transition-all duration-1000 ease-out z-10 ${
                showWelcome ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              welcome.
            </h1>
          )}

          {/* CLICK ME */}
          {!flipped && (
            <div className="mb-8 flex items-center text-white/80 text-lg font-medium z-10">
              <span className={`typewriter lowercase ${typingDone ? "finished" : ""}`}>
                click me
              </span>
              {showArrow && (
                <span className="arrow-enter arrow-pulse text-2xl ml-2">↓</span>
              )}
            </div>
          )}

          {/* CARD */}
          <div
            className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-10"
            style={{
              transform: exiting
                ? "translateY(0) scale(0.92)"
                : "translateY(0px) scale(1.1)",
              opacity: exiting ? 0.92 : 1,
            }}
          >
            <NameCard3D
              flipped={flipped}
              onFlip={() => setFlipped(true)}
              onFlipBack={() => setFlipped(false)}
              onViewPortfolio={handleViewPortfolio}
              onBackToHome={handleBackToLanding}
              isExiting={exiting}
              isOnPortfolioPage={entered}
            />
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS — fade in after card settles */}
      {entered && (
        <div className="portfolio-sections-enter max-w-5xl mx-auto px-6 space-y-32 py-24 relative z-10">

          {/* About section is now in hero split layout above */}
          <section id="about" className="scroll-mt-28 hidden">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <h2 className="text-4xl font-bold mb-6 font-space">About</h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">
              I’m a third year Computer Science student at the University of Alberta. I'm focused on building practical AI systems
              and structured software. I enjoy turning data-driven ideas into usable
              tools and refining how I build through iteration.
            </p>
            </div>
          </section>

          <section id="projects" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6 reveal font-space text-center">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">

              {/* HoverTime */}
              <div className="reveal" style={{ transitionDelay: "0ms" }}>
                <div
                  className="group flex flex-col h-full bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:border-white/25 transition-all duration-300 ease-out overflow-hidden"
                >
                  <a href="https://github.com/cwinglai/hovertime-chatgpt-extension" target="_blank" rel="noopener noreferrer" className="relative w-full h-40 shrink-0 block">
                    <Image src="/images/hovertime.png" alt="HoverTime" fill className="object-cover object-top" />
                  </a>
                  <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">HoverTime - Chrome Extension</h3>
                    <div className="flex items-center gap-2">
                      <a href="https://github.com/cwinglai/hovertime-chatgpt-extension" target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-white/40 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                      <a href="https://chromewebstore.google.com/detail/chatgpt-hovertime/kklkjniajpfcokigjhcolcbebminjfno" target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Image src="/images/chrome.png" alt="Chrome Web Store" width={20} height={20} className="opacity-60 hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                    Chrome extension that adds exact timestamps to ChatGPT messages via fetch interception and DOM observation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "Chrome API", "DOM", "Fetch API / Network Interception", "MutationObserver", "localStorage"].map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/65">{t}</span>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

              {/* NBA ML Predictor */}
              <div className="reveal" style={{ transitionDelay: "100ms" }}>
                <a
                  href="https://github.com/cwinglai/NBA-Game-Outcome-Predictor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:border-white/25 transition-all duration-300 ease-out overflow-hidden"
                >
                  <div className="relative w-full h-40 shrink-0">
                    <Image src="/images/nba-outcome.png" alt="NBA ML Predictor" fill className="object-cover object-top" />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">NBA Machine Learning Predictor</h3>
                    <svg className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                    End-to-end machine learning pipeline that predicts NBA game outcomes using logistic regression. Covers data 
   ingestion, feature engineering from historical stats, model training, and data visualization.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Pandas/NumPy", "Scikit-learn", "Tableau"].map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/65">{t}</span>
                    ))}
                  </div>
                  </div>
                </a>
              </div>

              {/* WhipMatch */}
              <div className="reveal" style={{ transitionDelay: "200ms" }}>
                <div
                  className="group flex flex-col h-full bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:border-white/25 transition-all duration-300 ease-out overflow-hidden"
                >
                  <a href="https://github.com/cwinglai/WhipMatch" target="_blank" rel="noopener noreferrer" className="relative w-full h-40 shrink-0 block">
                    <Image src="/images/whipmatch.png" alt="WhipMatch" fill className="object-cover" />
                  </a>
                  <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">WhipMatch - Car Matching Game</h3>
                    <div className="flex items-center gap-2">
                      <a href="https://github.com/cwinglai/WhipMatch" target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-white/40 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                      <a href="https://cwinglai.github.io/Whipmatch/" target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-white/40 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                    Browser-based car identification game built with vanilla HTML, CSS, and JavaScript. Spans 54 vehicles across 5
   countries in Country and Random modes. Includes live score tracking and  DOM rendering.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["HTML", "CSS", "JavaScript", "DOM Manipulation", "State Management"].map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/65">{t}</span>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

              {/* LotteryApp */}
              <div className="reveal" style={{ transitionDelay: "300ms" }}>
                <a
                  href="https://github.com/CMPUT301W26avatar/avatar-state"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:border-white/25 transition-all duration-300 ease-out overflow-hidden"
                >
                  <div className="relative w-full h-40 shrink-0">
                    <Image src="/images/lotteryapp.jpg" alt="LotteryApp" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">Lottery App</h3>
                    <svg className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                    Team-developed Android platform ensuring fair event entry through an automated lottery system and secure geolocation validation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Android", "Java", "Firebase (Real-time Database)", "Interactive QR-Codes", "Geospatial Services"].map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/65">{t}</span>
                    ))}
                  </div>
                  </div>
                </a>
              </div>

            </div>
          </section>

          <section id="skills" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-8 reveal font-space text-center">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: "Languages", delay: "0ms",
                  icons: [
                    { name: "Python",     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",                    glow: "#FFD43B" },
                    { name: "SQL",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg", glow: "#F29111" },
                    { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",             glow: "#F7DF1E" },
                    { name: "Java",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",                        glow: "#ED8B00" },
                    { name: "C",          src: "https://cdn.simpleicons.org/c/ffffff",                                                                        glow: "#A8B9CC" },
                    { name: "HTML",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",                       glow: "#E34F26" },
                    { name: "CSS",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",                         glow: "#1572B6" },
                  ],
                },
                {
                  label: "Data & ML", delay: "80ms",
                  icons: [
                    { name: "Pandas",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",           glow: "#150458" },
                    { name: "NumPy",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg",             glow: "#4DABCF" },
                    { name: "Scikit-learn", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg", glow: "#F7931E" },
                    { name: "Matplotlib",   src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg",   glow: "#11557C" },
                    { name: "Firestore",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",       glow: "#FFCA28" },
                    { name: "Tableau",      src: "/images/tableau.png",                                                                            glow: "#2166b0" },
                  ],
                },
                {
                  label: "Tools & Platforms", delay: "160ms",
                  icons: [
                    { name: "Git",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",         glow: "#F05032" },
                    { name: "MongoDB",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", glow: "#47A248" },
                    { name: "VS Code",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",   glow: "#007ACC" },
                    { name: "Excel",      src: "/images/excel.png",                                                                              glow: "#217346" },
                    { name: "Android",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg", glow: "#3DDC84" },
                    { name: "Swift",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",     glow: "#FA7343" },
                    { name: "DevTools",   src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg",   glow: "#4285F4" },
                  ],
                },
                {
                  label: "Frameworks", delay: "240ms",
                  icons: [
                    { name: "React",   src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",   glow: "#61DAFB" },
                    { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", glow: "#FFFFFF" },
                    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", glow: "#539E43" },
                  ],
                },
              ].map(({ label, delay, icons }) => (
                <div
                  key={label}
                  className="reveal bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md p-6"
                  style={{ transitionDelay: delay }}
                >
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-5">{label}</h3>
                  <div className="flex flex-wrap gap-5">
                    {icons.map(({ name, src, glow }) => (
                      <div key={name} className="group flex flex-col items-center gap-2 cursor-default">
                        <div
                          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:-translate-y-1"
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px 3px ${glow}55, 0 4px 12px rgba(0,0,0,0.2)`;
                            (e.currentTarget as HTMLDivElement).style.borderColor = `${glow}66`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                            (e.currentTarget as HTMLDivElement).style.borderColor = "";
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={name} width={28} height={28} />
                        </div>
                        <span className="text-xs text-white/55 group-hover:text-white/90 transition-colors duration-200">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="experience" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-12 reveal font-space text-center">Experience</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2 hidden md:block" />

              {/* Kinjo — right */}
              <div className="relative grid md:grid-cols-2 gap-8 mb-16 reveal">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/70 border-2 border-white/90 hidden md:block z-10" />
                <div className="flex md:justify-end justify-start items-center md:pr-12">
                  <span className="px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-sm text-white/80 backdrop-blur-sm whitespace-nowrap">
                    May 2022 – July 2025
                  </span>
                </div>
                <div className="md:pl-12">
                  <div className="bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md p-6">
                    <h3 className="text-lg font-semibold mb-1">Kinjo Sushi &amp; Grill</h3>
                    <p className="text-white/70 text-sm mb-1">Server</p>
                    <p className="text-white/50 text-xs">Calgary, AB &amp; Edmonton, AB</p>
                  </div>
                </div>
              </div>

              {/* CASA Mental Health — left */}
              <div className="relative grid md:grid-cols-2 gap-8 reveal">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/70 border-2 border-white/90 hidden md:block z-10" />
                <div className="md:pr-12 order-2 md:order-1">
                  <div className="bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md p-6">
                    <h3 className="text-lg font-semibold mb-1">CASA Mental Health</h3>
                    <p className="text-white/70 text-sm mb-1">Administrative Assistant</p>
                    <p className="text-white/50 text-xs">Edmonton, AB</p>
                  </div>
                </div>
                <div className="flex md:justify-start justify-start items-center md:pl-12 order-1 md:order-2">
                  <span className="px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-sm text-white/80 backdrop-blur-sm whitespace-nowrap">
                    2023 – 2024
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section id="education" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6 reveal font-space text-center">Education</h2>
            <div className="reveal bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md p-8" style={{ transitionDelay: "80ms" }}>
              <div className="flex items-start gap-5 mb-6">
                <Image src="/images/ualberta.png" alt="University of Alberta" width={52} height={52} className="shrink-0 mt-1 opacity-90" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                    <h3 className="text-xl font-semibold">University of Alberta</h3>
                    <span className="text-white/60 text-sm">2024 &ndash; Expected April 2027</span>
                  </div>
                  <p className="text-white/80 mb-1">Bachelor of Science in Computer Science</p>
                  <p className="text-white/60 text-sm">Minor in Psychology &middot; Edmonton, AB</p>
                </div>
              </div>
              <h4 className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-3">Relevant Coursework</h4>
              <div className="flex flex-wrap gap-2">
                {["Data Structures & Algorithms", "Machine Learning", "Software Engineering", "File & Database Management", "Reinforcement Learning"].map((c) => (
                  <span key={c} className="px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/65">{c}</span>
                ))}
              </div>
            </div>
          </section>

          <section id="resume" className="scroll-mt-28 flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold mb-6 reveal font-space text-center">Resume</h2>
            <p className="text-white/80 reveal" style={{ transitionDelay: "80ms" }}>
              
            </p>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Wing Lai final Resume '26.pdf";
                link.download = "Wing_Lai_Resume.pdf";
                link.click();
              }}
              className="mt-6 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
            >
              Download CV
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
          </section>

          <section id="contact" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-2 reveal font-space text-center">Get In Touch</h2>
            <p className="text-white/80 mb-8 reveal text-center" style={{ transitionDelay: "80ms" }}>Open to 2026 internship opportunities.</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Contact Info */}
              <div className="space-y-6 reveal-left" style={{ transitionDelay: "150ms" }}>
                {/* Email */}
                <a href="mailto:chungwing101@gmail.com" className="flex items-center gap-4 hover:opacity-80 transition">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium">chungwing101@gmail.com</p>
                  </div>
                </a>

                {/* GitHub */}
                <a href="https://github.com/cwinglai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-80 transition">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">GitHub</p>
                    <p className="text-white font-medium">github.com/cwinglai</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/cwinglai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-80 transition">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">LinkedIn</p>
                    <p className="text-white font-medium">linkedin.com/in/cwinglai</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Location</p>
                    <p className="text-white font-medium">Calgary, Alberta</p>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <form onSubmit={handleFormSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4 reveal-right" style={{ transitionDelay: "150ms" }}>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Message</label>
                  <textarea
                    name="message"
                    required
                    placeholder="Tell me about your project..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === "sending" ? "Sending..." : "Send Message"}
                </button>
                {formStatus === "success" && (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <svg className="checkmark-svg w-14 h-14" viewBox="0 0 52 52" fill="none">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" stroke="rgba(134,239,172,0.9)" strokeWidth="2" fill="none" />
                      <polyline className="checkmark-tick" points="14,27 22,35 38,17" stroke="rgba(134,239,172,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <p className="text-green-300 text-sm">Message sent successfully!</p>
                  </div>
                )}
                {formStatus === "error" && (
                  <p className="text-red-300 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          </section>
          
        </div>
      )}
    </main>
  );
}