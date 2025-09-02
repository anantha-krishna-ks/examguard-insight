import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  Flag, 
  Target, 
  Clock, 
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface KPIData {
  activeCandidates: number;
  flags: number;
  numberOfTests: number;
  numberOfTestCentres: number;
  systemHealth: number;
  trends: {
    candidates: number;
    flags: number;
    tests: number;
    testCentres: number;
  };
}

export function KPIStrip() {
  const [kpiData, setKpiData] = useState<KPIData>({
    activeCandidates: 1247,
    flags: 23,
    numberOfTests: 156,
    numberOfTestCentres: 28,
    systemHealth: 99.8,
    trends: {
      candidates: 2.3,
      flags: -12.5,
      tests: 4.2,
      testCentres: 1.5,
    }
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        activeCandidates: prev.activeCandidates + Math.floor(Math.random() * 5) - 2,
        flags: Math.max(0, prev.flags + Math.floor(Math.random() * 3) - 1),
        numberOfTests: Math.max(100, prev.numberOfTests + Math.floor(Math.random() * 3) - 1),
        numberOfTestCentres: Math.max(20, prev.numberOfTestCentres + Math.floor(Math.random() * 2) - 1),
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const kpis = [
    {
      title: "Active Candidates",
      value: kpiData.activeCandidates.toLocaleString(),
      icon: Users,
      trend: kpiData.trends.candidates,
      color: "text-admin-sequential-pattern",
      link: "/admin/candidates"
    },
    {
      title: "Flags (10 min)",
      value: kpiData.flags.toString(),
      icon: Flag,
      trend: kpiData.trends.flags,
      color: "text-admin-critical-alert",
      link: "/admin/flags"
    },
    {
      title: "No of Tests",
      value: kpiData.numberOfTests.toString(),
      icon: Target,
      trend: kpiData.trends.tests,
      color: "text-admin-normal-safe",
      link: "/admin/cases"
    },
    {
      title: "No of Test Centres",
      value: kpiData.numberOfTestCentres.toString(),
      icon: Clock,
      trend: kpiData.trends.testCentres,
      color: "text-admin-response-anomaly",
      link: "/admin/test-centres"
    },
  ];

  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Link key={index} to={kpi.link}>
          <Card className="h-36 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <kpi.icon className={`h-4 w-4 flex-shrink-0 ${kpi.color}`} />
                  <span className="text-xs text-muted-foreground leading-tight break-words">{kpi.title}</span>
                </div>
                {kpi.trend !== 0 && (
                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    <TrendIcon trend={kpi.trend} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.abs(kpi.trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <span className="text-2xl font-bold leading-none block">{kpi.value}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}