import { useState, useEffect, useMemo } from "react";
import {
  ExhibitionFormSettings,
  FieldRequirement,
  FormFieldsConfig,
  ProductOption,
} from "@/lib/qr-config";
import { ExhibitionRegistrationForm } from "@/components/qr/ExhibitionRegistrationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  Smartphone,
  Monitor,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Layers,
  HelpCircle,
} from "lucide-react";

interface ExhibitionFormSectionProps {
  formSettings: ExhibitionFormSettings;
  onUpdateFormSettings: (patch: Partial<ExhibitionFormSettings>) => void;
}

const FIELD_LABELS: Record<keyof FormFieldsConfig, { label: string; description: string }> = {
  fullName: {
    label: "Full Name",
    description: "Visitor or delegate full legal/professional name",
  },
  companyName: {
    label: "Company Name",
    description: "Organization, plastic processor, or brand name",
  },
  mobileNumber: {
    label: "Mobile Number",
    description: "Direct phone number for WhatsApp and callback",
  },
  emailAddress: {
    label: "Email Address",
    description: "Official business email for TDS and sample quotes",
  },
  country: {
    label: "Country",
    description: "Dropdown of international and domestic markets",
  },
  interestedProducts: {
    label: "Interested Products",
    description: "Multi-select chips for polymer grades and compounds",
  },
  message: {
    label: "Message / Requirement",
    description: "Open text requirement, annual tonnage, application",
  },
};

