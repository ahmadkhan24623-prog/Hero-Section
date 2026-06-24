import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const SPOTLIGHT_R = 180; // Scaled down spotlight radius for better mobile proportions

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const RevealLayer: React.FC<RevealLayerProps> = React.memo(
  ({ image, cursorX, cursorY }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [maskUrl, setMaskUrl] = useState<string>("");

    // Handle window resize dynamically to prevent offset bounds on canvas drawing
    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (cursorX >= 0 && cursorY >= 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const grad = ctx.createRadialGradient(
            cursorX,
            cursorY,
            0,
            cursorX,
            cursorY,
            SPOTLIGHT_R,
          );

          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.4, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
          grad.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
          grad.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
          ctx.fill();

          setMaskUrl(canvas.toDataURL());
        }
      };

      handleResize(); // Run immediately on mount & cursor updates
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [cursorX, cursorY]);

    return (
      <>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
          style={{
            backgroundImage: `url(${image})`,
            maskImage: maskUrl ? `url(${maskUrl})` : "none",
            WebkitMaskImage: maskUrl ? `url(${maskUrl})` : "none",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "0 0",
            WebkitMaskPosition: "0 0",
          }}
        />
      </>
    );
  },
);

RevealLayer.displayName = "RevealLayer";

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mouse = { x: -999, y: -999 };
    const currentPos = { x: -999, y: -999 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const ticker = () => {
      currentPos.x += (mouse.x - currentPos.x) * 0.1;
      currentPos.y += (mouse.y - currentPos.y) * 0.1;
      setCursorPos({ x: currentPos.x, y: currentPos.y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove); 
      gsap.ticker.remove(ticker);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("nav", { y: -100, opacity: 0, duration: 1 });

      tl.fromTo(
        ".hero-reveal-text",
        { y: 40, opacity: 0, rotation: 3 },
        { y: 0, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.2 },
        "-=0.6",
      )
        .fromTo(
          ".hero-fade-content",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4 },
          "-=0.8",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white tracking-[-0.02em] overflow-x-hidden font-sans"
    >
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 md:p-6 lg:p-8 bg-black/10 backdrop-blur-md border-b border-white/5">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 cursor-pointer group transition-all duration-500 hover:scale-[1.03]">
          <div className="p-3 bg-white/5 backdrop-blur-3xl rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/30">
            <svg
              viewBox="0 0 256 256"
              fill="#ffffff"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </div>
          <span className="text-3xl sm:text-4xl md:text-5xl text-white font-serif italic leading-none relative">
            Lithos
          </span>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-auto whitespace-nowrap bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-6 py-4 items-center gap-2 shadow-2xl shadow-black/60">
          <button className="relative bg-white/15 text-white px-8 py-3 rounded-full text-base font-medium tracking-tight transition-all duration-500 hover:bg-white/20 hover:scale-[1.02]">
            Course
          </button>
          {["Field Guides", "Geology", "Plans", "Live Tour"].map((item) => (
            <button
              key={item}
              className="relative group text-white/60 hover:text-white transition-colors duration-500 px-8 py-3 rounded-full text-base font-bold tracking-tight hover:scale-[1.02]"
            >
              {item}
              <span className="absolute left-1/2 bottom-2 -translate-x-1/2 h-1 w-0 bg-[#e8702a] rounded-full group-hover:w-1/2 transition-all duration-500 ease-in-out" />
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <button className="hidden lg:block relative group bg-gradient-to-r from-white to-gray-200 text-base font-semibold px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-2xl shadow-white/10 border border-white/20">
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700" />
          <span className="relative z-10">Sign Up</span>
        </button>

        {/* Mobile Hamburger Menu */}
        <button className="lg:hidden relative group bg-white/5 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 transition-all duration-500 hover:bg-white/15 hover:scale-105 active:scale-95">
          <Menu className="w-6 h-6 relative z-10" />
        </button>
      </nav>

      {/* Hero Section */}
      <section
        className="relative w-full overflow-h-hidden h-screen bg-black select-none flex flex-col justify-between pt-24 pb-8 px-6 md:px-16"
        style={{ height: "100dvh" }}
      >
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Heading Stack */}
        <h1 className="w-full flex flex-col pointer-events-none z-50 text-white font-serif tracking-tighter leading-[0.9] mt-[10vh] sm:mt-[15vh]">
          <span
            className="hero-reveal-text block font-extrabold italic text-[clamp(2.5rem,7vw,7.5rem)] bg-gradient-to-br from-amber-900 via-orange-500 to-amber-700 bg-clip-text text-transparent origin-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
            style={{ letterSpacing: "-0.04em" }}
          >
            LAYERS HOLD
          </span>
          <span
            className="hero-reveal-text block font-black uppercase text-[clamp(2.5rem,7vw,7.5rem)] -mt-[0.15em] bg-gradient-to-br from-slate-900 via-slate-500 to-slate-500 bg-clip-text text-transparent origin-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
            style={{ letterSpacing: "-0.06em" }}
          >
            TALES OF TIME
          </span>
        </h1>

        {/* Bottom Content Area (Responsive Grid/Flex Arrangement) */}
        <div className="relative z-50 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-12 w-full pb-4">
          {/* Left Description */}
          <div className="hero-fade-content max-w-full lg:max-w-[40%] pointer-events-auto">
            <p className="text-base sm:text-lg md:text-xl text-white/85 leading-relaxed font-normal">
              Every layer of sediment records a chapter of our planet, from
              ancient seabeds to drifting ash, layered across millions of years
              beneath us.
            </p>
          </div>

          {/* Right Text & Action */}
          <div className="hero-fade-content max-w-full lg:max-w-[45%] flex flex-col items-start lg:items-end gap-6 text-left lg:text-right pointer-events-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-normal leading-normal cursor-pointer bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent transition-all duration-500 hover:from-amber-200 hover:via-orange-200 hover:to-rose-200">
              Our interactive maps let you peel back the crust to trace how
              stones, fossils, and deep time combine to shape the ground beneath
              your feet.
            </h2>
            
            <button className="bg-[#e8702a] hover:bg-[#d2611f] text-base sm:text-lg md:text-xl font-medium px-8 py-4 sm:px-10 sm:py-5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 text-white leading-none tracking-tight whitespace-nowrap">
              Start Digging
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}