import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface PolymerColorOption {
  name: string;
  hex: string;
  photo: string;
  polymerType: string;
  grade: string;
  mfi: string;
  purity: string;
}

export const polymerColorOptions: PolymerColorOption[] = [
  {
    name: "Royal Blue",
    hex: "#2563eb",
    photo: "/Polymers-photos/IMG_1554.jpg",
    polymerType: "PCR Polypropylene (PP)",
    grade: "Injection Grade • Vivid Pigment",
    mfi: "MFI 12-14",
    purity: "99.8% Purity",
  },
  {
    name: "Forest Green",
    hex: "#22c55e",
    photo: "/Polymers-photos/IMG_1534.jpg",
    polymerType: "PCR PP Copolymer",
    grade: "Blow Molding & Extrusion",
    mfi: "MFI 8-10",
    purity: "99.7% Purity",
  },
  {
    name: "Crimson Red",
    hex: "#ef4444",
    photo: "/Polymers-photos/IMG_1549.jpg",
    polymerType: "PCR Impact Copolymer",
    grade: "High Impact Resistance",
    mfi: "MFI 10-12",
    purity: "99.6% Purity",
  },
  {
    name: "Amber Orange",
    hex: "#f97316",
    photo: "/Polymers-photos/IMG_1578.jpg",
    polymerType: "PCR PP Homopolymer",
    grade: "Uniform Thermal Stability",
    mfi: "MFI 11-13",
    purity: "99.8% Purity",
  },
  {
    name: "Deep Maroon",
    hex: "#7f1d1d",
    photo: "/Polymers-photos/IMG_1550.jpg",
    polymerType: "PCR PP Compound",
    grade: "Odor Neutralized • Deep Hue",
    mfi: "MFI 9-11",
    purity: "99.7% Purity",
  },
  {
    name: "Milky White",
    hex: "#f5f5f5",
    photo: "/Polymers-photos/IMG_1584.jpg",
    polymerType: "PCR Natural HDPE / PP",
    grade: "Near-Virgin Optical Clarity",
    mfi: "MFI 6-8",
    purity: "99.9% Purity",
  },
  {
    name: "Carbon Black",
    hex: "#1a1a1a",
    photo: "/Polymers-photos/IMG_1538.jpg",
    polymerType: "PCR HDPE & PPHP Black",
    grade: "UV Stabilized • Automotive Grade",
    mfi: "MFI 7-9",
    purity: "99.8% Purity",
  },
  {
    name: "Slate Cyan",
    hex: "#06b6d4",
    photo: "/Polymers-photos/IMG_1555.jpg",
    polymerType: "PCR Copolymer Compound",
    grade: "Rigid Packaging & Crate Grade",
    mfi: "MFI 12-15",
    purity: "99.7% Purity",
  },
  {
    name: "Golden Yellow",
    hex: "#eab308",
    photo: "/Polymers-photos/IMG_1567.jpg",
    polymerType: "PCR Custom Masterbatch",
    grade: "Melt Flow Consistency",
    mfi: "MFI 13-16",
    purity: "99.7% Purity",
  },
  {
    name: "Slate Grey",
    hex: "#64748b",
    photo: "/Polymers-photos/IMG_1536.jpg",
    polymerType: "PCR PPHP Neutral Grey",
    grade: "Balanced Mechanical Strength",
    mfi: "MFI 10-12",
    purity: "99.8% Purity",
  },
];

const AUTO_PLAY_INTERVAL = 3500; // 3.5 seconds (between 2 and 5 seconds)

export function PolymerPreviewCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeItem = polymerColorOptions[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % polymerColorOptions.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + polymerColorOptions.length) % polymerColorOptions.length);
  }, []);

  const selectColor = (index: number) => {
    setActiveIndex(index);
  };

  // Auto-play timer effect (changes photo every 3.5 seconds)
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, handleNext, activeIndex]);

  return (
    <div
      className="glass-strong relative overflow-hidden rounded-3xl p-4 shadow-2xl border border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CARD HEADER */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: activeItem.hex }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: activeItem.hex }}
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Polymer Colors & Materials
          </span>
          <span className="hidden sm:inline-block rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
            Live Stream
          </span>
        </div>

        {/* CONTROLS: PLAY/PAUSE */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause auto-rotation" : "Play auto-rotation"}
            title={isPlaying ? "Pause rotation" : "Resume rotation"}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-secondary/80 px-2.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span className="text-[11px]">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span className="text-[11px]">Play</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN DISPLAY CONTAINER */}
      <div className="relative h-[360px] sm:h-[400px] w-full overflow-hidden rounded-2xl bg-[#090e17] border border-white/5 shadow-inner">
        {/* PROGRESS BAR FOR 3.5s ROTATION */}
        {isPlaying && !isHovered && (
          <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10 overflow-hidden">
            <motion.div
              key={activeItem.name}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
              className="h-full"
              style={{ backgroundColor: activeItem.hex }}
            />
          </div>
        )}

        {/* PHOTO VIEW */}
        <div className="relative h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <img
                src={activeItem.photo}
                alt={`${activeItem.name} - ${activeItem.polymerType}`}
                className="h-full w-full object-cover"
                loading="eager"
              />
              {/* Vignette & gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* TOP COLOR BADGE */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10 text-white">
              <span
                className="h-2 w-2 rounded-full ring-1 ring-white/50"
                style={{ backgroundColor: activeItem.hex }}
              />
              {activeItem.name}
            </span>
          </div>

          {/* LEFT / RIGHT NAV ARROWS */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md border border-white/10 transition hover:bg-black/80 hover:text-white hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md border border-white/10 transition hover:bg-black/80 hover:text-white hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* BOTTOM INFO OVERLAY */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-black/75 p-3 backdrop-blur-md border border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{activeItem.polymerType}</div>
                    <div className="text-xs text-white/70 mt-0.5">{activeItem.grade}</div>
                  </div>
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-white/20 whitespace-nowrap"
                  >
                    <span>Full Gallery</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* SPEC TAGS */}
                <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[10px] text-white/80">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand" />
                    {activeItem.purity}
                  </span>
                  <span>•</span>
                  <span>{activeItem.mfi}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Quality Verified
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* COLOR PASSING / PAIRING SWATCHES */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {polymerColorOptions.map((s, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={s.name}
                aria-label={`Select ${s.name}`}
                title={s.name}
                onClick={() => selectColor(idx)}
                className={`relative h-7 w-7 rounded-full transition-all duration-300 ${
                  isActive
                    ? "scale-125 ring-2 ring-foreground ring-offset-2 ring-offset-background shadow-lg"
                    : "opacity-75 hover:opacity-100 hover:scale-110"
                }`}
                style={{ backgroundColor: s.hex }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ backgroundColor: s.hex }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Current Color Label */}
        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <span>Active Color:</span>
          <span className="font-semibold text-foreground">{activeItem.name}</span>
        </div>
      </div>
    </div>
  );
}
