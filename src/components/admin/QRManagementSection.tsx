import { useState, useMemo } from "react";
import { Exhibition, QRPlacement, QRPlacementType } from "@/lib/qr-config";
import { QRCodeRenderer } from "@/components/qr/QRCodeRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  QrCode,
  Download,
  Copy,
  Printer,
  ExternalLink,
  Trash2,
  SlidersHorizontal,
  Check,
  Eye,
  Building2,
  Sparkles,
} from "lucide-react";

interface QRManagementSectionProps {
  placements: QRPlacement[];
  exhibitions: Exhibition[];
  placementMetrics: Array<{
    placementId: string;
    code: string;
    scans: number;
    uniqueVisitors: number;
    leads: number;
    conversionRate: number;
    lastScannedAt?: string;
  }>;
  onSavePlacement: (placement: QRPlacement) => void;
  onToggleActive: (id: string) => void;
  onDeletePlacement: (id: string) => void;
}

const PLACEMENT_TYPES: QRPlacementType[] = [
  "Tabletop",
  "Stall Backdrop",
  "Sample Bag",
  "Brochure",
  "Executive Lanyard",
  "General",
];

export function QRManagementSection({
  placements,
  exhibitions,
  placementMetrics,
  onSavePlacement,
  onToggleActive,
  onDeletePlacement,
}: QRManagementSectionProps) {
  const [selectedExhFilter, setSelectedExhFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePrintPlacement, setActivePrintPlacement] = useState<QRPlacement | null>(null);

  // New placement form state
  const [newForm, setNewForm] = useState<{
    code: string;
    name: string;
    exhibitionId: string;
    locationDescription: string;
    type: QRPlacementType;
    targetPath: string;
  }>({
    code: "",
    name: "",
    exhibitionId: exhibitions[0]?.id || "",
    locationDescription: "",
    type: "Tabletop",
    targetPath: "/qr-code",
  });

  const filteredPlacements = useMemo(() => {
    if (selectedExhFilter === "all") return placements;
    return placements.filter((p) => p.exhibitionId === selectedExhFilter);
  }, [placements, selectedExhFilter]);

  const getTrackingUrl = (placement: QRPlacement) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://qlumix.com";
    return `${origin}/r/${placement.code}`;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.code.trim()) {
      toast.error("Placement name and unique code are required");
      return;
    }

    const cleanCode = newForm.code
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-");

    // Check code duplication
    if (placements.some((p) => p.code.toLowerCase() === cleanCode)) {
      toast.error(`Code "${cleanCode}" is already in use. Please choose another.`);
      return;
    }

    const newPlacement: QRPlacement = {
      id: `qr-${cleanCode}-${Date.now().toString().slice(-4)}`,
      code: cleanCode,
      name: newForm.name.trim(),
      exhibitionId: newForm.exhibitionId,
      locationDescription: newForm.locationDescription.trim() || "Exhibition placement",
      type: newForm.type,
      targetPath: newForm.targetPath,
      active: true,
      createdAt: new Date().toISOString(),
    };

    onSavePlacement(newPlacement);
    toast.success(`Created QR Placement: ${newPlacement.name}`);
    setIsCreateModalOpen(false);
    setNewForm({
      code: "",
      name: "",
      exhibitionId: exhibitions[0]?.id || "",
      locationDescription: "",
      type: "Tabletop",
      targetPath: "/qr-code",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            QR Placements & Collateral Manager
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate and monitor individual QR codes for tabletop acrylic stands, booth walls,
            sample bags, and brochures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Exhibition Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <select
              value={selectedExhFilter}
              onChange={(e) => setSelectedExhFilter(e.target.value)}
              aria-label="Filter by exhibition"
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none"
            >
              <option value="all">All Exhibitions ({placements.length})</option>
              {exhibitions.map((exh) => (
                <option key={exh.id} value={exh.id}>
                  {exh.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create QR Button & Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="btn-primary rounded-xl text-xs font-semibold gap-1.5">
                <Plus className="h-4 w-4" />
                Generate New QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold">Create Trackable QR Code</DialogTitle>
                <DialogDescription className="text-xs">
                  Each QR code receives its own unique redirect tracking URL to measure scans
                  separately.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="qrName" className="text-xs font-semibold">
                    Placement Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="qrName"
                    placeholder="e.g. VIP Lounge Acrylic Stand"
                    value={newForm.name}
                    onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="qrCode" className="text-xs font-semibold">
                      Unique Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="qrCode"
                      placeholder="e.g. vip-lounge"
                      value={newForm.code}
                      onChange={(e) => setNewForm((f) => ({ ...f, code: e.target.value }))}
                      className="text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="qrType" className="text-xs font-semibold">
                      Placement Type
                    </Label>
                    <select
                      id="qrType"
                      value={newForm.type}
                      onChange={(e) =>
                        setNewForm((f) => ({ ...f, type: e.target.value as QRPlacementType }))
                      }
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs"
                    >
                      {PLACEMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qrExhibition" className="text-xs font-semibold">
                    Assign to Exhibition
                  </Label>
                  <select
                    id="qrExhibition"
                    value={newForm.exhibitionId}
                    onChange={(e) => setNewForm((f) => ({ ...f, exhibitionId: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs"
                  >
                    {exhibitions.map((exh) => (
                      <option key={exh.id} value={exh.id}>
                        {exh.name} ({exh.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qrTarget" className="text-xs font-semibold">
                    Target Destination
                  </Label>
                  <select
                    id="qrTarget"
                    value={newForm.targetPath}
                    onChange={(e) => setNewForm((f) => ({ ...f, targetPath: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs"
                  >
                    <option value="/qr-code">Public Portal (Business Card + Form)</option>
                    <option value="/business-card">Digital Business Card Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="qrLoc" className="text-xs font-semibold">
                    Location Notes
                  </Label>
                  <Input
                    id="qrLoc"
                    placeholder="e.g. Hall 3, Booth A-42 conference table"
                    value={newForm.locationDescription}
                    onChange={(e) =>
                      setNewForm((f) => ({ ...f, locationDescription: e.target.value }))
                    }
                    className="text-xs"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="btn-primary text-xs">
                    Create Placement
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid of QR Placement Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlacements.map((placement) => {
          const exh = exhibitions.find((e) => e.id === placement.exhibitionId);
          const metrics = placementMetrics.find((m) => m.placementId === placement.id) || {
            scans: 0,
            uniqueVisitors: 0,
            leads: 0,
            conversionRate: 0,
          };
          const trackingUrl = getTrackingUrl(placement);

          return (
            <Card
              key={placement.id}
              className={`shadow-sm flex flex-col justify-between transition-all ${
                placement.active ? "border-border/90" : "opacity-60 bg-muted/20"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {placement.type}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                        #{placement.code}
                      </span>
                    </div>
                    <CardTitle className="mt-1 text-sm font-bold truncate">
                      {placement.name}
                    </CardTitle>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{exh?.name || "Unassigned"}</span>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Switch
                      checked={placement.active}
                      onCheckedChange={() => onToggleActive(placement.id)}
                      aria-label="Toggle QR Active"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 flex flex-col items-center">
                {/* QR Code Container */}
                <div className="my-2 p-2 rounded-xl border border-border/80 bg-white shadow-sm flex flex-col items-center">
                  <QRCodeRenderer
                    value={trackingUrl}
                    size={140}
                    title=""
                    subtitle=""
                    showActions={false}
                  />
                  <div className="mt-1 text-[10px] font-mono text-slate-700 font-semibold truncate max-w-[170px]">
                    /r/{placement.code}
                  </div>
                </div>

                {/* Per-Placement Metric Strip */}
                <div className="mt-2 w-full grid grid-cols-3 gap-1 rounded-xl bg-secondary/50 p-2 text-center text-xs">
                  <div>
                    <div className="font-mono font-bold text-foreground">
                      {metrics.scans.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Scans</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-foreground">
                      {metrics.uniqueVisitors.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Unique</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {metrics.conversionRate}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">Conv.</div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-muted-foreground truncate w-full text-center">
                  📍 {placement.locationDescription}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/40 flex items-center justify-between gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivePrintPlacement(placement)}
                  className="rounded-lg text-xs h-7 px-2.5 font-medium"
                >
                  <Printer className="mr-1 h-3 w-3" />
                  Print Stand
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-lg text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                    title="Test Redirect"
                  >
                    <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete placement "${placement.name}"?`)) {
                        onDeletePlacement(placement.id);
                        toast.success("Placement deleted");
                      }
                    }}
                    className="rounded-lg text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Standee Print Modal */}
      {activePrintPlacement && (
        <Dialog
          open={!!activePrintPlacement}
          onOpenChange={(open) => !open && setActivePrintPlacement(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Tabletop Acrylic Stand Layout
              </DialogTitle>
              <DialogDescription className="text-xs">
                Formatted preview ready for printing or exporting as high-res collateral.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border-2 border-dashed border-border p-6 bg-gradient-to-b from-card to-secondary/30 text-center my-2">
              <div className="chip bg-blue-500/10 text-blue-600 border-blue-400/30 text-xs py-0.5 px-3 mb-2">
                {activePrintPlacement.type} Collateral
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Qlumix Polymers</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {exhibitions.find((e) => e.id === activePrintPlacement.exhibitionId)?.name}
              </p>

              <div className="my-4 flex justify-center">
                <QRCodeRenderer
                  value={getTrackingUrl(activePrintPlacement)}
                  size={170}
                  showActions={true}
                  title=""
                  subtitle=""
                />
              </div>

              <div className="font-mono text-xs text-primary font-bold">
                {getTrackingUrl(activePrintPlacement)}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Scan with any smartphone camera to view digital business card & register
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePrintPlacement(null)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="btn-primary text-xs gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Standee Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
