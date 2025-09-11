import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import Candidate360Page from "./pages/admin/Candidate360Page";
import ActiveCandidatesPage from "./pages/admin/ActiveCandidatesPage";
import FlagsPage from "./pages/admin/FlagsPage";
import PrecisionPage from "./pages/admin/PrecisionPage";
import ResponseTimePage from "./pages/admin/ResponseTimePage";
import ResponseTimeAnalysisPage from "./pages/admin/ResponseTimeAnalysisPage";
import SystemHealthPage from "./pages/admin/SystemHealthPage";
import SettingsPage from "./pages/admin/SettingsPage";
import CasesPage from "./pages/admin/CasesPage";
import TestCentresPage from "./pages/admin/TestCentresPage";
import { BehavioralPatternAnalysisPage } from "./pages/admin/BehavioralPatternAnalysisPage";
import ComingSoonPage from "./pages/admin/ComingSoonPage";
import SimulatorPage from "./pages/admin/SimulatorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/candidates" element={<Candidate360Page />} />
          <Route path="/admin/flags" element={<FlagsPage />} />
          <Route path="/admin/precision" element={<PrecisionPage />} />
          <Route path="/admin/response-time" element={<ResponseTimePage />} />
          <Route path="/admin/response-time-analysis" element={<ResponseTimeAnalysisPage />} />
          <Route path="/admin/behavioral-pattern-analysis" element={<BehavioralPatternAnalysisPage />} />
          <Route path="/admin/system-health" element={<SystemHealthPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/cases" element={<CasesPage />} />
          <Route path="/admin/test-centres" element={<TestCentresPage />} />
          <Route path="/admin/items" element={<ComingSoonPage />} />
          <Route path="/admin/simulator" element={<SimulatorPage />} />
          <Route path="/admin/similarity" element={<ComingSoonPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
