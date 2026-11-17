import { useState, useMemo } from "react";
import { QRPlacement, QRPlacementType } from "@/lib/qr-config";
import { QRCodeRenderer } from "@/components/qr/QRCodeRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Plus,
  QrCode,
  Download,
  Copy,
  Printer,
  ExternalLink,
  Trash2,
  Edit2,
  Search,
  Filter,
  Check,
  Sparkles,
  MapPin,
  Globe,
} from "lucide-react";

interface QRManagementSectionProps {
  placements: QRPlacement[];
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

const TYPE_COLORS: Record<QRPlacementType, string> = {
  Tabletop: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Stall Backdrop": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "Sample Bag": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Brochure: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Executive Lanyard": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  General: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

export function QRManagementSection({
  placements,
  onSavePlacement,
  onToggleActive,
  onDeletePlacement,
}: QRManagementSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<QRPlacement | null>(null);
  const [deletingPlacementId, setDeletingPlacementId] = useState<string | null>(null);
  const [printPlacement, setPrintPlacement] = useState<QRPlacement | null>(null);

  // New placement form state
  const [newForm, setNewForm] = useState({
    name: "",
    code: "",
    type: "Tabletop" as QRPlacementType,
    destinationUrl: "https://qlumix.com/business-profile",
    description: "",
    active: true,
  });

  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("192.168."));

  const getTrackingUrl = (placement: QRPlacement) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://qlumix.com";
    return `${origin}/r/${placement.code}`;
  };

  const getLocalDestinationUrl = (destUrl: string) => {
    if (!isLocalDev) return destUrl;
    try {
      const parsed = new URL(destUrl);
      return `${window.location.origin}${parsed.pathname}${parsed.search}`;
    } catch {
      return destUrl;
    }
  };

