import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLead } from "@/lib/lead-context";
import { whatsappUrl, products } from "@/data/site";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone"),
  company: z.string().optional(),
  product: z.string().optional(),
  grade: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
});

const empty = {
  name: "",
  email: "",
  phone: "",
  company: "",
  product: "",
  grade: "",
  quantity: "",
  message: "",
};

export function LeadDialog() {
  const { open, product, closeLead } = useLead();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setForm((f) => ({ ...empty, product: product ?? f.product }));
  }, [open, product]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      const leads = JSON.parse(localStorage.getItem("kp_leads") || "[]");
      leads.push({ ...parsed.data, at: new Date().toISOString() });
      localStorage.setItem("kp_leads", JSON.stringify(leads));
    } catch {
      /* local-only fallback */
    }

    const msg = `New inquiry from ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ACompany: ${form.company || "-"}%0AProduct: ${form.product || "-"}%0AGrade: ${form.grade || "-"}%0AQuantity: ${form.quantity || "-"}%0AMessage: ${form.message || "-"}`;
    window.open(whatsappUrl(msg), "_blank");
    toast.success("Inquiry saved — connecting you on WhatsApp");
    closeLead();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeLead()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Tell us about your project and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ln">Name</Label>
            <Input
              id="ln"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Full name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="le">Email</Label>
              <Input
                id="le"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lp">Phone</Label>
              <Input
                id="lp"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 ..."
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lc">Company</Label>
              <Input
                id="lc"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Company"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lpr">Product</Label>
              <select
                id="lpr"
                value={form.product}
                onChange={(e) => set("product", e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lg">Grade</Label>
              <Input
                id="lg"
                value={form.grade}
                onChange={(e) => set("grade", e.target.value)}
                placeholder="Grade / MFI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lq">Quantity</Label>
              <Input
                id="lq"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="e.g. 5 T / month"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lm">Message</Label>
            <Textarea
              id="lm"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Application details..."
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary mt-2">
            Send inquiry
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
