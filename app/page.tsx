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
              observer.unobserve(entry.target);
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
            <h2 className="text-4xl font-bold mb-6 reveal">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md reveal" style={{ transitionDelay: "0ms" }}>
                <h3 className="text-xl font-semibold mb-2">HoverTime</h3>
                <p className="text-white/70">
                  Chrome extension adding timestamps to ChatGPT messages using DOM observation.
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md reveal" style={{ transitionDelay: "100ms" }}>
                <h3 className="text-xl font-semibold mb-2">NBA ML Predictor</h3>
                <p className="text-white/70">
                  Logistic regression model predicting NBA game outcomes.
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md reveal" style={{ transitionDelay: "200ms" }}>
                <h3 className="text-xl font-semibold mb-2">WhipMatch</h3>
                <p className="text-white/70">
                  A browser-based car identification game featuring 50+ vehicles with country mode and random mode. Match car images to their model names. Built with HTML, CSS, JavaScript, CSS Grid Layout, and SweetAlert2.
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md reveal" style={{ transitionDelay: "300ms" }}>
                <h3 className="text-xl font-semibold mb-2">LotteryApp</h3>
                <p className="text-white/70">
                  A team-developed Android platform that ensures fair event entry through an automated lottery system and secure geolocation validation.
                </p>
              </div>
            </div>
          </section>

          <section id="skills" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6 reveal">Skills</h2>
            <div className="grid md:grid-cols-3 gap-8 text-white/80">
              <div className="reveal" style={{ transitionDelay: "0ms" }}>
                <h3 className="font-semibold mb-2">Languages</h3>
                <p>Python • C • JavaScript • SQL</p>
              </div>
              <div className="reveal" style={{ transitionDelay: "100ms" }}>
                <h3 className="font-semibold mb-2">AI & Data</h3>
                <p>Scikit-learn • Pandas • NumPy • Logistic Regression</p>
              </div>
              <div className="reveal" style={{ transitionDelay: "200ms" }}>
                <h3 className="font-semibold mb-2">Tools</h3>
                <p>Git • MongoDB • Chrome APIs • VS Code</p>
              </div>
            </div>
          </section>

          <section id="resume" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6 reveal">Resume</h2>
            <p className="text-white/80 reveal" style={{ transitionDelay: "80ms" }}>
              Download my resume below.
            </p>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Wing Lai Resume '26 copy.pdf";
                link.download = "Wing_Lai_Resume.pdf";
                link.click();
              }}
              className="mt-6 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              Download Resume
            </button>
          </section>

          <section id="contact" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-2 reveal">Get In Touch</h2>
            <p className="text-white/80 mb-8 reveal" style={{ transitionDelay: "80ms" }}>Open to 2026 internship opportunities.</p>

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
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4 reveal-right" style={{ transitionDelay: "150ms" }}>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1 block">Message</label>
                  <textarea
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/50 resize-none"
                  />
                </div>
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white font-semibold transition">
                  Send Message
                </button>
              </div>
            </div>
          </section>
          
        </div>
      )}
    </main>
  );
}