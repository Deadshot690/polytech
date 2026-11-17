import { useMemo, useRef, useState } from "react";
import { generateQRMatrix } from "@/lib/qr-generator";
import { toast } from "sonner";
import { Copy, Download, Printer, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeRendererProps {
  value: string;
  size?: number;
  className?: string;
  showActions?: boolean;
  title?: string;
  subtitle?: string;
}

export function QRCodeRenderer({
  value,
  size = 220,
  className = "",
  showActions = false,
  title = "Scan to Connect",
  subtitle = "Opens Digital Business Card",
}: QRCodeRendererProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("192.168."));

  const targetVisitUrl = useMemo(() => {
    if (!isLocalDev) return value;
    try {
      const url = new URL(value);
      return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return value;
    }
  }, [value, isLocalDev]);

  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(value);
    } catch (e) {
      console.error("QR Generation error:", e);
      return [];
    }
  }, [value]);

  const moduleCount = matrix.length;
  const margin = 3;
  const totalModules = moduleCount + margin * 2;

  const copyUrl = async () => {
    try {
      const textToCopy = isLocalDev ? targetVisitUrl : value;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Destination URL copied to clipboard!", {
        description: textToCopy,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  const downloadPNG = () => {
    if (!canvasRef.current || moduleCount === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High resolution output (1200px)
    const exportDim = 1200;
    canvas.width = exportDim;
    canvas.height = exportDim;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, exportDim, exportDim);

    const cellSize = exportDim / totalModules;
    ctx.fillStyle = "#0c1524";

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;
          ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
        }
      }
    }

    // Draw center brand emblem
    const centerDim = exportDim * 0.22;
    const centerPos = (exportDim - centerDim) / 2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(centerPos, centerPos, centerDim, centerDim, 20);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#0055ff";
    ctx.stroke();

    // Text in center
    ctx.fillStyle = "#0c1524";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("QLUMIX", exportDim / 2, exportDim / 2);

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qlumix-qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("High-resolution QR code downloaded (PNG)!");
  };

  const downloadSVG = () => {
    if (moduleCount === 0) return;
    const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalModules} ${totalModules}" width="1000" height="1000" shape-rendering="crispEdges">
  <rect width="${totalModules}" height="${totalModules}" fill="#ffffff" />
  ${matrix
    .map((row, r) =>
      row
        .map((cell, c) =>
          cell
            ? `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" fill="#0c1524" />`
            : "",
        )
        .join(""),
    )
    .join("")}
  <rect x="${totalModules / 2 - 3.2}" y="${totalModules / 2 - 3.2}" width="6.4" height="6.4" fill="#ffffff" rx="0.8" stroke="#0055ff" stroke-width="0.3" />
  <text x="${totalModules / 2}" y="${totalModules / 2 + 0.8}" fill="#0c1524" font-size="1.8" font-weight="bold" text-anchor="middle" font-family="sans-serif">Q</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qlumix-qr-vector-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Scalable vector QR code downloaded (SVG)!");
  };

  const printQrCard = () => {
    window.print();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Hidden canvas for high-res PNG export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* QR Code Container */}
      <div className="relative rounded-2xl border border-border bg-white p-4 shadow-xl transition-transform hover:scale-[1.01]">
        <svg
          viewBox={`0 0 ${totalModules} ${totalModules}`}
          width={size}
          height={size}
          className="shape-rendering-crispEdges block"
          style={{ imageRendering: "pixelated" }}
        >
          {/* Background */}
          <rect width={totalModules} height={totalModules} fill="#ffffff" rx={2} />

          {/* Modules */}
          {matrix.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c + margin}
                  y={r + margin}
                  width={1}
                  height={1}
                  fill="#0c1524"
                />
              );
            }),
          )}

          {/* Central subtle logo badge */}
          <rect
            x={totalModules / 2 - 3.2}
            y={totalModules / 2 - 3.2}
            width={6.4}
            height={6.4}
            fill="#ffffff"
            rx={0.8}
            stroke="#0055ff"
            strokeWidth={0.3}
          />
          <text
            x={totalModules / 2}
            y={totalModules / 2 + 0.8}
            fill="#0c1524"
            fontSize="1.8"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Q
          </text>
        </svg>
      </div>

      {title && (
        <div className="mt-4 text-center">
          <div className="font-display text-base font-semibold text-foreground">{title}</div>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <span>{value}</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPNG}
            className="rounded-full text-xs font-medium"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download PNG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={downloadSVG}
            className="rounded-full text-xs font-medium"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download SVG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyUrl}
            className="rounded-full text-xs font-medium"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy URL
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={printQrCard}
            className="rounded-full text-xs font-medium"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Print Card
          </Button>

          <Button variant="ghost" size="sm" asChild className="rounded-full text-xs font-medium">
            <a href={targetVisitUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Visit URL {isLocalDev ? "(Local Preview)" : ""}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
