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
          
          {/* Main Content Container */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            
            {/* Dashboard Content */}
            <main className="flex-1 p-6 space-y-6 overflow-auto">
              <KPIStrip />
              
              <AnalyticsGrid onChartClick={handleChartClick} />
              
              <ActivityTimeline />
              
              <QuickActions />
            </main>
          </div>
          
          {/* Alert Feed - Dedicated Right Column */}
          <div className="w-72 border-l bg-card">
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