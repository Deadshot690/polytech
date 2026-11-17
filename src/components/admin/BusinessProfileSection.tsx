import { useState, useEffect, useMemo } from "react";
import {
  BusinessProfile,
  DEFAULT_PROFILE,
  downloadVCard,
  downloadBusinessCardPDF,
} from "@/lib/qr-config";
import { DigitalBusinessCard } from "@/components/qr/DigitalBusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Building,
  Save,
  Download,
  RotateCcw,
  User,
  Phone,
  Mail,
  MapPin,
  Share2,
  Sparkles,
  Eye,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface BusinessProfileSectionProps {
  profile: BusinessProfile;
  onUpdateProfile: (patch: Partial<BusinessProfile>) => void;
}

export function BusinessProfileSection({ profile, onUpdateProfile }: BusinessProfileSectionProps) {
  const [form, setForm] = useState<BusinessProfile>(profile);
  const [previewExpanded, setPreviewExpanded] = useState<boolean>(false);

  // Sync state if external profile changes
  useEffect(() => {
    setForm(profile);
  }, [profile]);

  // Check for unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(profile);
  }, [form, profile]);

  const handleFieldChange = (key: keyof BusinessProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.companyName.trim() || !form.contactPerson.trim()) {
      toast.error("Company name and contact person are required");
      return;
    }
    onUpdateProfile(form);
    toast.success("Business profile updated successfully!", {
      description: "Changes are immediately reflected on public digital cards.",
    });
  };

  const handleReset = () => {
    setForm(profile);
    toast.info("Reverted unsaved changes");
  };

  const handleTestVCard = () => {
    downloadVCard(form);
    toast.success("Downloaded test vCard (.vcf)");
  };

  const handleTestPDF = () => {
    downloadBusinessCardPDF(form);
    toast.success("Opening PDF Business Card document...");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Business Profile
            </h2>
            {hasChanges && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved Edits
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure company identity, executive credentials, coordinates, and verified address.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
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
            variant="outline"
            size="sm"
            onClick={handleTestPDF}
            className="rounded-xl text-xs gap-1.5 border-border/80 cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Test PDF Card</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTestVCard}
            className="rounded-xl text-xs gap-1.5 border-border/80 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Test vCard</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="btn-primary rounded-xl font-semibold shadow-md gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Form: Grouped Profile Settings */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Company Identity */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-primary">
                  <Building className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Company Identity</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Brand name, tagline, and corporate overview.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-semibold">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => handleFieldChange("companyName", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tagline" className="text-xs font-semibold">
                    Company Tagline
                  </Label>
                  <Input
                    id="tagline"
                    value={form.tagline}
                    onChange={(e) => handleFieldChange("tagline", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="logo" className="text-xs font-semibold">
                    Logo Image URL / Path
                  </Label>
                  <Input
                    id="logo"
                    value={form.logo}
                    onChange={(e) => handleFieldChange("logo", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="avatar" className="text-xs font-semibold">
                    Leader Photo / Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    value={form.avatar}
                    onChange={(e) => handleFieldChange("avatar", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Contact Person */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <User className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Executive & Contact Person</CardTitle>
              </div>
              <CardDescription className="text-xs">
                The primary executive featured on the digital business card.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contactPerson" className="text-xs font-semibold">
                    Contact Person Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    value={form.contactPerson}
                    onChange={(e) => handleFieldChange("contactPerson", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="designation" className="text-xs font-semibold">
                    Designation / Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={(e) => handleFieldChange("designation", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Contact Channels */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Phone className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Contact Channels</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Numbers and coordinates used for 1-click calls, WhatsApp, and email actions.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Primary Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneSecondary" className="text-xs font-semibold">
                    Secondary Phone Number
                  </Label>
                  <Input
                    id="phoneSecondary"
                    value={form.phoneSecondary}
                    onChange={(e) => handleFieldChange("phoneSecondary", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-xs font-semibold">
                    WhatsApp Direct Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={form.whatsapp}
                    onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Official Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs font-semibold">
                    Official Website URL
                  </Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={(e) => handleFieldChange("website", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="destinationQrUrl" className="text-xs font-semibold">
                    Default Destination QR Target
                  </Label>
                  <Input
                    id="destinationQrUrl"
                    value={form.destinationQrUrl}
                    onChange={(e) => handleFieldChange("destinationQrUrl", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Business Address */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Business Address & Location</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Physical premises embedded into Google Maps links and vCard data.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold">
                  Street Address / Industrial Estate
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold">
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="postalCode" className="text-xs font-semibold">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Social Media */}
          <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  <Share2 className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">Social Media Links</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Official handles for corporate profiles.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-semibold">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  value={form.linkedin}
                  onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="text-xs font-semibold">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram"
                    value={form.instagram}
                    onChange={(e) => handleFieldChange("instagram", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="facebook" className="text-xs font-semibold">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebook"
                    value={form.facebook}
                    onChange={(e) => handleFieldChange("facebook", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {hasChanges && (
              <span className="text-xs text-muted-foreground">You have unsaved edits</span>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="btn-primary rounded-xl font-semibold shadow-md px-6 gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Business Profile</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Live Card Preview */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live Card Preview
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1 border border-border/60 text-[11px]">
              <button
                type="button"
                onClick={() => setPreviewExpanded(false)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  !previewExpanded
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setPreviewExpanded(true)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  previewExpanded
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expanded
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Changes typed in the form update this preview in real time.
          </p>

          <DigitalBusinessCard profile={form} isExpanded={previewExpanded} />
        </div>
      </div>
    </div>
  );
}
