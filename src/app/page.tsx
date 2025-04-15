import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <div className="">
        <div className="navbar px-8 h-16 w-screen border-b-violet-50 absolute flex items-center justify-between z-50">
          <div className="left-content flex items-center gap-2">
            <div className="logo-dot w-4 h-4 bg-white rounded-full"></div>
            <div className="logo text-xl text-white tracking-tight">SONAS</div>
          </div>
          <div className="right-content flex gap-8 text-sm text-white uppercase items-center">
            <Link href="/dashboard">Home</Link>
            <Link href="/dashboard">Private Sector</Link>
            <Link href="/dashboard">Political Sector</Link>
            <Link href="/dashboard">Login</Link>
            <Link className="py-2 px-8 bg-black" href="/dashboard">
              Sign up
            </Link>
          </div>
          <div className="navbar-line w-screen h-[1px] bg-white absolute left-0 bottom-0"></div>
        </div>
        {/* SECTION 01 */}
        <section className="home-hero bg-[#0055FF] w-screen h-screen relative pt-16">
          <div className="absolute top-[15svh] w-screen px-6 z-20">
            <p className="text-7xl text-white uppercase leading-tighter tracking-tighter">
              Shaping the Science of Predictive Discovery For The Future
            </p>
          </div>
          <div className="absolute bottom-[25svh] w-screen px-8 z-20">
            <p className="max-w-md text-white">
              Lorem ipsum hwrqwe sjqrew hiqres llgoere nsnchres ares orep kjfas.
              Djqrew hiqres llgoere nsnchres ares orep kjfas. Llgoere nsnchres
              ares.{" "}
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
        <section className="w-screen bg-[#E8F1FC] pt-8">
          <div className="container flex justify-between items-center">
            <div className="flex flex-col gap-2 ">
              <div className="flex items-center gap-2 ">
                {" "}
                <div className="about-dot w-2 h-2 bg-[#0055FF] rounded-full"></div>
                <div className="text-xs">WORLD SIMULATION</div>
              </div>
              <div className="w-96 text-xl leading-tighter tracking-tighter">
                Lorem ipsum harqwe sjqrew hiqres llgoere nsnchres ares orey
                kfas. Lorem ipsum harqwe sjqrew hiqres.
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
      </div>
    </>
  );
}
