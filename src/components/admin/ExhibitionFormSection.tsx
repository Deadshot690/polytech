import { useState } from "react";
import { Exhibition } from "@/lib/qr-config";
import { ExhibitionRegistrationForm } from "@/components/qr/ExhibitionRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  Smartphone,
  Monitor,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Save,
  Building2,
} from "lucide-react";

interface ExhibitionFormSectionProps {
  exhibitions: Exhibition[];
  activeExhibition: Exhibition;
  onSelectExhibition: (id: string) => void;
  onSaveExhibition: (exhibition: Exhibition) => void;
}

export function ExhibitionFormSection({
  exhibitions,
  activeExhibition,
  onSelectExhibition,
  onSaveExhibition,
}: ExhibitionFormSectionProps) {
  const [form, setForm] = useState<Exhibition>(activeExhibition);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [newProductInput, setNewProductInput] = useState("");

  const handleToggleActive = (checked: boolean) => {
    const updated = { ...form, formEnabled: checked };
    setForm(updated);
    onSaveExhibition(updated);
    toast.success(
      checked
        ? `Exhibition Form for "${form.name}" is now ACTIVE on public page`
        : `Exhibition Form for "${form.name}" is now INACTIVE (hidden) on public page`,
    );
  };

  const handleAddProduct = () => {
    const trimmed = newProductInput.trim();
    if (!trimmed) return;
    if (form.allowedProducts.includes(trimmed)) {
      toast.error("Product already exists in options");
      return;
    }
    const updated = { ...form, allowedProducts: [...form.allowedProducts, trimmed] };
    setForm(updated);
    setNewProductInput("");
  };

  const handleRemoveProduct = (prod: string) => {
    if (form.allowedProducts.length <= 1) {
      toast.error("At least one product option is required");
      return;
    }
    const updated = {
      ...form,
      allowedProducts: form.allowedProducts.filter((p) => p !== prod),
    };
    setForm(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveExhibition(form);
    toast.success(`Saved form settings for ${form.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Exhibition Form & Product Catalog Controls
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure attendee form visibility, heading narrative, and selectable polymer
            compounding products.
          </p>
        </div>

        {/* Exhibition Selector */}
        <div className="flex items-center gap-2 text-xs">
          <Label className="text-muted-foreground">Selected Event:</Label>
          <select
            value={activeExhibition.id}
            onChange={(e) => {
              const selected = exhibitions.find((ex) => ex.id === e.target.value);
              if (selected) {
                onSelectExhibition(selected.id);
                setForm(selected);
              }
            }}
            aria-label="Select exhibition to configure"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground font-semibold"
          >
            {exhibitions.map((exh) => (
              <option key={exh.id} value={exh.id}>
                {exh.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Form Configuration Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active / Inactive Status Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Public Form Status: {form.name}
                </span>
                <Badge variant={form.formEnabled ? "default" : "secondary"} className="text-xs">
                  {form.formEnabled ? "ACTIVE (Visible)" : "INACTIVE (Hidden)"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When enabled, the registration form appears beside the digital business card. When
                disabled, the form is completely hidden and the card expands.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="formStatusToggle" className="text-xs font-semibold cursor-pointer">
                {form.formEnabled ? "Active" : "Hidden"}
              </Label>
              <Switch
                id="formStatusToggle"
                checked={form.formEnabled}
                onCheckedChange={handleToggleActive}
              />
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Form Text & Product Offerings</CardTitle>
              <CardDescription className="text-xs">
                Customize titles and product chips displayed to attendees visiting this exhibition
                booth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="formHeading" className="text-xs font-semibold">
                    Form Heading
                  </Label>
                  <Input
                    id="formHeading"
                    value={form.formHeading}
                    onChange={(e) => setForm((f) => ({ ...f, formHeading: e.target.value }))}
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="formDescription" className="text-xs font-semibold">
                    Form Subtitle / Instructions
                  </Label>
                  <Textarea
                    id="formDescription"
                    rows={2}
                    value={form.formDescription}
                    onChange={(e) => setForm((f) => ({ ...f, formDescription: e.target.value }))}
                    className="text-xs"
                  />
                </div>

                {/* Products Pills Manager */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Interested Polymer Products Catalog</span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      {form.allowedProducts.length} options active
                    </span>
                  </Label>

                  <div className="flex flex-wrap gap-2">
                    {form.allowedProducts.map((prod) => (
                      <span
                        key={prod}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        {prod}
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(prod)}
                          className="hover:text-destructive transition-colors ml-0.5"
                          title="Remove option"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Product Option Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <Input
                      placeholder="Add polymer grade e.g. Glass-Filled PPCP..."
                      value={newProductInput}
                      onChange={(e) => setNewProductInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProduct();
                        }
                      }}
                      className="text-xs h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddProduct}
                      className="h-8 text-xs font-medium px-3 shrink-0"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add Grade
                    </Button>
                  </div>
                </div>

                {/* Form Fields Config */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label className="text-xs font-semibold">Active Form Fields</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "Full Name (Required)",
                      "Company Name (Required)",
                      "Mobile Number (Required)",
                      "Email Address (Required)",
                      "Country (Required)",
                      "Interested Products (Required)",
                      "Message / Requirement (Optional)",
                    ].map((field) => (
                      <div
                        key={field}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-secondary/30 p-2 text-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="btn-primary text-xs gap-1.5">
                    <Save className="h-4 w-4" />
                    Save Form Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Device Frame Preview */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Live Visitor Preview
            </span>

            {/* Device Switcher */}
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center gap-1 rounded px-2 py-1 ${
                  previewDevice === "desktop"
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Monitor className="h-3 w-3" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center gap-1 rounded px-2 py-1 ${
                  previewDevice === "mobile"
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                Mobile
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div
            className={`mx-auto rounded-3xl border-4 transition-all duration-300 ${
              previewDevice === "mobile"
                ? "max-w-[360px] border-slate-700 bg-slate-900/50 p-2 shadow-2xl"
                : "max-w-full border-border bg-card/60 p-1"
            }`}
          >
            {previewDevice === "mobile" && (
              <div className="mb-2 flex justify-center">
                <span className="h-3 w-16 rounded-full bg-slate-700" />
              </div>
            )}

            <div className="overflow-hidden rounded-2xl">
              <ExhibitionRegistrationForm
                settings={form}
                onSubmitSuccess={() => {
                  toast.info("Mock preview submission completed");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
