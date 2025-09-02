import { useState } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardFilters } from "@/components/admin/DashboardFilters";
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
        <AdminDashboardContent 
          onChartClick={handleChartClick}
          selectedChart={selectedChart}
          drillDownData={drillDownData}
          onCloseDrillDown={handleCloseDrillDown}
        />
      </SidebarProvider>
    </div>
  );
};

const AdminDashboardContent = ({ 
  onChartClick, 
  selectedChart, 
  drillDownData, 
  onCloseDrillDown 
}: {
  onChartClick: (chartType: string, data: any) => void;
  selectedChart: string | null;
  drillDownData: any;
  onCloseDrillDown: () => void;
}) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <AdminSidebar />
      </div>
      
      {/* Main Content - Responsive to sidebar state */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ease-linear ${
        collapsed ? 'ml-12' : 'ml-56'
      } mr-72 min-w-0`}>
        <main className="flex-1 p-6 space-y-6 overflow-auto bg-admin-bg">
          <DashboardFilters />
          
          <KPIStrip />
          
          <AnalyticsGrid onChartClick={onChartClick} />
          
          <ActivityTimeline />
          
          <QuickActions />
        </main>
      </div>
      
      {/* Alert Feed - Fixed right column */}
      <div className="fixed right-0 top-0 w-72 h-full border-l bg-card z-30">
        <AlertFeed />
      </div>

      {selectedChart && (
        <DrillDownModal
          chartType={selectedChart}
          data={drillDownData}
          onClose={onCloseDrillDown}
        />
      )}
    </div>
  );
};

export default AdminDashboard;