export function ExhibitionFormSection({
  formSettings,
  onUpdateFormSettings,
}: ExhibitionFormSectionProps) {
  const [form, setForm] = useState<ExhibitionFormSettings>(formSettings);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [newProductName, setNewProductName] = useState("");

  // Sync state if external changes happen
  useEffect(() => {
    setForm(formSettings);
  }, [formSettings]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(formSettings);
  }, [form, formSettings]);

  const handleMasterToggle = (checked: boolean) => {
    const next = { ...form, formEnabled: checked };
    setForm(next);
    onUpdateFormSettings({ formEnabled: checked });
    toast.success(
      checked
        ? "Exhibition Form is now ACTIVE (Visible on /qr-code)"
        : "Exhibition Form is now INACTIVE (Hidden on /qr-code, Card expanded)",
    );
  };

  const handleFieldRequirementChange = (
    field: keyof FormFieldsConfig,
    requirement: FieldRequirement,
  ) => {
    setForm((prev) => ({
      ...prev,
      fieldsConfig: {
        ...prev.fieldsConfig,
        [field]: requirement,
      },
    }));
  };

  const handleAddProduct = () => {
    const trimmed = newProductName.trim();
    if (!trimmed) return;
    if (form.allowedProducts.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Product name already exists in catalog");
      return;
    }

    const newProd: ProductOption = {
      id: `prod-${Date.now()}`,
      name: trimmed,
      enabled: true,
    };

    setForm((prev) => ({
      ...prev,
      allowedProducts: [...prev.allowedProducts, newProd],
    }));
    setNewProductName("");
    toast.success(`Added product "${trimmed}"`);
  };

  const handleToggleProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      allowedProducts: prev.allowedProducts.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p,
      ),
    }));
  };

  const handleDeleteProduct = (id: string) => {
    if (form.allowedProducts.length <= 1) {
      toast.error("At least one product option must remain");
      return;
    }
    setForm((prev) => ({
      ...prev,
      allowedProducts: prev.allowedProducts.filter((p) => p.id !== id),
    }));
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateFormSettings(form);
    toast.success("Exhibition form settings saved successfully!");
  };

  const handleReset = () => {
    setForm(formSettings);
    toast.info("Reverted unsaved form edits");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Exhibition Form Settings
            </h2>
            {hasChanges && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved Edits
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage public visitor registration form visibility, copy, required fields, and polymer
            products.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Discard</span>
            </Button>
          )}

          <Button
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className="btn-primary rounded-xl font-semibold shadow-md gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form Settings Cards */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Master Form Status Toggle */}
          <Card
            className={`rounded-2xl border transition-all duration-200 ${
              form.formEnabled
                ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                : "border-border/70 bg-secondary/20"
            }`}
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-3 w-3 rounded-full ${
                      form.formEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                    }`}
                  />
                  <CardTitle className="text-base font-bold">
                    {form.formEnabled
                      ? "Form Active — Visible to Visitors"
                      : "Form Inactive — Hidden on Public Portal"}
                  </CardTitle>
                </div>

                <Switch
                  checked={form.formEnabled}
                  onCheckedChange={handleMasterToggle}
                  aria-label="Toggle exhibition form visibility"
                />
              </div>

              <CardDescription className="text-xs pt-1">
                {form.formEnabled
                  ? "Visitors accessing /qr-code see the balanced two-column layout with both the digital card and the visitor registration form."
                  : "The registration form is completely hidden from public visitors. The Digital Business Card automatically expands to full width and centers."}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2: Form Content & Narrative */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Form Content & Copy</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Customize titles, narrative descriptions, button labels, and feedback messages.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="formHeading" className="text-xs font-semibold">
                  Form Heading
                </Label>
                <Input
                  id="formHeading"
                  value={form.formHeading}
                  onChange={(e) => setForm((prev) => ({ ...prev, formHeading: e.target.value }))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="formDescription" className="text-xs font-semibold">
                  Form Subtitle / Narrative
                </Label>
                <Textarea
                  id="formDescription"
                  rows={2}
                  value={form.formDescription}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, formDescription: e.target.value }))
                  }
                  className="text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="submitButtonLabel" className="text-xs font-semibold">
                    Submit Button Text
                  </Label>
                  <Input
                    id="submitButtonLabel"
                    value={form.submitButtonLabel}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, submitButtonLabel: e.target.value }))
                    }
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="successMessage" className="text-xs font-semibold">
                    Success Toast Message
                  </Label>
                  <Input
                    id="successMessage"
                    value={form.successMessage}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, successMessage: e.target.value }))
                    }
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Form Fields Configurator (Required / Optional / Disabled) */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Field Requirement Controls</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Control which fields are required, optional, or disabled (hidden) for visitors.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              <div className="divide-y divide-border/60">
                {(Object.keys(form.fieldsConfig) as Array<keyof FormFieldsConfig>).map(
                  (fieldKey) => {
                    const meta = FIELD_LABELS[fieldKey];
                    const currentVal = form.fieldsConfig[fieldKey];

                    return (
                      <div
                        key={fieldKey}
                        className="py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <span>{meta.label}</span>
                            {currentVal === "required" && (
                              <span className="text-[10px] text-destructive font-semibold">*</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{meta.description}</p>
                        </div>

                        {/* Segmented Pill Control */}
                        <div className="inline-flex rounded-xl bg-secondary/50 p-1 border border-border/60">
                          <button
                            type="button"
                            onClick={() => handleFieldRequirementChange(fieldKey, "required")}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                              currentVal === "required"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Required
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldRequirementChange(fieldKey, "optional")}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                              currentVal === "optional"
                                ? "bg-blue-600/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Optional
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldRequirementChange(fieldKey, "disabled")}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                              currentVal === "disabled"
                                ? "bg-muted text-muted-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Disabled
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Product Interest Options Manager */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Package className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Product Interest Catalog</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Selectable polymer grades and compound solutions displayed as selection chips.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              {/* Add New Product Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. PCR HDPE Blow Moulding Grade"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddProduct();
                    }
                  }}
                  className="h-9 text-xs"
                />
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  className="btn-primary h-9 rounded-xl px-3 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Product</span>
                </Button>
              </div>

              {/* Product Items List */}
              <div className="space-y-2 pt-1">
                {form.allowedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-xs transition-all hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                      <Switch
                        checked={prod.enabled}
                        onCheckedChange={() => handleToggleProduct(prod.id)}
                        aria-label={`Toggle ${prod.name}`}
                      />
                      <span
                        className={`font-medium truncate ${
                          prod.enabled ? "text-foreground" : "text-muted-foreground line-through"
                        }`}
                      >
                        {prod.name}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                      title="Remove product option"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Google Sheets & Webhook Integration */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold">Google Sheets Integration</CardTitle>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    form.googleSheetsWebhookUrl
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-secondary text-muted-foreground border-border/60"
                  }`}
                >
                  {form.googleSheetsWebhookUrl ? "Webhook Connected" : "Local Mock Mode"}
                </span>
              </div>
              <CardDescription className="text-xs">
                Forward visitor submissions directly to a Google Sheets Apps Script endpoint or
                webhook.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="googleSheetsWebhook" className="text-xs font-semibold">
                  Google Apps Script / Webhook URL
                </Label>
                <Input
                  id="googleSheetsWebhook"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={form.googleSheetsWebhookUrl || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, googleSheetsWebhookUrl: e.target.value }))
                  }
                  className="h-9 text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  {form.googleSheetsWebhookUrl
                    ? "Active: Form submissions will be posted directly to your Google Sheet webhook."
                    : "When left empty, submissions are logged locally for frontend demonstration without claiming fake cloud storage."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {hasChanges && (
              <span className="text-xs text-muted-foreground">You have unsaved form edits</span>
            )}
            <Button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className="btn-primary rounded-xl font-semibold shadow-md px-6 gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Exhibition Form</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Live Form Preview */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live Form Preview
              </span>
            </div>

            {/* Device Viewport Toggle */}
            <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1 border border-border/60 text-[11px]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="h-3 w-3" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Device Mock Frame */}
          {previewDevice === "mobile" ? (
            <div className="mx-auto max-w-[375px] rounded-[36px] border-4 border-slate-800 bg-background p-3 shadow-2xl overflow-hidden">
              <div className="mx-auto h-4 w-28 rounded-full bg-slate-800 mb-3" />
              <div className="max-h-[640px] overflow-y-auto pr-1">
                <ExhibitionRegistrationForm settings={form} isPreview={true} />
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ExhibitionRegistrationForm settings={form} isPreview={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
