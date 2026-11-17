import { useState } from "react";
import { BusinessProfile } from "@/lib/qr-config";
import { DigitalBusinessCard } from "@/components/qr/DigitalBusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building, Save, Eye, Sparkles } from "lucide-react";

interface BusinessProfileSectionProps {
  profile: BusinessProfile;
  onUpdateProfile: (patch: Partial<BusinessProfile>) => void;
}

export function BusinessProfileSection({ profile, onUpdateProfile }: BusinessProfileSectionProps) {
  const [form, setForm] = useState<BusinessProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(form);
    toast.success("Business profile saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border/80 pb-4">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Business Profile & Digital Card Identity
        </h2>
        <p className="text-xs text-muted-foreground">
          Edit company coordinates, executive credentials, and phone numbers displayed on the public
          card and vCard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Profile Editor Form */}
        <Card className="lg:col-span-7 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Profile Information</CardTitle>
            <CardDescription className="text-xs">
              This information automatically formats into the downloadable .vcf contact card.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-semibold">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    className="text-xs"
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
                    onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contactPerson" className="text-xs font-semibold">
                    Executive / Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    value={form.contactPerson}
                    onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="designation" className="text-xs font-semibold">
                    Designation / Title
                  </Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Primary Phone / WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value, whatsapp: e.target.value }))
                    }
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneSec" className="text-xs font-semibold">
                    Secondary Line
                  </Label>
                  <Input
                    id="phoneSec"
                    value={form.phoneSecondary}
                    onChange={(e) => setForm((f) => ({ ...f, phoneSecondary: e.target.value }))}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Official Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs font-semibold">
                    Website URL
                  </Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="text-xs font-semibold">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    value={form.linkedin}
                    onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold">
                  Manufacturing Facility Address
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="text-xs"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm" className="btn-primary text-xs gap-1.5">
                  <Save className="h-4 w-4" />
                  Save Business Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Interactive Card Preview */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-primary" />
              Live Digital Card Preview
            </span>
            <span className="text-[10px] text-muted-foreground">Updates in real time</span>
          </div>

          <DigitalBusinessCard profile={form} isExpanded={false} />
        </div>
      </div>
    </div>
  );
}
