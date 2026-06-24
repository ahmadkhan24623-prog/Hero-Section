import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const SPOTLIGHT_R = 260;

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

    useEffect(() => {
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
        { y: 80, opacity: 0, rotation: 3 },
        { y: 0, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.2 },
        "-=0.6",
      )
        .fromTo(
          ".hero-fade-content",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4 },
          "-=0.8",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white tracking-[-0.02em] overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 md:p-6 lg:p-8 xl:p-12 bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-5 md:gap-7 cursor-pointer group transition-all duration-500 hover:scale-[1.03]">
          <div className="p-3 sm:p-4 md:p-5 bg-white/5 backdrop-blur-3xl rounded-2xl md:rounded-[32px] border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/30">
            <svg
              viewBox="0 0 256 256"
              fill="#ffffff"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 transition-transform duration-500 group-hover:scale-110"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </div>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-9xl text-white font-playfair italic leading-none relative">
            Lithos
          </span>
        </div>

        {/* Scaled down text size and padding slightly on mid-tier breakpoints to prevent wrapping/overflow */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-auto whitespace-nowrap bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-4 md:px-8 lg:px-14 py-3 md:py-5 lg:py-7 items-center gap-2 md:gap-4 lg:gap-6 shadow-2xl shadow-black/60">
          <button className="relative bg-white/15 text-white px-4 md:px-10 lg:px-20 py-3 md:py-5 lg:py-8 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-tight transition-all duration-500 hover:bg-white/20 hover:scale-[1.02]">
            Course
          </button>
          {["Field Guides", "Geology", "Plans", "Live Tour"].map((item) => (
            <button
              key={item}
              className="relative group text-white/60 hover:text-white transition-colors duration-500 px-4 md:px-10 lg:px-20 py-3 md:py-5 lg:py-8 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold tracking-tight hover:scale-[1.02]"
            >
              {item}
              <span className="absolute left-1/2 bottom-3 md:bottom-4 lg:bottom-6 -translate-x-1/2 h-1 w-0 bg-[#e8702a] rounded-full group-hover:w-1/2 transition-all duration-500 ease-in-out" />
            </button>
          ))}
        </div>

        <button className="hidden md:block relative group bg-gradient-to-r from-white to-gray-200 text-base md:text-2xl lg:text-3xl xl:text-5xl font-semibold px-6 md:px-12 lg:px-16 xl:px-24 py-3 md:py-5 lg:py-7 xl:py-10 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-2xl shadow-white/10 border border-white/20">
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700" />
          <span className="relative z-10">Sign Up</span>
        </button>

        <button className="md:hidden relative group bg-white/5 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 transition-all duration-500 hover:bg-white/15 hover:scale-105 active:scale-95">
          <Menu className="w-8 h-8 relative z-10" />
        </button>
      </nav>

      {/* Kept original absolute placements and flow intact, supplemented with dynamic viewport-based scaling (vw/dvh) 
          and width limiters to perfectly fit all screens without layout breakage or redesign. */}
      <section
        className="relative w-full overflow-hidden h-screen bg-black select-none"
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

        <h1 className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50 text-white font-serif tracking-tighter leading-[0.9] overflow-hidden">
          <span
            className="hero-reveal-text block font-extrabold italic text-[clamp(2.75rem,8vw,9rem)] bg-gradient-to-br from-amber-900 via-orange-500 to-amber-700 bg-clip-text text-transparent origin-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
            style={{ letterSpacing: "-0.04em" }}
          >
            LAYERS HOLD
          </span>
          <span
            className="hero-reveal-text block font-black uppercase text-[clamp(2.75rem,8vw,9rem)] -mt-[0.15em] bg-gradient-to-br from-slate-900 via-slate-500 to-slate-500 bg-clip-text text-transparent origin-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
            style={{ letterSpacing: "-0.06em" }}
          >
            TALES OF TIME
          </span>
        </h1>

        <div className="hero-fade-content absolute bottom-[20%] md:bottom-36 left-4 sm:left-6 md:left-16 max-w-[90%] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] z-50 text-left pointer-events-auto">
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl text-white/85 leading-relaxed font-normal">
            Every layer of sediment records a chapter of our planet, from
            ancient seabeds to drifting ash, layered across millions of years
            beneath us.
          </p>
        </div>

        <div className="hero-fade-content absolute bottom-6 md:bottom-12 right-4 sm:right-6 md:right-16 max-w-[90%] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[800px] flex flex-col items-end gap-4 md:gap-8 lg:gap-10 z-50 text-right ml-auto pointer-events-auto">
          <div className="flex flex-col items-end gap-4 md:gap-8 lg:gap-10 w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-normal leading-normal cursor-pointer bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent transition-all duration-500 hover:from-amber-200 hover:via-orange-200 hover:to-rose-200">
              Our interactive maps let you peel back the crust to trace how
              stones, fossils, and deep time combine to shape the ground beneath
              your feet.
            </h2>
            
            <button className="bg-[#e8702a] hover:bg-[#d2611f] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium px-8 py-4 sm:px-10 sm:py-5 md:px-16 md:py-7 lg:px-20 lg:py-8 xl:px-24 xl:py-10 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 text-white leading-none tracking-tight">
              Start Digging
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}