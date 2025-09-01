import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            
            <main className="flex-1 p-6 space-y-6">
              <KPIStrip />
              
              <AnalyticsGrid onChartClick={handleChartClick} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ActivityTimeline />
                </div>
                <div>
                  <AlertFeed />
                </div>
              </div>
              
              <QuickActions />
            </main>
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