  const filteredPlacements = useMemo(() => {
    return placements.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [placements, searchQuery, typeFilter]);

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 16);
    setNewForm((prev) => ({
      ...prev,
      name: val,
      code: prev.code ? prev.code : slug,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.code.trim()) {
      toast.error("Please enter a placement name and unique tracking code");
      return;
    }

    const cleanCode = newForm.code
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-");

    if (placements.some((p) => p.code.toLowerCase() === cleanCode)) {
      toast.error(`Code "${cleanCode}" is already in use. Please choose a unique code.`);
      return;
    }

    const newPlacement: QRPlacement = {
      id: `qr-${Date.now()}`,
      code: cleanCode,
      name: newForm.name.trim(),
      type: newForm.type,
      destinationUrl: newForm.destinationUrl.trim() || "https://qlumix.com/business-profile",
      description: newForm.description.trim(),
      active: newForm.active,
      createdAt: new Date().toISOString(),
    };

    onSavePlacement(newPlacement);
    toast.success(`QR placement "${newPlacement.name}" generated successfully!`);
    setIsCreateOpen(false);
    setNewForm({
      name: "",
      code: "",
      type: "Tabletop",
      destinationUrl: "https://qlumix.com/business-profile",
      description: "",
      active: true,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlacement) return;

    if (!editingPlacement.name.trim()) {
      toast.error("Placement name is required");
      return;
    }

    onSavePlacement(editingPlacement);
    toast.success(`Updated "${editingPlacement.name}"`);
    setEditingPlacement(null);
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tracking URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            QR Code Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate, customize, and deploy physical & digital exhibition QR placements.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary rounded-xl font-semibold shadow-md cursor-pointer inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New QR</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search placements by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl border-border/70 bg-background/80"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All ({placements.length})
          </button>
          {PLACEMENT_TYPES.map((type) => {
            const count = placements.filter((p) => p.type === type).length;
            if (count === 0 && typeFilter !== type) return null;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  typeFilter === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* QR Placement Cards Grid */}
      {filteredPlacements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
            <QrCode className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-semibold text-foreground">
            No QR Placements Found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {searchQuery || typeFilter !== "all"
              ? "No placements match your search filters. Try clearing filters or searching for another keyword."
              : "Generate your first QR code placement for exhibition tabletop acrylics, brochures, or booths."}
          </p>
          {(searchQuery || typeFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}
              className="mt-4 rounded-xl text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlacements.map((placement) => {
            const trackingUrl = getTrackingUrl(placement);
            const colorClass = TYPE_COLORS[placement.type] || TYPE_COLORS.General;

            return (
              <Card
                key={placement.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                  placement.active
                    ? "border-border/80 bg-card/90"
                    : "border-border/40 bg-card/40 opacity-70"
                }`}
              >
                {/* Top Card Bar */}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${colorClass}`}
                    >
                      {placement.type}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-2 w-2 rounded-full ${
                          placement.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                      <Switch
                        checked={placement.active}
                        onCheckedChange={() => onToggleActive(placement.id)}
                        aria-label="Toggle active status"
                      />
                    </div>
                  </div>

                  <CardTitle className="mt-2 text-base font-bold tracking-tight text-foreground line-clamp-1">
                    {placement.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {placement.description || "Exhibition booth collateral scan placement."}
                  </CardDescription>
                </CardHeader>

                {/* QR Code Presentation */}
                <CardContent className="p-4 pt-1 flex flex-col items-center">
                  <div className="rounded-xl border border-border/60 bg-white p-3 shadow-inner my-2">
                    <QRCodeRenderer value={trackingUrl} size={150} />
                  </div>

                  {/* Destination & Tracking URL Pill */}
                  <div className="mt-2 w-full rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-center space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono text-primary font-semibold">
                        /r/{placement.code}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyUrl(trackingUrl)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Copy Tracking URL"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy URL</span>
                        </button>
                        <span>•</span>
                        <a
                          href={getLocalDestinationUrl(placement.destinationUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                          title="Open destination page in new tab"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Visit Card</span>
                        </a>
                      </div>
                    </div>
                    <p
                      className="truncate text-[10px] text-muted-foreground text-left"
                      title={placement.destinationUrl}
                    >
                      Resolves to:{" "}
                      {isLocalDev
                        ? getLocalDestinationUrl(placement.destinationUrl)
                        : placement.destinationUrl}
                    </p>
                  </div>
                </CardContent>

                {/* Actions Footer */}
                <CardFooter className="border-t border-border/60 p-3 flex items-center justify-between gap-1 bg-secondary/10">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrintPlacement(placement)}
                      className="h-8 rounded-xl px-2.5 text-xs font-semibold gap-1.5 hover:bg-secondary cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5 text-primary" />
                      <span>Print</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPlacement(placement)}
                      className="h-8 rounded-xl px-2.5 text-xs font-semibold gap-1.5 hover:bg-secondary cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Edit</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingPlacementId(placement.id)}
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Delete Placement"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL 01: Create New QR Code */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Generate New QR Placement
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure a dedicated tracking QR for booth stands, sample bags, or catalogs.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="qr-name" className="text-xs font-semibold">
                Placement Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="qr-name"
                placeholder="e.g. VIP Lounge Acrylic Standee"
                value={newForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qr-type" className="text-xs font-semibold">
                  Placement Type
                </Label>
                <select
                  id="qr-type"
                  value={newForm.type}
                  onChange={(e) =>
                    setNewForm((prev) => ({ ...prev, type: e.target.value as QRPlacementType }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {PLACEMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qr-code" className="text-xs font-semibold">
                  Tracking Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="qr-code"
                  placeholder="e.g. vip-stand"
                  value={newForm.code}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, code: e.target.value }))}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-destination" className="text-xs font-semibold">
                Destination URL
              </Label>
              <Input
                id="qr-destination"
                placeholder="https://qlumix.com/business-profile"
                value={newForm.destinationUrl}
                onChange={(e) =>
                  setNewForm((prev) => ({ ...prev, destinationUrl: e.target.value }))
                }
                className="h-9 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Visitors scanning the QR code will be redirected to this target address.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-desc" className="text-xs font-semibold">
                Description / Location Notes
              </Label>
              <Textarea
                id="qr-desc"
                rows={2}
                placeholder="e.g. Placed on meeting desk 2 in Hall 3 VIP Pavilion"
                value={newForm.description}
                onChange={(e) => setNewForm((prev) => ({ ...prev, description: e.target.value }))}
                className="text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 p-2.5">
              <div>
                <Label className="text-xs font-semibold">Active Status</Label>
                <p className="text-[10px] text-muted-foreground">
                  Allow redirect and track scans immediately
                </p>
              </div>
              <Switch
                checked={newForm.active}
                onCheckedChange={(checked) => setNewForm((prev) => ({ ...prev, active: checked }))}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="btn-primary text-xs font-semibold">
                Generate QR Placement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 02: Edit QR Placement */}
      <Dialog
        open={Boolean(editingPlacement)}
        onOpenChange={(open) => !open && setEditingPlacement(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              Edit QR Placement
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update placement configuration, destination, or status.
            </DialogDescription>
          </DialogHeader>

          {editingPlacement && (
            <form onSubmit={handleEditSubmit} className="space-y-3.5 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold">
                  Placement Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={editingPlacement.name}
                  onChange={(e) =>
                    setEditingPlacement((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-type" className="text-xs font-semibold">
                  Placement Type
                </Label>
                <select
                  id="edit-type"
                  value={editingPlacement.type}
                  onChange={(e) =>
                    setEditingPlacement((prev) =>
                      prev ? { ...prev, type: e.target.value as QRPlacementType } : null,
                    )
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {PLACEMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-destination" className="text-xs font-semibold">
                  Destination URL
                </Label>
                <Input
                  id="edit-destination"
                  value={editingPlacement.destinationUrl}
                  onChange={(e) =>
                    setEditingPlacement((prev) =>
                      prev ? { ...prev, destinationUrl: e.target.value } : null,
                    )
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-desc" className="text-xs font-semibold">
                  Description / Location Notes
                </Label>
                <Textarea
                  id="edit-desc"
                  rows={2}
                  value={editingPlacement.description}
                  onChange={(e) =>
                    setEditingPlacement((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                  className="text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 p-2.5">
                <div>
                  <Label className="text-xs font-semibold">Active Status</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Enable or disable this QR placement
                  </p>
                </div>
                <Switch
                  checked={editingPlacement.active}
                  onCheckedChange={(checked) =>
                    setEditingPlacement((prev) => (prev ? { ...prev, active: checked } : null))
                  }
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPlacement(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="btn-primary text-xs font-semibold">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 03: Print Tabletop Standee / Collateral Card */}
      <Dialog
        open={Boolean(printPlacement)}
        onOpenChange={(open) => !open && setPrintPlacement(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              Print Tabletop Collateral Stand
            </DialogTitle>
            <DialogDescription className="text-xs">
              Acrylic tabletop display card formatted for standard exhibition sign stands.
            </DialogDescription>
          </DialogHeader>

          {printPlacement && (
            <div className="space-y-4">
              {/* Standee Mock Container */}
              <div
                id="printable-standee-card"
                className="rounded-2xl border-2 border-border bg-slate-950 text-white p-6 text-center shadow-2xl relative overflow-hidden"
              >
                {/* Decorative border glow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                    {printPlacement.type} Standee
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-tight text-white">Qlumix</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Mohsin Memon • Founder & CEO
                </p>

                {/* Centered QR */}
                <div className="my-5 inline-block rounded-2xl bg-white p-4 shadow-xl">
                  <QRCodeRenderer
                    value={getTrackingUrl(printPlacement)}
                    size={200}
                    showActions={false}
                  />
                </div>

                <p className="text-xs font-semibold text-slate-200">Scan with your phone camera</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Save digital business card & register for polymer samples
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-cyan-400/80">
                  {getTrackingUrl(printPlacement)}
                </div>
              </div>

              {/* Action Buttons inside modal */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrintPlacement(null)}
                  className="text-xs"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const printWindow = window.open("", "_blank");
                      if (printWindow) {
                        const standeeHtml =
                          document.getElementById("printable-standee-card")?.innerHTML;
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Qlumix Tabletop Stand - ${printPlacement.name}</title>
                              <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fff; }
                                .card { width: 340px; padding: 28px; border-radius: 20px; text-align: center; border: 2px solid #0f172a; background: #0f172a; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
                                h3 { margin: 0; font-size: 22px; font-weight: 700; color: #fff; }
                                p { margin: 4px 0; font-size: 13px; color: #94a3b8; }
                                .qr-box { background: #fff; padding: 16px; border-radius: 16px; display: inline-block; margin: 16px 0; }
                                .footer { font-family: monospace; font-size: 11px; color: #38bdf8; margin-top: 12px; }
                                @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                              </style>
                            </head>
                            <body>
                              <div class="card">
                                ${standeeHtml}
                              </div>
                              <script>window.onload = function() { window.print(); window.close(); }</script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="btn-primary text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Standee</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Placement */}
      <AlertDialog
        open={Boolean(deletingPlacementId)}
        onOpenChange={(open) => !open && setDeletingPlacementId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Placement?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this placement? Any printed QR codes pointing to this
              slug will no longer resolve.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingPlacementId) {
                  onDeletePlacement(deletingPlacementId);
                  toast.success("QR placement removed");
                  setDeletingPlacementId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
