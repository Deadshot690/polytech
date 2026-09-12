import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand) 40%, transparent), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand-green) 35%, transparent), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {eyebrow && <span className="chip mb-5">{eyebrow}</span>}
          <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 text-lg text-muted-foreground md:text-xl">{subtitle}</p>}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </div>
  );
}
