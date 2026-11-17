import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQrAppConfig } from "@/lib/qr-config";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { QRManagementSection } from "@/components/admin/QRManagementSection";
import { BusinessProfileSection } from "@/components/admin/BusinessProfileSection";
import { ExhibitionFormSection } from "@/components/admin/ExhibitionFormSection";
import { QrCode, Building, FileText, CheckCircle2 } from "lucide-react";

export type AdminTabType = "qr" | "profile" | "form";

interface AdminSearch {
  tab?: string;
}

export const Route = createFileRoute("/admin/qr-code")({
  validateSearch: (search: Record<string, unknown>): AdminSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  head: () => ({
    meta: [
      { title: "QR Management & Digital Business Card — Qlumix Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMasterPage,
});

const TABS: Array<{ id: AdminTabType; label: string; icon: typeof QrCode }> = [
  { id: "qr", label: "QR Code Management", icon: QrCode },
  { id: "profile", label: "Business Profile", icon: Building },
  { id: "form", label: "Exhibition Form Settings", icon: FileText },
];

function AdminMasterPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const {
    profile,
    formSettings,
    placements,
    updateProfile,
    updateFormSettings,
    savePlacement,
    togglePlacementActive,
    deletePlacement,
    resetAllToDefaults,
  } = useQrAppConfig();

  const initialTab: AdminTabType =
    search.tab === "profile" || search.tab === "form" ? (search.tab as AdminTabType) : "qr";

  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab);

  // Sync state with search param
  useEffect(() => {
    if (search.tab && (search.tab === "qr" || search.tab === "profile" || search.tab === "form")) {
      setActiveTab(search.tab as AdminTabType);
    }
  }, [search.tab]);

  const handleTabChange = (tabId: AdminTabType) => {
    setActiveTab(tabId);
    navigate({
      to: "/admin/qr-code",
      search: { tab: tabId },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* SaaS Admin Header */}
      <AdminHeader onResetDefaults={resetAllToDefaults} />

      {/* Main SaaS App Container */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Simplified 3-Tab SaaS Navigation Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-4">
          <div className="relative inline-flex items-center gap-1.5 rounded-2xl bg-secondary/50 p-1.5 border border-border/70 backdrop-blur-md">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative z-10 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span>{tab.label}</span>
                  {tab.id === "qr" && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {placements.length}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTabPill"
                      className="absolute inset-0 z-[-1] rounded-xl bg-card shadow-sm border border-border/80"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`flex h-2 w-2 rounded-full ${
                formSettings.formEnabled ? "bg-emerald-500" : "bg-muted-foreground"
              }`}
            />
            <span>Form {formSettings.formEnabled ? "Active" : "Disabled"}</span>
            <span>•</span>
            <span>{placements.filter((p) => p.active).length} Active QRs</span>
          </div>
        </div>

        {/* Tab View Content with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeTab === "qr" && (
            <motion.div
              key="tab-qr"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QRManagementSection
                placements={placements}
                onSavePlacement={savePlacement}
                onToggleActive={togglePlacementActive}
                onDeletePlacement={deletePlacement}
              />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BusinessProfileSection profile={profile} onUpdateProfile={updateProfile} />
            </motion.div>
          )}

          {activeTab === "form" && (
            <motion.div
              key="tab-form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ExhibitionFormSection
                formSettings={formSettings}
                onUpdateFormSettings={updateFormSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
