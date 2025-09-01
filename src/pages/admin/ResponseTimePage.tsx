import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Download,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  BarChart3,
  Activity,
  Timer,
  Zap
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
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell,
  AreaChart,
  Area
} from "recharts";

const responseTimeData = [
  { time: '09:00', avg: 48, median: 45, p95: 85 },
  { time: '09:30', avg: 46, median: 43, p95: 82 },
  { time: '10:00', avg: 52, median: 48, p95: 95 },
  { time: '10:30', avg: 44, median: 41, p95: 78 },
  { time: '11:00', avg: 47, median: 45, p95: 88 },
  { time: '11:30', avg: 43, median: 40, p95: 75 },
];

const difficultyResponseData = [
  { difficulty: 'Easy', avg: 25, median: 22, outliers: 8 },
  { difficulty: 'Medium', avg: 45, median: 42, outliers: 12 },
  { difficulty: 'Hard', avg: 75, median: 70, outliers: 18 },
  { difficulty: 'Expert', avg: 120, median: 115, outliers: 25 },
];

const anomalyData = [
  { candidateId: 'A002', questionId: 'Q045', responseTime: 8, expected: 45, anomalyScore: 0.95 },
  { candidateId: 'A005', questionId: 'Q023', responseTime: 12, expected: 35, anomalyScore: 0.92 },
  { candidateId: 'A012', questionId: 'Q067', responseTime: 5, expected: 65, anomalyScore: 0.98 },
  { candidateId: 'A018', questionId: 'Q012', responseTime: 180, expected: 25, anomalyScore: 0.88 },
  { candidateId: 'A023', questionId: 'Q089', responseTime: 3, expected: 55, anomalyScore: 0.96 },
];

const candidateResponseData = [
  { candidate: 'A001', avg: 42, fastest: 8, slowest: 125, variance: 28 },
  { candidate: 'A002', avg: 15, fastest: 3, slowest: 45, variance: 12 },
  { candidate: 'A003', avg: 67, fastest: 35, slowest: 180, variance: 45 },
  { candidate: 'A004', avg: 38, fastest: 15, slowest: 95, variance: 22 },
  { candidate: 'A005', avg: 22, fastest: 5, slowest: 68, variance: 18 },
];

const distributionData = [
  { range: '0-10s', count: 45, percentage: 4.2 },
  { range: '10-20s', count: 125, percentage: 11.8 },
  { range: '20-30s', count: 234, percentage: 22.1 },
  { range: '30-45s', count: 312, percentage: 29.4 },
  { range: '45-60s', count: 198, percentage: 18.7 },
  { range: '60-90s', count: 89, percentage: 8.4 },
  { range: '90s+', count: 58, percentage: 5.4 },
];

export default function ResponseTimePage() {
  const [currentMedian, setCurrentMedian] = useState(45);
  const [trend, setTrend] = useState(-3.2);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setCurrentMedian(prev => Math.max(20, Math.min(80, prev + Math.floor(Math.random() * 6) - 3)));
      setTrend(prev => (Math.random() - 0.5) * 8);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredAnomalies = anomalyData.filter(anomaly => 
    anomaly.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anomaly.questionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getAnomalyColor = (score: number) => {
    if (score > 0.95) return "hsl(var(--admin-critical-alert))";
    if (score > 0.9) return "hsl(var(--admin-answer-revision))";
    return "hsl(var(--admin-warning))";
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
              <Clock className="h-6 w-6 text-admin-response-anomaly" />
              <h1 className="text-2xl font-bold">Response Time Analytics</h1>
              <Badge className="bg-admin-response-anomaly text-white">
                {currentMedian}s Median
              </Badge>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-admin-response-anomaly">{currentMedian}s</div>
                  <div className="text-sm text-muted-foreground">Median Time</div>
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
                <div className="text-2xl font-bold text-admin-sequential-pattern">47.2s</div>
                <div className="text-sm text-muted-foreground">Average</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-normal-safe">88s</div>
                <div className="text-sm text-muted-foreground">95th Percentile</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-critical-alert">{anomalyData.length}</div>
                <div className="text-sm text-muted-foreground">Anomalies</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-warning">12.3s</div>
                <div className="text-sm text-muted-foreground">Std Deviation</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Response Time Trends (Live)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value}s`} />
                  <Area type="monotone" dataKey="p95" stroke="hsl(var(--admin-critical-alert))" fill="hsl(var(--admin-critical-alert))" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="avg" stroke="hsl(var(--admin-response-anomaly))" fill="hsl(var(--admin-response-anomaly))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="median" stroke="hsl(var(--admin-normal-safe))" fill="hsl(var(--admin-normal-safe))" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Response Time by Difficulty</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyResponseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value}s`} />
                  <Bar dataKey="avg" fill="hsl(var(--admin-response-anomaly))" />
                  <Bar dataKey="median" fill="hsl(var(--admin-normal-safe))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Distribution and Anomalies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timer className="h-5 w-5" />
                <span>Response Time Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.range}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-admin-response-anomaly rounded-full"
                          style={{ width: `${item.percentage * 3}px` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{item.count}</span>
                      <Badge variant="outline">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Time Anomaly Detection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search anomalies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {filteredAnomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{anomaly.candidateId} - {anomaly.questionId}</p>
                        <p className="text-xs text-muted-foreground">
                          Actual: {anomaly.responseTime}s • Expected: {anomaly.expected}s
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          style={{ 
                            backgroundColor: getAnomalyColor(anomaly.anomalyScore),
                            color: 'white'
                          }}
                        >
                          {(anomaly.anomalyScore * 100).toFixed(0)}%
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Timer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Candidate Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Response Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={candidateResponseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="avg" />
                    <YAxis dataKey="variance" />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded shadow">
                              <p><strong>Candidate:</strong> {data.candidate}</p>
                              <p><strong>Avg Time:</strong> {data.avg}s</p>
                              <p><strong>Variance:</strong> {data.variance}s</p>
                              <p><strong>Range:</strong> {data.fastest}s - {data.slowest}s</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="variance" fill="hsl(var(--admin-response-anomaly))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Analysis Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-admin-critical-alert/10 border border-admin-critical-alert rounded">
                    <p className="font-medium text-sm text-admin-critical-alert">High Risk Pattern</p>
                    <p className="text-sm text-muted-foreground">
                      Candidates with extremely low response times (under 15s average) may be using external assistance or pre-knowledge.
                    </p>
                  </div>
                  <div className="p-3 bg-admin-warning/10 border border-admin-warning rounded">
                    <p className="font-medium text-sm text-admin-warning">Attention Needed</p>
                    <p className="text-sm text-muted-foreground">
                      High variance in response times may indicate inconsistent behavior or potential switching between assistance methods.
                    </p>
                  </div>
                  <div className="p-3 bg-admin-normal-safe/10 border border-admin-normal-safe rounded">
                    <p className="font-medium text-sm text-admin-normal-safe">Normal Behavior</p>
                    <p className="text-sm text-muted-foreground">
                      Expected response time patterns show consistent timing relative to question difficulty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}