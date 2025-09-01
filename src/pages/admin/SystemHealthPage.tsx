import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Download,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Server,
  Database,
  Wifi,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Cell
} from "recharts";

const systemMetricsData = [
  { time: '09:00', cpu: 45, memory: 62, disk: 78, network: 35 },
  { time: '09:30', cpu: 52, memory: 68, disk: 78, network: 42 },
  { time: '10:00', cpu: 48, memory: 65, disk: 79, network: 38 },
  { time: '10:30', cpu: 55, memory: 72, disk: 79, network: 45 },
  { time: '11:00', cpu: 42, memory: 58, disk: 80, network: 32 },
  { time: '11:30', cpu: 38, memory: 55, disk: 80, network: 28 },
];

const serviceStatusData = [
  { service: 'Authentication Service', status: 'healthy', uptime: 99.98, responseTime: 45 },
  { service: 'Exam Engine', status: 'healthy', uptime: 99.95, responseTime: 120 },
  { service: 'Analytics Pipeline', status: 'warning', uptime: 98.2, responseTime: 250 },
  { service: 'File Storage', status: 'healthy', uptime: 99.99, responseTime: 35 },
  { service: 'Notification Service', status: 'healthy', uptime: 99.8, responseTime: 80 },
  { service: 'Monitoring System', status: 'healthy', uptime: 100, responseTime: 25 },
];

const alertsData = [
  { time: '09:00', critical: 0, warning: 2, info: 5 },
  { time: '09:30', critical: 1, warning: 3, info: 8 },
  { time: '10:00', critical: 0, warning: 1, info: 12 },
  { time: '10:30', critical: 0, warning: 4, info: 6 },
  { time: '11:00', critical: 0, warning: 2, info: 9 },
  { time: '11:30', critical: 0, warning: 1, info: 4 },
];

const performanceData = [
  { metric: 'API Response Time', value: 120, target: 200, unit: 'ms' },
  { metric: 'Database Query Time', value: 45, target: 100, unit: 'ms' },
  { metric: 'Page Load Time', value: 1.2, target: 2.0, unit: 's' },
  { metric: 'Error Rate', value: 0.02, target: 0.1, unit: '%' },
];

const radialData = [
  { name: 'CPU', value: 42, color: '#3b82f6' },
  { name: 'Memory', value: 58, color: '#ef4444' },
  { name: 'Disk', value: 80, color: '#f97316' },
  { name: 'Network', value: 32, color: '#22c55e' },
];

export default function SystemHealthPage() {
  const [systemHealth, setSystemHealth] = useState(99.8);
  const [trend, setTrend] = useState(0.1);
  const [currentLoad, setCurrentLoad] = useState(42);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setSystemHealth(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 0.2)));
      setTrend(prev => (Math.random() - 0.5) * 0.4);
      setCurrentLoad(prev => Math.max(10, Math.min(90, prev + Math.floor(Math.random() * 10) - 5)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 99) return "bg-admin-normal-safe";
    if (health >= 95) return "bg-admin-warning";
    return "bg-admin-critical-alert";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-admin-normal-safe';
      case 'warning': return 'text-admin-warning';
      case 'critical': return 'text-admin-critical-alert';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-admin-normal-safe" />
              <h1 className="text-2xl font-bold">System Health</h1>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth)}`} />
                <Badge className="bg-admin-normal-safe text-white">
                  {systemHealth.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-admin-normal-safe">{systemHealth.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Overall Health</div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(trend)}
                  <span className="text-xs">{Math.abs(trend).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-sequential-pattern">{currentLoad}%</div>
                <div className="text-sm text-muted-foreground">System Load</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-normal-safe">99.97%</div>
                <div className="text-sm text-muted-foreground">Uptime (30d)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-response-anomaly">120ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Resource Utilization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={systemMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="memory" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="network" stackId="3" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Current Resource Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} label={{ position: 'insideStart', fill: '#fff' }}>
                    {radialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RadialBar>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Service Status Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStatusData.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">Response: {service.responseTime}ms</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.uptime}%</p>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                      <Badge className={
                        service.status === 'healthy' ? 'bg-admin-normal-safe text-white' :
                        service.status === 'warning' ? 'bg-admin-warning text-black' :
                        'bg-admin-critical-alert text-white'
                      }>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.value}{metric.unit} / {metric.target}{metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>System Alerts Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={alertsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="critical" stackId="a" fill="hsl(var(--admin-critical-alert))" />
                  <Bar dataKey="warning" stackId="a" fill="hsl(var(--admin-warning))" />
                  <Bar dataKey="info" stackId="a" fill="hsl(var(--admin-info))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-admin-normal-safe/10 border border-admin-normal-safe rounded">
                <h3 className="font-semibold text-admin-normal-safe mb-2">Optimal Performance</h3>
                <ul className="text-sm space-y-1">
                  <li>• All critical services running smoothly</li>
                  <li>• Response times within target ranges</li>
                  <li>• Resource utilization stable</li>
                </ul>
              </div>
              
              <div className="p-4 bg-admin-warning/10 border border-admin-warning rounded">
                <h3 className="font-semibold text-admin-warning mb-2">Monitoring Required</h3>
                <ul className="text-sm space-y-1">
                  <li>• Analytics pipeline showing warnings</li>
                  <li>• Disk usage approaching 80%</li>
                  <li>• Monitor memory utilization trends</li>
                </ul>
              </div>
              
              <div className="p-4 bg-admin-sequential-pattern/10 border border-admin-sequential-pattern rounded">
                <h3 className="font-semibold text-admin-sequential-pattern mb-2">Optimization Tips</h3>
                <ul className="text-sm space-y-1">
                  <li>• Schedule maintenance during low usage</li>
                  <li>• Consider scaling analytics pipeline</li>
                  <li>• Review disk cleanup policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}