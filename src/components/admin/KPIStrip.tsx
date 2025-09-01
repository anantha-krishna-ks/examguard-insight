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
  precision: number;
  medianResponseTime: number;
  systemHealth: number;
  trends: {
    candidates: number;
    flags: number;
    precision: number;
    responseTime: number;
  };
}

export function KPIStrip() {
  const [kpiData, setKpiData] = useState<KPIData>({
    activeCandidates: 1247,
    flags: 23,
    precision: 94.2,
    medianResponseTime: 45,
    systemHealth: 99.8,
    trends: {
      candidates: 2.3,
      flags: -12.5,
      precision: 1.8,
      responseTime: -3.2,
    }
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        activeCandidates: prev.activeCandidates + Math.floor(Math.random() * 5) - 2,
        flags: Math.max(0, prev.flags + Math.floor(Math.random() * 3) - 1),
        precision: Math.max(80, Math.min(100, prev.precision + (Math.random() - 0.5) * 0.5)),
        medianResponseTime: Math.max(20, prev.medianResponseTime + Math.floor(Math.random() * 6) - 3),
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
      title: "Precision (7-day)",
      value: `${kpiData.precision.toFixed(1)}%`,
      icon: Target,
      trend: kpiData.trends.precision,
      color: "text-admin-normal-safe",
      link: "/admin/precision"
    },
    {
      title: "Median Response Time",
      value: `${kpiData.medianResponseTime}s`,
      icon: Clock,
      trend: kpiData.trends.responseTime,
      color: "text-admin-response-anomaly",
      link: "/admin/response-time"
    },
    {
      title: "System Health",
      value: `${kpiData.systemHealth.toFixed(1)}%`,
      icon: Activity,
      trend: 0,
      color: "text-admin-normal-safe",
      link: "/admin/system-health"
    }
  ];

  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => (
        <Link key={index} to={kpi.link}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className="text-xs text-muted-foreground">{kpi.title}</span>
                </div>
                {kpi.trend !== 0 && (
                  <div className="flex items-center space-x-1">
                    <TrendIcon trend={kpi.trend} />
                    <span className="text-xs text-muted-foreground">
                      {Math.abs(kpi.trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{kpi.value}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}