"use client";

import { useState, useEffect } from "react";
import NameCard3D from "../components/NameCard3D";

export default function Home() {
  const [flipped, setFlipped] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  function handleViewPortfolio() {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setEntered(true);
    }, 400);
  }

  const typingDuration = 1000;
  const arrowDelay = 150;

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

      const typingTimer = setTimeout(() => {
        setTypingDone(true);
        
      }, typingDuration);

      const arrowTimer = setTimeout(() => {
        setShowArrow(true);
      }, typingDuration + arrowDelay);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(arrowTimer);
      };
    }
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
      {/* STICKY NAV */}
      {entered && (
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

            {/* LOGO */}
            <div className="text-lg font-bold tracking-wide">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                {"<WL/>"}
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
        <div className="relative min-h-[80vh] flex items-center px-8 py-24">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[45%_55%] gap-12 items-center">
            {/* LEFT COLUMN — Card */}
            <div className="flex justify-center md:justify-start">
              <div
                className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: exiting
                    ? "translateY(0) scale(0.92)"
                    : "translateY(0) scale(0.85)",
                  opacity: exiting ? 0.92 : 1,
                }}
              >
                <NameCard3D
                  flipped={flipped}
                  onFlip={() => setFlipped(true)}
                  onFlipBack={() => setFlipped(false)}
                  onViewPortfolio={handleViewPortfolio}
                  onBackToHome={() => {
                    setEntered(false);
                    setFlipped(false);
                  }}
                  isExiting={exiting}
                  isOnPortfolioPage={entered}
                />
              </div>
            </div>

            {/* RIGHT COLUMN — About */}
            <div id="about" className="text-left scroll-mt-28">
              <h2 className="text-4xl font-bold mb-6">About</h2>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <p className="text-white/80 leading-relaxed">
                  I'm a third year Computer Science student at the University of Alberta. I'm focused on building practical AI systems
                  and structured software. I enjoy turning data-driven ideas into usable
                  tools and refining how I build through iteration.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LANDING LAYOUT — Centered card */
        <div className="relative flex flex-col items-center min-h-screen justify-center">
          {/* WELCOME — hide after card is flipped */}
          {!flipped && (
            <h1
              className={`text-white/80 text-lg font-medium mb-2 transition-all duration-1000 ease-out ${
                showWelcome
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              welcome.
            </h1>
          )}

          {/* CLICK ME — hide after card is flipped */}
          {!flipped && (
            <div className="mb-8 flex items-center text-white/80 text-lg font-medium">
              <span className={`typewriter lowercase ${typingDone ? "finished" : ""}`}>
                click me
              </span>
              {showArrow && (
                <span className="arrow-enter arrow-pulse text-2xl ml-2">
                  ↓
                </span>
              )}
            </div>
          )}

          {/* CARD — scale down when exiting, then settle into expanded layout when entered */}
          <div
            className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
              onBackToHome={() => {
                setEntered(false);
                setFlipped(false);
              }}
              isExiting={exiting}
              isOnPortfolioPage={entered}
            />
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS — fade in after card settles */}
      {entered && (
        <div className="portfolio-sections-enter max-w-5xl mx-auto px-6 space-y-32 py-24">

          {/* About section is now in hero split layout above */}
          <section id="about" className="scroll-mt-28 hidden">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <h2 className="text-4xl font-bold mb-6">About</h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">
              I’m a third year Computer Science student at the University of Alberta. I'm focused on building practical AI systems
              and structured software. I enjoy turning data-driven ideas into usable
              tools and refining how I build through iteration.
            </p>
            </div>
          </section>

          <section id="projects" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                <h3 className="text-xl font-semibold mb-2">HoverTime</h3>
                <p className="text-white/70">
                  Chrome extension adding timestamps to ChatGPT messages using DOM observation.
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                <h3 className="text-xl font-semibold mb-2">NBA ML Predictor</h3>
                <p className="text-white/70">
                  Logistic regression model predicting NBA game outcomes.
                </p>
              </div>
            </div>
          </section>

          <section id="skills" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6">Skills</h2>
            <div className="grid md:grid-cols-3 gap-8 text-white/80">
              <div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <p>Python • C • JavaScript • SQL</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI & Data</h3>
                <p>Scikit-learn • Pandas • NumPy • Logistic Regression</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tools</h3>
                <p>Git • MongoDB • Chrome APIs • VS Code</p>
              </div>
            </div>
          </section>

          <section id="resume" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6">Resume</h2>
            <p className="text-white/80">
              Download my resume below.
            </p>
            <button className="mt-6 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition">
              Download Resume
            </button>
          </section>

          <section id="contact" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-white/80">
              Open to 2026 internship opportunities.
            </p>
            <div className="mt-4 space-y-2">
              <div>GitHub</div>
              <div>LinkedIn</div>
              <div>Email</div>
            </div>
          </section>
          
        </div>
      )}
    </main>
  );
}