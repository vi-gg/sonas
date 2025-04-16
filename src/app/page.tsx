"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  // Animation steps: 0: counting, 1: scaling blue bg, 2: fading out, 3: finished
  const [animationStep, setAnimationStep] = useState(0);

  const loadingContainerRef = useRef<HTMLDivElement>(null);
  const blueBgRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null); // Ref for the number

  // Effect for counting
  useEffect(() => {
    if (animationStep === 0) {
      if (count < 100) {
        const timer = setTimeout(() => setCount(count + 1), 20); // Faster timing (2000ms / 100 steps)
        return () => clearTimeout(timer);
      } else {
        // When count reaches 100, trigger the GSAP animation
        setAnimationStep(1);
      }
    }
  }, [count, animationStep]);

  // Effect for GSAP animations
  useEffect(() => {
    if (
      animationStep === 1 &&
      blueBgRef.current &&
      numberRef.current && // Add numberRef check
      loadingContainerRef.current
    ) {
      // Animate the number fading out
      gsap.to(numberRef.current, {
        opacity: 0,
        duration: 0.5, // Faster fade for the number
        ease: "power1.inOut",
      });

      // Animate the blue background expanding
      gsap.to(blueBgRef.current, {
        width: "100vw",
        height: "100vh",
        duration: 1.5, // Adjust duration as needed
        ease: "expo.inOut",
        onComplete: () => {
          setAnimationStep(2); // Move to fade out step
        },
      });
    } else if (animationStep === 2 && loadingContainerRef.current) {
      // Animate the entire loading container fading out
      gsap.to(loadingContainerRef.current, {
        opacity: 0,
        duration: 1, // Fade out duration
        ease: "power1.inOut",
        onComplete: () => {
          setAnimationStep(3); // Animation finished
        },
      });
    }
  }, [animationStep]);

  // Format count to always have two digits (e.g., 01, 09, 10)
  const formattedCount = count.toString().padStart(2, "0");

  return (
    <>
      <div className="overflow-x-hidden">
        {/* Loading Animation Container */}
        {animationStep < 3 && (
          <div
            ref={loadingContainerRef}
            className="fixed inset-0 z-[999] bg-white flex justify-center items-center overflow-hidden"
          >
            {/* Blue Background Div (starts with zero size) */}
            <div
              ref={blueBgRef}
              className="absolute inset-0 bg-[#0055FF] transform-gpu" // Removed scale-0
              style={{
                width: 0,
                height: 0,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }} // Start at center with 0 size
            ></div>

            {/* Counter (ensure it's above the blue bg initially) */}
            <div
              ref={numberRef}
              className="relative z-10 text-sm font-mono text-black" // Made text smaller (text-sm)
            >
              {/* Display 100 once count reaches it, otherwise the formatted count */}
              {count === 100 ? "100" : formattedCount}
            </div>
          </div>
        )}

        {/* Desktop & Mobile Navigation */}
        {/* Ensure nav is only visible/interactive after loading */}
        <div
          className={`navbar px-4 md:px-8 h-16 w-full border-b-violet-50 absolute flex items-center justify-between z-50 bg-[#0055FF] transition-opacity duration-300 ${
            animationStep === 3
              ? "opacity-100"
              : "opacity-0 pointer-events-none" // Hide and disable interaction during loading
          }`}
        >
          <div className="left-content flex items-center gap-2">
            <div className="logo-dot w-3 md:w-4 h-3 md:h-4 bg-white rounded-full"></div>
            <div className="logo text-lg md:text-xl text-white tracking-tight uppercase">
              Sonas
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="right-content hidden md:flex gap-4 lg:gap-8 text-sm text-white uppercase items-center">
            <Link
              href="#home-hero"
              className="hover:opacity-80 hover:underline transition-all"
            >
              Home
            </Link>
            <Link
              href="#psychographics"
              className="hover:opacity-80 hover:underline transition-all"
            >
              Psychographics
            </Link>
            <Link
              href="#demographics"
              className="hover:opacity-80 hover:underline transition-all"
            >
              Demographics
            </Link>
            <Link
              href="/login"
              className="hover:opacity-80 hover:underline transition-all"
            >
              Login
            </Link>
            <Link
              className="py-2 px-4 lg:px-8 bg-black hover:bg-gray-800 transition-colors"
              href="/signup"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Navigation Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-[#0055FF] z-40 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-8 text-lg text-white uppercase items-center">
                <Link
                  href="#home-hero"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:opacity-80 hover:underline transition-all"
                >
                  Home
                </Link>
                <Link
                  href="#psychographics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:opacity-80 hover:underline transition-all"
                >
                  Psychographics
                </Link>
                <Link
                  href="#demographics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:opacity-80 hover:underline transition-all"
                >
                  Demographics
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:opacity-80 hover:underline transition-all"
                >
                  Login
                </Link>
                <Link
                  className="py-2 px-8 bg-black hover:bg-gray-800 transition-colors"
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}

          <div className="navbar-line w-full h-[0px] bg-white absolute left-0 bottom-0"></div>
        </div>
        {/* SECTION 01 */}
        <section
          id="home-hero"
          className="home-hero bg-[#0055FF] w-full h-screen relative pt-16"
        >
          <div className="absolute top-[15svh] w-full px-4 md:px-6 z-20">
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-6xl text-white leading-tight md:leading-tighter tracking-tighter">
              Shaping the Science of predictive discovery for the future
            </p>
          </div>
          <div className="absolute bottom-[25svh] w-full px-4 md:px-8 z-20">
            <p className="text-sm md:text-base max-w-full md:max-w-md text-white">
              We're building powerful simulation engines that model human
              behavior at scale. Sonas creates digital worlds where decisions
              and outcomes unfold with remarkable accuracy.
            </p>
          </div>
          <div className="w-full absolute left-0 bottom-0">
            <Image
              className="m-auto z-10 w-full max-w-[350px] md:max-w-[450px] lg:max-w-[550px] h-auto"
              src="/images/home-hero-image.png"
              width={550}
              height={550}
              alt="Hero visualization"
            />
            <div className="w-full absolute left-0 bottom-0 z-20 flex justify-center md:justify-end pb-10 md:pb-20 px-4 md:pr-8">
              <Link
                className="py-2 px-8 bg-black text-white uppercase text-sm md:text-base hover:bg-gray-800 transition-colors"
                href="/signup"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
        {/* SECTION 02 */}
        <section
          id="psychographics"
          className="w-full bg-[#E8F1FC] py-12 md:py-16"
        >
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 lg:py-12">
            <div className="order-2 md:order-1 w-full md:w-1/2">
              <Image
                className="m-auto z-10 w-full max-w-[450px] h-auto"
                src="/images/home-about-section-02.png"
                width={550}
                height={550}
                alt="Psychographics visualization"
              />
            </div>
            <div className="order-1 md:order-2 w-full md:w-1/2 flex flex-col gap-4 md:gap-2 px-4">
              <div className="flex items-center gap-2">
                <div className="about-dot w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="uppercase text-xs md:text-sm">
                  Psychographics simulation
                </div>
              </div>
              <div className="w-full md:max-w-md text-lg md:text-xl leading-tight md:leading-tighter tracking-tighter">
                Generate virtual populations with nuanced belief systems and
                motivations. Sonas brings psychological profiles to life through
                agents that think, decide, and respond authentically.
              </div>
            </div>
          </div>
        </section>
        {/* SECTION 03 */}
        <section
          id="demographics"
          className="w-full bg-[#f5f9fe] py-12 md:py-16 lg:relative lg:overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-8 lg:pt-12">
            {/* Normal layout for mobile and tablet, special for desktop */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 lg:items-start">
              {/* Text content */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-2 z-10 px-4 lg:pr-16">
                <div className="flex items-center gap-2">
                  <div className="about-dot w-2 h-2 bg-[#0055FF] rounded-full"></div>
                  <div className="uppercase text-xs md:text-sm">
                    Demographics simulation
                  </div>
                </div>
                <div className="w-full md:max-w-md text-lg md:text-xl leading-tight md:leading-tighter tracking-tighter">
                  Create comprehensive population models with our advanced
                  demographic engine. Sonas transforms raw data into dynamic
                  virtual communities that reflect real-world complexity.
                </div>
              </div>

              {/* Image container - normal on tablet, special on desktop */}
              <div className="w-full md:w-1/2 lg:relative lg:top-24 lg:h-[600px] flex items-center md:items-center lg:items-end justify-center">
                <Image
                  className="z-10 w-full max-w-[450px] md:max-w-[450px] lg:max-w-[700px] h-auto lg:absolute static lg:bottom-0"
                  src="/images/home-about-section.png"
                  width={700}
                  height={700}
                  alt="Demographics visualization of statue"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        {/* SECTION 04 - CTA */}
        <section className="w-full bg-black text-white min-h-[80vh] py-16 flex items-center">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-6 max-w-full md:max-w-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="text-xs uppercase">Take the next step</div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-tighter tracking-tighter">
                Transform your decision making with advanced predictive
                analytics
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-full md:max-w-md">
                Harness the power of thousands of virtual agents to test
                scenarios before implementing them. Join forward-thinking
                organizations using Sonas to navigate tomorrow's challenges
                today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full md:w-auto">
              <Link
                className="py-3 px-8 md:px-10 bg-[#0055FF] text-white uppercase text-center hover:bg-[#0044CC] hover:scale-105 transition-all text-sm md:text-base"
                href="/signup"
              >
                Start Now
              </Link>
              <Link
                className="py-3 px-8 md:px-10 border border-white text-white uppercase text-center hover:bg-white hover:text-black hover:scale-105 transition-all text-sm md:text-base"
                href="/dashboard"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
        {/* SECTION 05 - FOOTER */}
        <section className="w-full bg-[#0f0099] text-white min-h-screen py-16 md:h-[100svh] relative">
          {/* Centered Background Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-20">
            <Image
              src="/images/home-footer-min.png"
              alt="Footer background decoration"
              width={600} // Adjust size as needed
              height={600} // Adjust size as needed
              className="pointer-events-none" // Prevent image from interfering with clicks
            />
          </div>

          {/* Existing Footer Content - Ensure it has higher z-index if needed */}
          <div className="md:absolute top-8 left-0 md:left-8 max-w-full md:max-w-sm p-4 md:p-0 z-10">
            <p className="text-xs md:text-sm opacity-70">
              Sonas is an open source world simulation project. <br /> You can
              contribute to the project on{" "}
              <Link
                href="https://github.com/your-github-repo" // Replace with actual GitHub link
                className="underline opacity-70 hover:opacity-100 hover:underline transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              .
            </p>
          </div>

          <div className="md:absolute top-8 right-0 md:right-8 max-w-full md:max-w-xs text-left md:text-right p-4 md:p-0 mt-8 md:mt-0 z-10">
            <p className="text-xs md:text-sm opacity-70">
              © 2025 — Present. All rights reserved Sonas.
            </p>
          </div>

          <div className="md:absolute bottom-8 left-0 md:left-8 max-w-full md:max-w-xs p-4 md:p-0 mt-16 md:mt-0">
            {/* Replicated and enlarged logo from navbar */}
            <div className="left-content flex items-center gap-2">
              <div className="logo-dot w-6 md:w-8 h-6 md:h-8 bg-white rounded-full"></div>
              <div className="logo text-3xl md:text-4xl text-white tracking-tight uppercase">
                SONAS
              </div>
            </div>
          </div>

          <div className="md:absolute bottom-8 right-0 md:right-8 max-w-full md:max-w-xs text-left md:text-right p-4 md:p-0 mt-12 mb-8 md:my-0 z-10">
            <div className="flex flex-col gap-2 text-xs md:text-sm opacity-70">
              <Link
                href="#"
                className="hover:opacity-100 hover:underline transition-all"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:opacity-100 hover:underline transition-all"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:opacity-100 hover:underline transition-all"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
