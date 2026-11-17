import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQrAppConfig } from "@/lib/qr-config";
import { useQrAnalytics, DateRange } from "@/lib/qr-analytics";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { QRManagementSection } from "@/components/admin/QRManagementSection";
import { ExhibitionManagementSection } from "@/components/admin/ExhibitionManagementSection";
import { BusinessProfileSection } from "@/components/admin/BusinessProfileSection";
import { ExhibitionFormSection } from "@/components/admin/ExhibitionFormSection";
import { LeadManagementSection } from "@/components/admin/LeadManagementSection";
import { ReportsAnalyticsSection } from "@/components/admin/ReportsAnalyticsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  QrCode,
  Building2,
  FileText,
  Users,
  BarChart3,
  CalendarCheck2,
} from "lucide-react";

export const Route = createFileRoute("/admin/qr-code")({
  head: () => ({
    meta: [
      { title: "Business QR & Exhibition Analytics Management — Qlumix" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMasterPage,
});

function AdminMasterPage() {
  const {
    profile,
    exhibitions,
    activeExhibition,
    activeExhibitionId,
    placements,
    leads,
    updateProfile,
    setActiveExhibitionId,
    saveExhibition,
    deleteExhibition,
    savePlacement,
    togglePlacementActive,
    deletePlacement,
    updateLead,
    deleteLead,
    resetAllToDefaults,
  } = useQrAppConfig();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  // Dynamically computed analytics deriving from shared data and demo events
  const analytics = useQrAnalytics(exhibitions, placements, leads, activeExhibitionId, dateRange);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* SaaS Admin Header */}
      <AdminHeader
        exhibitions={exhibitions}
        activeExhibitionId={activeExhibitionId}
        onSelectExhibition={setActiveExhibitionId}
        dateRange={dateRange}
        onSelectDateRange={setDateRange}
        onResetDefaults={resetAllToDefaults}
      />

      {/* Main SaaS App Container */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Main Top 6 Navigation Tabs */}
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-11 inline-flex w-auto rounded-2xl bg-secondary/50 p-1 border border-border/70">
              <TabsTrigger
                value="overview"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="qr"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <QrCode className="h-3.5 w-3.5" />
                QR Management ({placements.length})
              </TabsTrigger>

              <TabsTrigger
                value="exhibitions"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <CalendarCheck2 className="h-3.5 w-3.5" />
                Exhibitions ({exhibitions.length})
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Building2 className="h-3.5 w-3.5" />
                Business Profile
              </TabsTrigger>

              <TabsTrigger
                value="forms"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                Exhibition Forms
              </TabsTrigger>

              <TabsTrigger
                value="leads"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Users className="h-3.5 w-3.5" />
                Lead Management ({leads.length})
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Reports & Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          <TabsContent value="overview">
            <OverviewDashboard
              summary={analytics.summary}
              timeline={analytics.timeline}
              exhibitionPerformance={analytics.exhibitionPerformance}
              funnelStages={analytics.funnelStages}
              recentActivity={analytics.recentActivity}
              onNavigateToTab={setActiveTab}
            />
          </TabsContent>

          {/* TAB 2: QR MANAGEMENT */}
          <TabsContent value="qr">
            <QRManagementSection
              placements={placements}
              exhibitions={exhibitions}
              placementMetrics={analytics.placementMetrics}
              onSavePlacement={savePlacement}
              onToggleActive={togglePlacementActive}
              onDeletePlacement={deletePlacement}
            />
          </TabsContent>

          {/* TAB 3: EXHIBITIONS MANAGEMENT */}
          <TabsContent value="exhibitions">
            <ExhibitionManagementSection
              exhibitions={exhibitions}
              activeExhibitionId={activeExhibitionId}
              onSelectExhibition={setActiveExhibitionId}
              onSaveExhibition={saveExhibition}
              onDeleteExhibition={deleteExhibition}
            />
          </TabsContent>

          {/* TAB 4: BUSINESS PROFILE */}
          <TabsContent value="profile">
            <BusinessProfileSection profile={profile} onUpdateProfile={updateProfile} />
          </TabsContent>

          {/* TAB 5: EXHIBITION FORMS */}
          <TabsContent value="forms">
            <ExhibitionFormSection
              exhibitions={exhibitions}
              activeExhibition={activeExhibition}
              onSelectExhibition={setActiveExhibitionId}
              onSaveExhibition={saveExhibition}
            />
          </TabsContent>

          {/* TAB 6: LEAD MANAGEMENT */}
          <TabsContent value="leads">
            <LeadManagementSection
              leads={leads}
              exhibitions={exhibitions}
              placements={placements}
              onUpdateLead={updateLead}
              onDeleteLead={deleteLead}
            />
          </TabsContent>

          {/* TAB 7: REPORTS & ANALYTICS */}
          <TabsContent value="analytics">
            <ReportsAnalyticsSection
              summary={analytics.summary}
              timeline={analytics.timeline}
              exhibitionPerformance={analytics.exhibitionPerformance}
              funnelStages={analytics.funnelStages}
              productDemand={analytics.productDemand}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
