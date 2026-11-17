import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ExternalLink, RotateCcw, Sun, Moon, Sparkles, QrCode, LogOut, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface AdminHeaderProps {
  onResetDefaults?: () => void;
  onLogout?: () => void;
}

export function AdminHeader({ onResetDefaults, onLogout }: AdminHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.localStorage.getItem("theme") === "dark" ||
      (!window.localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const initial = isDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("theme", next);
  };

  const handleReset = () => {
    if (onResetDefaults) {
      onResetDefaults();
      toast.success("All configuration reset to demo defaults");
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.info("Logged out of Admin Portal");
    }
  };

  return (
    <header className="sticky top-16 z-30 border-b border-border/70 bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                Qlumix QR Management
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                <Sparkles className="h-2.5 w-2.5" />
                Protected Admin
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Digital Business Card & Exhibition Management
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {/* View Public Portal */}
          <Link
            to="/business-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary hover:text-primary"
          >
            <span>View Public Profile</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-xl border border-border/60 hover:bg-secondary cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>

          {/* Reset to Defaults Dialog */}
          {onResetDefaults && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Reset Defaults"
                  className="h-8 w-8 rounded-xl border border-border/60 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Reset to Demo Defaults"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Configuration to Defaults?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset business profile information, QR placements, and form settings
                    to their original demo state. Any custom edits saved in localStorage will be
                    replaced.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reset Defaults
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Logout Action */}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-1.5 ml-1"
              title="Sign Out of Admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
