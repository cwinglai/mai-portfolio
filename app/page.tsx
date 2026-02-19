"use client";

import { useState, useEffect } from "react";
import NameCard3D from "../components/NameCard3D";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
              <button onClick={() => scrollTo("about")} className="hover:text-white transition">
                About
              </button>
              <button onClick={() => scrollTo("projects")} className="hover:text-white transition">
                Projects
              </button>
              <button onClick={() => scrollTo("skills")} className="hover:text-white transition">
                Skills
              </button>
              <button onClick={() => scrollTo("resume")} className="hover:text-white transition">
                Resume
              </button>
              <button onClick={() => scrollTo("contact")} className="hover:text-white transition">
                Contact
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div
        className={`relative flex flex-col items-center ${
          entered
            ? "pt-36 pb-12"
            : "min-h-screen justify-center"
        }`}
      >

        {/* WELCOME */}
        {!entered && (
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

        {/* CLICK ME */}
        {!entered && (
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

        {/* CARD */}
        <div
          onClick={() => setEntered(prev => !prev)}
          className="cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: entered
              ? "translateY(-120px) scale(0.85)"
              : "translateY(0px) scale(1.1)",
          }}
        >
          <NameCard3D />
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      {entered && (
        <div className="max-w-5xl mx-auto px-6 space-y-32 py-24">

          <section id="about" className="scroll-mt-28">
            <h2 className="text-4xl font-bold mb-6">About</h2>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              I’m a Computer Science student focused on building practical AI systems
              and structured software. I enjoy turning data-driven ideas into usable
              tools and refining how I build through iteration.
            </p>
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