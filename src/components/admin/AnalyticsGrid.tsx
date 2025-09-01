import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Grid3X3, 
  Users,
  ExternalLink
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";

interface AnalyticsGridProps {
  onChartClick: (chartType: string, data: any) => void;
}

// Mock data for charts
const responseTimeData = [
  { difficulty: 'Easy', avgTime: 25, count: 450 },
  { difficulty: 'Medium', avgTime: 45, count: 320 },
  { difficulty: 'Hard', avgTime: 75, count: 180 },
  { difficulty: 'Expert', avgTime: 120, count: 95 },
];

const wrongRightData = [
  { time: '09:00', changes: 5 },
  { time: '09:30', changes: 12 },
  { time: '10:00', changes: 23 },
  { time: '10:30', changes: 18 },
  { time: '11:00', changes: 31 },
  { time: '11:30', changes: 15 },
];

const similarityData = [
  { x: 12, y: 34, similarity: 0.85, candidate: 'A001' },
  { x: 45, y: 23, similarity: 0.92, candidate: 'A002' },
  { x: 67, y: 56, similarity: 0.78, candidate: 'A003' },
  { x: 23, y: 78, similarity: 0.95, candidate: 'A004' },
  { x: 89, y: 12, similarity: 0.88, candidate: 'A005' },
];

const personFitData = [
  { range: '0.0-0.2', count: 45, probability: 'Very Low' },
  { range: '0.2-0.4', count: 120, probability: 'Low' },
  { range: '0.4-0.6', count: 680, probability: 'Normal' },
  { range: '0.6-0.8', count: 245, probability: 'High' },
  { range: '0.8-1.0', count: 35, probability: 'Very High' },
];

export function AnalyticsGrid({ onChartClick }: AnalyticsGridProps) {
  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.9) return "#ef4444"; // Critical
    if (similarity > 0.8) return "#f97316"; // Warning
    return "#3b82f6"; // Normal
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Time vs Difficulty */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onChartClick('responseTime', responseTimeData)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-admin-response-anomaly" />
            <CardTitle className="text-sm font-medium">Response Time vs Difficulty</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="hsl(var(--admin-response-anomaly))" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Live data from {responseTimeData.reduce((acc, curr) => acc + curr.count, 0)} responses</span>
            <Badge variant="outline" className="text-admin-response-anomaly border-admin-response-anomaly">
              Response Anomalies
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Wrong → Right Timeline */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onChartClick('wrongRight', wrongRightData)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-admin-answer-revision" />
            <CardTitle className="text-sm font-medium">Wrong → Right Spike Timeline</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={wrongRightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="changes" 
                stroke="hsl(var(--admin-answer-revision))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--admin-answer-revision))" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Last 3 hours activity</span>
            <Badge variant="outline" className="text-admin-answer-revision border-admin-answer-revision">
              Answer Revisions
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Similarity Heatmap */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onChartClick('similarity', similarityData)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-4 w-4 text-admin-critical-alert" />
            <CardTitle className="text-sm font-medium">Similarity Heatmap</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={similarityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-2 border rounded shadow">
                        <p>Candidate: {data.candidate}</p>
                        <p>Similarity: {(data.similarity * 100).toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="similarity">
                {similarityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSimilarityColor(entry.similarity)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Suspicious clusters detected</span>
            <Badge variant="outline" className="text-admin-critical-alert border-admin-critical-alert">
              Similarity Alerts
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Person-Fit Distribution */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onChartClick('personFit', personFitData)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-admin-sequential-pattern" />
            <CardTitle className="text-sm font-medium">Person-Fit Distribution</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={personFitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--admin-sequential-pattern))" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Probability anomaly distribution</span>
            <Badge variant="outline" className="text-admin-sequential-pattern border-admin-sequential-pattern">
              Sequential Patterns
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}