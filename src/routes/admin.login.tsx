import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminAuth, DEMO_ADMIN_CREDENTIALS } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Admin Portal Login — Qlumix" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { isAuthenticated, isReady, login } = useAdminAuth();

  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = search.redirect || "/admin/qr-code";

  // If already logged in, redirect immediately to target route
  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate({ to: redirectTo, replace: true });
    }
  }, [isReady, isAuthenticated, navigate, redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      toast.error("Please enter the admin passcode");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(passcode);
      setIsLoading(false);

      if (res.success) {
        toast.success("Authentication successful! Welcome to Qlumix Admin.");
        navigate({ to: redirectTo, replace: true });
      } else {
        toast.error(res.error || "Authentication failed");
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setPasscode(DEMO_ADMIN_CREDENTIALS.defaultPasscode);
    toast.info("Autofilled demo passcode");
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-background via-card/20 to-background px-4 py-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-border/80 bg-card/95 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
              <Lock className="h-6 w-6" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                <Sparkles className="h-2.5 w-2.5" />
                Staff Access
              </span>
            </div>

            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
              Qlumix Admin Portal
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your passcode to manage QR placements, business profiles, and exhibition
              settings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-passcode" className="text-xs font-semibold">
                Admin Passcode
              </Label>
              <div className="relative">
                <Input
                  id="admin-passcode"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  disabled={isLoading}
                  className="pr-10 text-sm font-mono tracking-wider h-11 rounded-xl"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Autofill Pill */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-muted-foreground">Demo credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="font-mono text-primary hover:underline font-semibold cursor-pointer"
              >
                Use `{DEMO_ADMIN_CREDENTIALS.defaultPasscode}`
              </button>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all mt-2 cursor-pointer gap-2"
            >
              <span>{isLoading ? "Verifying..." : "Sign In to Admin"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Public Return Link */}
          <div className="mt-6 border-t border-border/60 pt-4 text-center">
            <Link
              to="/business-profile"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Return to Public Business Profile</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
