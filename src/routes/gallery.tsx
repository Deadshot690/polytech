import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";
import { galleryItems, type GalleryItem } from "@/data/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Polymer Gallery — Kohinoor Polytech" },
      {
        name: "description",
        content:
          "Explore authentic photographs of our PCR Polypropylene, HDPE, and custom engineered plastic granules.",
      },
      { property: "og:title", content: "Polymer Gallery — Kohinoor Polytech" },
      {
        property: "og:description",
        content:
          "Explore authentic photographs of our PCR Polypropylene, HDPE, and custom engineered plastic granules.",
      },
    ],
  }),
  component: Gallery,
});

export function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const categories = ["All", "Green", "Silver", "Dark Grey", "Black", "Natural", "Amber", "Blue"];

  const filtered = galleryItems.filter((item) => {
    const matchesCat = category === "All" || item.category === category;
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase()) ||
      item.filename.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeItem: GalleryItem | null =
    selectedIdx !== null ? (filtered[selectedIdx] ?? null) : null;

  const handlePrev = useCallback(() => {
    if (selectedIdx === null || filtered.length === 0) return;
    setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : filtered.length - 1));
  }, [selectedIdx, filtered.length]);

  const handleNext = useCallback(() => {
    if (selectedIdx === null || filtered.length === 0) return;
    setSelectedIdx((prev) => (prev! < filtered.length - 1 ? prev! + 1 : 0));
  }, [selectedIdx, filtered.length]);

  const handleClose = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIdx, handleClose, handlePrev, handleNext]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIdx]);

  return (
    <div className="relative min-h-screen">
      <PageHero
        eyebrow="Polymer Gallery"
        title="Inside our granule production."
        subtitle="Explore authentic photographs of our Post-Consumer Recycled (PCR) polymers, masterbatch shades, and custom engineered granules produced at our plant."
      />

      <Section>
        {/* Controls: Search & Category Filter Pills */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const count =
                c === "All"
                  ? galleryItems.length
                  : galleryItems.filter((i) => i.category === c).length;
              if (count === 0 && c !== "All") return null;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setSelectedIdx(null);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    category === c
                      ? "btn-primary shadow-md shadow-brand/20"
                      : "border border-border/70 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {c} <span className="opacity-60 font-normal">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIdx(null);
              }}
              placeholder="Search polymer or shade..."
              className="w-full rounded-full border border-border bg-card/70 py-2 pl-9 pr-4 text-xs text-foreground outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item, idx) => (
            <Reveal key={item.id} delay={(idx % 10) * 0.03}>
              <div
                onClick={() => setSelectedIdx(idx)}
                className="glass card-lift group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-border/60 transition-all duration-300 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10"
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />

                {/* Top Badge */}
                <div className="absolute left-3 top-3 z-10">
                  <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Center Hover Zoom Icon */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 transition-transform duration-300 group-hover:scale-110">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>

                {/* Bottom Title Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 pt-8 text-left">
                  <div className="font-display text-sm font-semibold text-white group-hover:text-brand-cyan transition-colors">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-300">{item.category} Polymer</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass rounded-3xl p-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
            <h3 className="mt-4 text-lg font-semibold">No polymer photos found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="btn-primary mt-6"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 backdrop-blur-md sm:p-6"
            onClick={handleClose}
          >
            {/* Top Bar */}
            <div
              className="relative z-10 flex w-full items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="chip text-xs">
                  {selectedIdx + 1} / {filtered.length}
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-slate-400">{activeItem.category} Polymer</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeItem.src}
                  target="_blank"
                  rel="noreferrer"
                  title="Open full resolution"
                  className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close lightbox"
                  className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20 hover:text-rose-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Stage: Image & Left / Right Arrows */}
            <div
              className="relative my-auto flex h-full w-full items-center justify-center overflow-hidden py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-brand sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex max-h-[75vh] max-w-[85vw] items-center justify-center"
              >
                <img
                  src={activeItem.src}
                  alt={activeItem.title}
                  className="max-h-[75vh] max-w-[85vw] rounded-2xl border border-white/15 object-contain shadow-2xl shadow-black/80"
                />
              </motion.div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-brand sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Ribbon */}
            <div
              className="relative z-10 mx-auto flex max-w-2xl gap-2 overflow-x-auto py-2 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    idx === selectedIdx
                      ? "border-brand scale-105 shadow-md shadow-brand/40"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
