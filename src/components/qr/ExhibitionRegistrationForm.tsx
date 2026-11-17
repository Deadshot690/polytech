import { useState, useId } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  Building,
  User,
  Phone,
  Mail,
  Globe2,
  PackageCheck,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ExhibitionFormSettings, ExhibitionLead } from "@/lib/qr-config";
import { trackEvent } from "@/lib/qr-tracker";

interface ExhibitionRegistrationFormProps {
  settings: ExhibitionFormSettings;
  onSubmitSuccess?: (lead: Omit<ExhibitionLead, "id" | "createdAt">) => void;
  qrPlacementId?: string;
  isPreview?: boolean;
}

const COMMON_COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Germany",
  "United States",
  "United Kingdom",
  "Netherlands",
  "Vietnam",
  "Turkey",
  "Egypt",
  "Other",
];

export function ExhibitionRegistrationForm({
  settings,
  onSubmitSuccess,
  qrPlacementId,
  isPreview = false,
}: ExhibitionRegistrationFormProps) {
  const formHeadingId = useId();
  const fields = settings.fieldsConfig || {
    fullName: "required",
    companyName: "required",
    mobileNumber: "required",
    emailAddress: "required",
    country: "required",
    interestedProducts: "required",
    message: "optional",
  };

  const activeProducts = (settings.allowedProducts || [])
    .filter((p) => p.enabled)
    .map((p) => p.name);

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    mobileNumber: "",
    emailAddress: "",
    country: "India",
    message: "",
  });

  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() =>
    activeProducts.length > 0 ? [activeProducts[0]] : [],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleProduct = (prod: string) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.includes(prod);
      if (!isSelected && !isPreview) {
        trackEvent("product_interest_selected", {
          qrPlacementId,
          metadata: { product: prod },
        });
      }
      return isSelected ? prev.filter((p) => p !== prod) : [...prev, prod];
    });
    if (errors.interestedProducts) {
      setErrors((e) => {
        const next = { ...e };
        delete next.interestedProducts;
        return next;
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!hasStartedTyping && !isPreview) {
      setHasStartedTyping(true);
      trackEvent("form_start", {
        qrPlacementId,
      });
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (fields.fullName === "required" && !formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    }

    if (fields.companyName === "required" && !formData.companyName.trim()) {
      errs.companyName = "Company name is required";
    }

    if (fields.mobileNumber === "required") {
      if (!formData.mobileNumber.trim()) {
        errs.mobileNumber = "Mobile number is required";
      } else if (!/^[+]?[0-9\s\-()]{7,20}$/.test(formData.mobileNumber.trim())) {
        errs.mobileNumber = "Please enter a valid mobile number";
      }
    } else if (
      formData.mobileNumber.trim() &&
      !/^[+]?[0-9\s\-()]{7,20}$/.test(formData.mobileNumber.trim())
    ) {
      errs.mobileNumber = "Please enter a valid mobile number";
    }

    if (fields.emailAddress === "required") {
      if (!formData.emailAddress.trim()) {
        errs.emailAddress = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress.trim())) {
        errs.emailAddress = "Please enter a valid email address";
      }
    } else if (
      formData.emailAddress.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress.trim())
    ) {
      errs.emailAddress = "Please enter a valid email address";
    }

    if (fields.country === "required" && !formData.country.trim()) {
      errs.country = "Country is required";
    }

    if (
      fields.interestedProducts === "required" &&
      activeProducts.length > 0 &&
      selectedProducts.length === 0
    ) {
      errs.interestedProducts = "Please select at least one product";
    }

    if (fields.message === "required" && !formData.message.trim()) {
      errs.message = "Message or specific requirement is required";
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill in all required fields accurately.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, isPreview ? 400 : 700));

      const payload = {
        ...formData,
        interestedProducts: selectedProducts,
        qrPlacementId,
      };

      if (!isPreview) {
        trackEvent("lead_submitted", {
          qrPlacementId,
          metadata: { companyName: payload.companyName, country: payload.country },
        });

        if (onSubmitSuccess) {
          onSubmitSuccess(payload);
        }
      }

      toast.success(
        settings.successMessage || "Thank you! Your details have been submitted successfully.",
      );

      setFormData({
        fullName: "",
        companyName: "",
        mobileNumber: "",
        emailAddress: "",
        country: "India",
        message: "",
      });
      setSelectedProducts(activeProducts.length > 0 ? [activeProducts[0]] : []);
      setIsSuccess(true);
      setHasStartedTyping(false);
      setTimeout(() => setIsSuccess(false), 4500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden"
    >
      {/* Decorative top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

      <div className="p-6 md:p-8">
        {/* Form Header */}
        <div className="border-b border-border/60 pb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              Visitor Registration
            </span>
          </div>
          <h2
            id={formHeadingId}
            className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            {settings.formHeading || "Let's Connect at the Exhibition"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {settings.formDescription ||
              "Share your details and our team will get in touch with you."}
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">Registration Confirmed</div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                {settings.successMessage ||
                  "Thank you! Your details have been submitted successfully."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name & Company */}
          {(fields.fullName !== "disabled" || fields.companyName !== "disabled") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.fullName !== "disabled" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-fullName"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Full Name{" "}
                    {fields.fullName === "required" ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                    )}
                  </Label>
                  <Input
                    id="reg-fullName"
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    disabled={isSubmitting}
                    className={
                      errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-medium text-destructive">{errors.fullName}</p>
                  )}
                </div>
              )}

              {fields.companyName !== "disabled" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-companyName"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    Company Name{" "}
                    {fields.companyName === "required" ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                    )}
                  </Label>
                  <Input
                    id="reg-companyName"
                    type="text"
                    placeholder="e.g. Apex Polymers Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    disabled={isSubmitting}
                    className={
                      errors.companyName ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  />
                  {errors.companyName && (
                    <p className="text-[11px] font-medium text-destructive">{errors.companyName}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile & Email */}
          {(fields.mobileNumber !== "disabled" || fields.emailAddress !== "disabled") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.mobileNumber !== "disabled" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-mobile"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Mobile Number{" "}
                    {fields.mobileNumber === "required" ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                    )}
                  </Label>
                  <Input
                    id="reg-mobile"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    disabled={isSubmitting}
                    className={
                      errors.mobileNumber ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  />
                  {errors.mobileNumber && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
              )}

              {fields.emailAddress !== "disabled" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Email Address{" "}
                    {fields.emailAddress === "required" ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                    )}
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="rajesh@company.com"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                    disabled={isSubmitting}
                    className={
                      errors.emailAddress ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  />
                  {errors.emailAddress && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.emailAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Country Selection */}
          {fields.country !== "disabled" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-country"
                className="text-xs font-semibold flex items-center gap-1.5"
              >
                <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
                Country{" "}
                {fields.country === "required" ? (
                  <span className="text-destructive">*</span>
                ) : (
                  <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                )}
              </Label>
              <div className="relative">
                <select
                  id="reg-country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {COMMON_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="text-[11px] font-medium text-destructive">{errors.country}</p>
              )}
            </div>
          )}

          {/* Interested Products */}
          {fields.interestedProducts !== "disabled" && activeProducts.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <PackageCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  Interested Products{" "}
                  {fields.interestedProducts === "required" ? (
                    <span className="text-destructive">*</span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  )}
                </Label>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Select all that apply
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeProducts.map((prod) => {
                  const isSelected = selectedProducts.includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => toggleProduct(prod)}
                      disabled={isSubmitting}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border/80 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {prod}
                    </button>
                  );
                })}
              </div>
              {errors.interestedProducts && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.interestedProducts}
                </p>
              )}
            </div>
          )}

          {/* Message */}
          {fields.message !== "disabled" && (
            <div className="space-y-1.5 pt-1">
              <Label
                htmlFor="reg-message"
                className="text-xs font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                Message / Requirement{" "}
                {fields.message === "required" ? (
                  <span className="text-destructive">*</span>
                ) : (
                  <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                )}
              </Label>
              <Textarea
                id="reg-message"
                rows={3}
                placeholder="Tell us about your target application, annual tonnage, or technical specifications..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                disabled={isSubmitting}
                className="resize-none text-sm"
              />
              {errors.message && (
                <p className="text-[11px] font-medium text-destructive">{errors.message}</p>
              )}
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all btn-primary cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Details...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {settings.submitButtonLabel || "Submit Registration"}
                </>
              )}
            </Button>

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Direct connection with Qlumix technical sales engineering desk.
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
