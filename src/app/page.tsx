"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import SplitType from "split-type";
import Lenis from "lenis";

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  // Animation steps: 0: counting, 1: scaling blue bg, 2: fading out, 3: finished
  const [animationStep, setAnimationStep] = useState(0); // 0: counting, 1: scaling blue bg, 2: fading out, 3: finished

  // Check for ?code= in URL and redirect to login if found
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("?code=")
    ) {
      router.push("/login");
    }
  }, [router]);

  const loadingContainerRef = useRef<HTMLDivElement>(null);
  const blueBgRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const counterDotRef = useRef<HTMLDivElement>(null); // Ref for the counter dot
  const heroHeadingRef = useRef<HTMLParagraphElement>(null); // Ref for the hero heading
  const heroBodyRef = useRef<HTMLParagraphElement>(null); // Ref for the hero body copy
  const heroImageRef = useRef<HTMLDivElement>(null); // Ref for the hero image container
  const heroButtonRef = useRef<HTMLDivElement>(null); // Ref for the hero button container
  const navbarRef = useRef<HTMLDivElement>(null); // Ref for the navbar
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]); // Refs for navigation links
  const ctaButtonsRef = useRef<(HTMLAnchorElement | null)[]>([]); // Refs for CTA buttons

  // Master timeline for all animations
  const masterTimeline = useRef<gsap.core.Timeline | null>(null);

  // Initialize smooth scrolling
  useEffect(() => {
    // Initialize smooth scrolling with Lenis with enhanced options for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.25, // Perfect duration for buttery smooth scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      orientation: "vertical", // Scroll direction
      wheelMultiplier: 0.8, // Adjusted for smoother wheel scrolling
      touchMultiplier: 2, // Adjusted for touch devices
      infinite: false, // Disable infinite scrolling
      lerp: 0.15, // Linear interpolation factor for smoothness
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // Cleanup
      lenis.destroy();
    };
  }, []);

  // Effect for counting and initializing the master timeline
  useEffect(() => {
    // Initialize the master timeline once
    if (!masterTimeline.current) {
      masterTimeline.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          // Set animation step to finished when the timeline completes
          setAnimationStep(3);
        },
      });
    }

    if (animationStep === 0) {
      if (count < 100) {
        const timer = setTimeout(() => setCount(count + 1), 20); // Faster timing (2000ms / 100 steps)
        return () => clearTimeout(timer);
      } else {
        // When count reaches 100, start the GSAP animation timeline
        if (masterTimeline.current) {
          masterTimeline.current.play();
        }
        setAnimationStep(1);
      }
    }
  }, [count, animationStep]);

  // Setup the complete animation sequence
  useEffect(() => {
    if (
      masterTimeline.current &&
      blueBgRef.current &&
      numberRef.current &&
      counterDotRef.current &&
      loadingContainerRef.current &&
      heroHeadingRef.current &&
      heroBodyRef.current &&
      heroImageRef.current &&
      heroButtonRef.current &&
      navbarRef.current
    ) {
      // Clear any existing animations
      masterTimeline.current.clear();

      // Split heading into lines
      const headingText = new SplitType(heroHeadingRef.current, {
        types: "lines",
        tagName: "span",
      });

      // Split body copy into lines
      const bodyText = new SplitType(heroBodyRef.current, {
        types: "lines",
        tagName: "span",
      });

      // Add classes to each line for proper overflow handling
      if (headingText.lines) {
        headingText.lines.forEach((line) => {
          gsap.set(line, { overflow: "hidden", display: "block" });
          // Wrap the text content in a span for animation
          const content = line.innerHTML;
          line.innerHTML = `<span style="display:block">${content}</span>`;
        });
      }

      if (bodyText.lines) {
        bodyText.lines.forEach((line) => {
          gsap.set(line, { overflow: "hidden", display: "block" });
          // Wrap the text content in a span for animation
          const content = line.innerHTML;
          line.innerHTML = `<span style="display:block">${content}</span>`;
        });
      }

      // Get the inner spans for animation
      const headingInnerSpans = headingText.lines
        ? headingText.lines.map((line) => line.querySelector("span"))
        : [];

      const bodyInnerSpans = bodyText.lines
        ? bodyText.lines.map((line) => line.querySelector("span"))
        : [];

      // Set initial state for all elements
      gsap.set(headingInnerSpans, {
        y: 100,
        opacity: 0,
      });

      gsap.set(bodyInnerSpans, {
        y: 100,
        opacity: 0,
      });

      // Set initial state for image, button and navbar
      gsap.set(heroImageRef.current, {
        y: 50,
        opacity: 0,
      });

      gsap.set(heroButtonRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set(navbarRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      // Build the complete animation sequence
      masterTimeline.current
        // 1. Fade out the counter and dot
        .to([numberRef.current, counterDotRef.current], {
          opacity: 0,
          duration: 0.5,
          ease: "power1.inOut",
        })
        // 2. Expand the blue background
        .to(
          blueBgRef.current,
          {
            width: "100vw",
            height: "100vh",
            duration: 2.2,
            ease: "expo.inOut",
          },
          "<" // Start at the same time as the previous animation
        )
        // 3. Fade out the loading container
        .to(loadingContainerRef.current, {
          opacity: 0,
          duration: 0.5, // Reduced from 1.0 to 0.5 for faster transition
          ease: "power1.inOut",
        })
        // 4. Animate all elements with a coordinated sequence
        .to(
          headingInnerSpans,
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09, // Slightly faster stagger for smoother flow
          },
          "-=0.2" // Start much sooner - only 0.3s gap after blue background fills screen
        )
        .to(
          bodyInnerSpans,
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.1, // Faster stagger for body text
          },
          "-=0.6" // More overlap with heading animation
        )
        .to(
          heroImageRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.8" // Start while text is still animating
        )
        .to(
          heroButtonRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.9" // Start while image is still animating
        )
        // Animate navbar to appear along with body text
        .to(
          navbarRef.current,
          {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.8" // Start at the same time as body text
        );
    }
  }, []);

  // Setup hover animations with GSAP
  useEffect(() => {
    // Only setup hover animations after the main animation is complete
    if (animationStep === 3) {
      // Get all navigation links
      const navLinks = document.querySelectorAll(".nav-link");
      const ctaButtons = document.querySelectorAll(".cta-button");

      // Setup hover animations for navigation links
      navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            opacity: 0.8,
            textDecoration: "underline",
            duration: 0.2,
            ease: "power1.out",
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            opacity: 1,
            textDecoration: "none",
            duration: 0.2,
            ease: "power1.out",
          });
        });
      });

      // Setup hover animations for CTA buttons
      ctaButtons.forEach((button) => {
        if (button.classList.contains("primary-cta")) {
          button.addEventListener("mouseenter", () => {
            gsap.to(button, {
              backgroundColor: "#0044CC",
              scale: 1.05,
              duration: 0.3,
              ease: "power1.out",
            });
          });

          button.addEventListener("mouseleave", () => {
            gsap.to(button, {
              backgroundColor: "#0055FF",
              scale: 1,
              duration: 0.3,
              ease: "power1.out",
            });
          });
        } else if (button.classList.contains("secondary-cta")) {
          button.addEventListener("mouseenter", () => {
            gsap.to(button, {
              backgroundColor: "#FFFFFF",
              color: "#000000",
              scale: 1.05,
              duration: 0.3,
              ease: "power1.out",
            });
          });

          button.addEventListener("mouseleave", () => {
            gsap.to(button, {
              backgroundColor: "transparent",
              color: "#FFFFFF",
              scale: 1,
              duration: 0.3,
              ease: "power1.out",
            });
          });
        } else if (button.classList.contains("signup-cta")) {
          button.addEventListener("mouseenter", () => {
            gsap.to(button, {
              backgroundColor: "#333333",
              duration: 0.3,
              ease: "power1.out",
            });
          });

          button.addEventListener("mouseleave", () => {
            gsap.to(button, {
              backgroundColor: "#000000",
              duration: 0.3,
              ease: "power1.out",
            });
          });
        }
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

            {/* Counter with dot (ensure it's above the blue bg initially) */}
            <div className="relative z-10 flex items-center gap-2">
              {/* Counter dot - similar to navbar dot */}
              <div
                ref={counterDotRef}
                className="w-2 h-2 bg-black rounded-full"
              ></div>

              {/* Counter */}
              <div
                ref={numberRef}
                className="text-sm font-mono text-black" // Made text smaller (text-sm)
              >
                {/* Display 100 once count reaches it, otherwise the formatted count */}
                {count === 100 ? "100" : formattedCount}
              </div>
            </div>
          </div>
        )}

        {/* Desktop & Mobile Navigation */}
        {/* Ensure nav is only visible/interactive after loading */}
        <div
          ref={navbarRef}
          className="navbar px-4 md:px-8 h-16 w-full border-b-violet-50 absolute flex items-center justify-between z-50 bg-[#0055FF] opacity-0 pointer-events-none"
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
              className="nav-link"
              ref={(el) => {
                navLinksRef.current[0] = el;
              }}
            >
              Home
            </Link>
            <Link
              href="#psychographics"
              className="nav-link"
              ref={(el) => {
                navLinksRef.current[1] = el;
              }}
            >
              Psychographics
            </Link>
            <Link
              href="#demographics"
              className="nav-link"
              ref={(el) => {
                navLinksRef.current[2] = el;
              }}
            >
              Demographics
            </Link>
            <Link
              href="/login"
              className="nav-link"
              ref={(el) => {
                navLinksRef.current[3] = el;
              }}
            >
              Login
            </Link>
            <Link
              className="py-2 px-4 lg:px-8 bg-black cta-button signup-cta"
              href="/signup"
              ref={(el) => {
                ctaButtonsRef.current[0] = el;
              }}
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
                  className="nav-link"
                >
                  Home
                </Link>
                <Link
                  href="#psychographics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link"
                >
                  Psychographics
                </Link>
                <Link
                  href="#demographics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link"
                >
                  Demographics
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link"
                >
                  Login
                </Link>
                <Link
                  className="py-2 px-8 bg-black cta-button signup-cta"
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
            <div className="overflow-hidden">
              <p
                ref={heroHeadingRef}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-6xl text-white leading-tight md:leading-tighter tracking-tighter"
              >
                Shaping the Science of predictive discovery for the future
              </p>
            </div>
          </div>
          <div className="absolute bottom-[25svh] w-full px-4 md:px-8 z-20">
            <div className="overflow-hidden">
              <p
                ref={heroBodyRef}
                className="text-sm md:text-base max-w-full md:max-w-md text-white"
              >
                We're building powerful simulation engines that model human
                behavior at scale. Sonas creates digital worlds where decisions
                and outcomes unfold with remarkable accuracy.
              </p>
            </div>
          </div>
          <div ref={heroImageRef} className="w-full absolute left-0 bottom-0">
            <Image
              className="m-auto z-10 w-full max-w-[350px] md:max-w-[450px] lg:max-w-[550px] h-auto"
              src="/images/home-hero-image.png"
              width={550}
              height={550}
              alt="Hero visualization"
            />
            <div
              ref={heroButtonRef}
              className="w-full absolute left-0 bottom-0 z-20 flex justify-center md:justify-end pb-10 md:pb-20 px-4 md:pr-8"
            >
              <Link
                className="py-2 px-8 bg-black text-white uppercase text-sm md:text-base cta-button signup-cta"
                href="/signup"
                ref={(el) => {
                  ctaButtonsRef.current[3] = el;
                }}
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
                className="py-3 px-8 md:px-10 bg-[#0055FF] text-white uppercase text-center text-sm md:text-base cta-button primary-cta"
                href="/signup"
                ref={(el) => {
                  ctaButtonsRef.current[1] = el;
                }}
              >
                Start Now
              </Link>
              {/* <Link
                className="py-3 px-8 md:px-10 border border-white text-white uppercase text-center text-sm md:text-base cta-button secondary-cta"
                href="/dashboard"
                ref={(el) => {
                  ctaButtonsRef.current[2] = el;
                }}
              >
                Learn More
              </Link> */}
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
                className="nav-link underline opacity-70"
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => {
                  navLinksRef.current[7] = el;
                }}
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
                className="nav-link"
                ref={(el) => {
                  navLinksRef.current[4] = el;
                }}
              >
                Terms
              </Link>
              <Link
                href="#"
                className="nav-link"
                ref={(el) => {
                  navLinksRef.current[5] = el;
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="nav-link"
                ref={(el) => {
                  navLinksRef.current[6] = el;
                }}
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
