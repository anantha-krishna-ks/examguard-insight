import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

import { KPIStrip } from "@/components/admin/KPIStrip";
import { AnalyticsGrid } from "@/components/admin/AnalyticsGrid";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { AlertFeed } from "@/components/admin/AlertFeed";
import { QuickActions } from "@/components/admin/QuickActions";
import { DrillDownModal } from "@/components/admin/DrillDownModal";

const AdminDashboard = () => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);

  const handleChartClick = (chartType: string, data: any) => {
    setSelectedChart(chartType);
    setDrillDownData(data);
  };

  const handleCloseDrillDown = () => {
    setSelectedChart(null);
    setDrillDownData(null);
  };

  return (
    <div className="min-h-screen bg-admin-bg">
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative">
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-0 h-full z-40">
            <AdminSidebar />
          </div>
          
          {/* Main Content - Adjusted for fixed sidebar and alert feed */}
          <div className="flex-1 flex flex-col ml-56 mr-72 min-w-0">
            <main className="flex-1 p-6 space-y-6 overflow-auto bg-admin-bg">
              <KPIStrip />
              
              <AnalyticsGrid onChartClick={handleChartClick} />
              
              <ActivityTimeline />
              
              <QuickActions />
            </main>
          </div>
          
          {/* Alert Feed - Fixed right column */}
          <div className="fixed right-0 top-0 w-72 h-full border-l bg-card z-30">
            <AlertFeed />
          </div>
        </div>

        {selectedChart && (
          <DrillDownModal
            chartType={selectedChart}
            data={drillDownData}
            onClose={handleCloseDrillDown}
          />
        )}
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;