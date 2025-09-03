import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
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
const responseAnomalyData = [
  { test: 'Test 1', notStarted: 5.43, inProgress: 78.26, completed: 16.30 },
  { test: 'Test 2', notStarted: 13.81, inProgress: 69.06, completed: 17.13 },
  { test: 'Test 3', notStarted: 0.00, inProgress: 90.91, completed: 9.09 },
];

const behavioralAnomalyData = [
  { test: 'Test 1', sequentialPattern: 152, answerRevision: 26 },
  { test: 'Test 2', sequentialPattern: 206, answerRevision: 51 },
  { test: 'Test 3', sequentialPattern: 97, answerRevision: 5 },
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
  const navigate = useNavigate();
  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.9) return "#ef4444"; // Critical
    if (similarity > 0.8) return "#f97316"; // Warning
    return "#3b82f6"; // Normal
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Time-Based Anomaly */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/response-time-analysis')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-admin-response-anomaly" />
            <CardTitle className="text-sm font-medium">Response Time-Based Anomaly</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseAnomalyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                labelFormatter={(label) => `Tests in Progress: ${label}`}
              />
              <Bar dataKey="notStarted" stackId="stack" fill="#f59e0b" name="Not Started" />
              <Bar dataKey="inProgress" stackId="stack" fill="#10b981" name="In Progress" />
              <Bar dataKey="completed" stackId="stack" fill="#ef4444" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Percent Student Test Completion</span>
            <Badge variant="outline" className="text-admin-response-anomaly border-admin-response-anomaly">
              Response Anomalies
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Behavioural Pattern Anomaly */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/behavioral-pattern-analysis')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-admin-answer-revision" />
            <CardTitle className="text-sm font-medium">Behavioural Pattern Anomaly</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={behavioralAnomalyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `Test: ${label}`}
              />
              <Bar dataKey="sequentialPattern" fill="#2563eb" name="Sequential Pattern Numbers" />
              <Bar dataKey="answerRevision" fill="#ea580c" name="Answer Revision Numbers" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Anomaly Student Numbers</span>
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