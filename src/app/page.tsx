import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <div className="">
        <div className="navbar px-8 h-16 w-screen border-b-violet-50 absolute flex items-center justify-between z-50">
          <div className="left-content flex items-center gap-2">
            <div className="logo-dot w-4 h-4 bg-white rounded-full"></div>
            <div className="logo text-xl text-white tracking-tight">Sonas</div>
          </div>
          <div className="right-content flex gap-8 text-sm text-white uppercase items-center">
            <Link href="#home-hero">Home</Link>
            <Link href="#psychographics">Psychographics</Link>
            <Link href="#demographics">Demographics</Link>
            <Link href="/login">Login</Link>
            <Link className="py-2 px-8 bg-black" href="/signup">
              Sign up
            </Link>
          </div>
          <div className="navbar-line w-screen h-[1px] bg-white absolute left-0 bottom-0"></div>
        </div>
        {/* SECTION 01 */}
        <section
          id="home-hero"
          className="home-hero bg-[#0055FF] w-screen h-screen relative pt-16"
        >
          <div className="absolute top-[15svh] w-screen px-6 z-20">
            <p className="text-8xl text-white leading-tighter tracking-tighter">
              Shaping the Science of predictive discovery for the future
            </p>
          </div>
          <div className="absolute bottom-[25svh] w-screen px-8 z-20">
            <p className="max-w-md text-white">
              We're building powerful simulation engines that model human
              behavior at scale. Sonas creates digital worlds where decisions
              and outcomes unfold with remarkable accuracy.
            </p>
          </div>

          <div
            data-us-project="9dyuebmW59YmpQ7qd1uk"
            style={{ width: "1440px", height: "900px" }}
            className="absolute left-0 top-0 z-0"
          ></div>

          <div className="w-screen absolute left-0 bottom-0">
            <Image
              className="m-auto z-10"
              src="/images/home-hero-image.png"
              width={550}
              height={550}
              alt=""
            />
            <div className="w-screen absolute left-0 bottom-0 z-20 flex justify-end pb-20 pr-8">
              <Link
                className="py-2 px-8 bg-black text-white uppercase"
                href="/dashboard"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
        {/* SECTION 02 */}
        <section id="psychographics" className="w-screen bg-[#E8F1FC] pt-8">
          <div className="container flex justify-between items-center">
            <div>
              <Image
                className="m-auto z-10"
                src="/images/home-about-section-02.png"
                width={550}
                height={550}
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <div className="flex items-center gap-2 ">
                <div className="about-dot w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="text-xs">Psychographics simulation</div>
              </div>
              <div className="w-96 text-xl leading-tighter tracking-tighter">
                Generate virtual populations with nuanced belief systems and
                motivations. Sonas brings psychological profiles to life through
                agents that think, decide, and respond authentically.
              </div>
            </div>
          </div>
        </section>
        {/* SECTION 03 */}
        <section id="demographics" className="w-screen bg-[#f5f9fe] pt-8">
          <div className="container flex justify-between items-center">
            <div className="flex flex-col gap-2 ">
              <div className="flex items-center gap-2 ">
                {" "}
                <div className="about-dot w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="text-xs">Demographics simulation</div>
              </div>
              <div className="w-96 text-xl leading-tighter tracking-tighter">
                Create comprehensive population models with our advanced
                demographic engine. Sonas transforms raw data into dynamic
                virtual communities that reflect real-world complexity.
              </div>
            </div>
            <div>
              <Image
                className="m-auto z-10"
                src="/images/home-about-section.png"
                width={550}
                height={550}
                alt=""
              />
            </div>
          </div>
        </section>
        {/* SECTION 04 - CTA */}
        <section className="w-screen bg-black text-white h-[80vh] flex items-center">
          <div className="container mx-auto px-8 flex justify-between items-center">
            <div className="flex flex-col gap-6 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="text-xs uppercase">Take the next step</div>
              </div>
              <h2 className="text-4xl leading-tighter tracking-tighter">
                Transform your decision making with advanced predictive
                analytics
              </h2>
              <p className="text-gray-300 max-w-md">
                Harness the power of thousands of virtual agents to test
                scenarios before implementing them. Join forward-thinking
                organizations using Sonas to navigate tomorrow's challenges
                today.
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <Link
                className="py-3 px-10 bg-[#0055FF] text-white uppercase hover:bg-[#0044CC] transition-colors"
                href="/signup"
              >
                Start Now
              </Link>
              <Link
                className="py-3 px-10 border border-white text-white uppercase hover:bg-white hover:text-black transition-colors"
                href="/dashboard"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
        {/* SECTION 05 - FOOTER */}
        <section className="w-screen bg-[#003399] text-white h-[100svh] relative">
          <div className="absolute top-8 left-8 max-w-sm">
            <p className="text-sm opacity-70">
              Sonas is an open source world simulation project. <br /> You can
              contribute to the project on{" "}
              <Link
                href="https://github.com/your-github-repo" // Replace with actual GitHub link
                className="underline hover:opacity-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              .
            </p>
          </div>

          <div className="absolute top-8 right-8 max-w-xs text-right">
            <p className="text-sm opacity-70">
              © 2025 — Present. All rights reserved Sonas.
            </p>
          </div>

          <div className="absolute bottom-8 left-8 max-w-xs">
            {/* Replicated and enlarged logo from navbar */}
            <div className="left-content flex items-center gap-4">
              <div className="logo-dot w-8 h-8 bg-white rounded-full"></div>
              <div className="logo text-4xl text-white tracking-tight uppercase">
                SONAS
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 max-w-xs text-right">
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link href="#" className="hover:opacity-100">
                Terms
              </Link>
              <Link href="#" className="hover:opacity-100">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:opacity-100">
                Cookie Policy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
