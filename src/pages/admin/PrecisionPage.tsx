import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Download,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  BarChart3,
  Activity
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
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const precisionTrendData = [
  { date: '2024-01-01', precision: 92.5, recall: 89.2, f1Score: 90.8 },
  { date: '2024-01-02', precision: 93.1, recall: 90.1, f1Score: 91.6 },
  { date: '2024-01-03', precision: 91.8, recall: 88.7, f1Score: 90.2 },
  { date: '2024-01-04', precision: 94.2, recall: 91.3, f1Score: 92.7 },
  { date: '2024-01-05', precision: 93.7, recall: 90.8, f1Score: 92.2 },
  { date: '2024-01-06', precision: 95.1, recall: 92.4, f1Score: 93.7 },
  { date: '2024-01-07', precision: 94.2, recall: 91.7, f1Score: 92.9 },
];

const modelPerformanceData = [
  { model: 'Similarity Detection', precision: 96.2, falsePositives: 12, falseNegatives: 8 },
  { model: 'Response Pattern', precision: 94.1, falsePositives: 18, falseNegatives: 14 },
  { model: 'Person-Fit Model', precision: 92.8, falsePositives: 22, falseNegatives: 19 },
  { model: 'Timing Analysis', precision: 89.5, falsePositives: 31, falseNegatives: 28 },
  { model: 'Device Detection', precision: 98.1, falsePositives: 6, falseNegatives: 3 },
];

const confusionMatrixData = [
  { prediction: 'True Positive', count: 847, percentage: 85.2 },
  { prediction: 'False Positive', count: 73, percentage: 7.3 },
  { prediction: 'False Negative', count: 51, percentage: 5.1 },
  { prediction: 'True Negative', count: 24, percentage: 2.4 },
];

const alertAccuracyData = [
  { alertType: 'Similarity', accuracy: 96.2, color: '#ef4444' },
  { alertType: 'Timing', accuracy: 89.5, color: '#f97316' },
  { alertType: 'Pattern', accuracy: 92.8, color: '#eab308' },
  { alertType: 'Revision', accuracy: 94.1, color: '#3b82f6' },
  { alertType: 'Device', accuracy: 98.1, color: '#22c55e' },
];

export default function PrecisionPage() {
  const [currentPrecision, setCurrentPrecision] = useState(94.2);
  const [trend, setTrend] = useState(1.8);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setCurrentPrecision(prev => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 0.5)));
      setTrend(prev => (Math.random() - 0.5) * 4);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
              <Target className="h-6 w-6 text-admin-normal-safe" />
              <h1 className="text-2xl font-bold">Precision Analytics</h1>
              <Badge className="bg-admin-normal-safe text-white">
                {currentPrecision.toFixed(1)}% Current
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-admin-normal-safe">{currentPrecision.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Current Precision</div>
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
                <div className="text-2xl font-bold text-admin-sequential-pattern">90.8%</div>
                <div className="text-sm text-muted-foreground">Recall</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-response-anomaly">92.7%</div>
                <div className="text-sm text-muted-foreground">F1-Score</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-critical-alert">73</div>
                <div className="text-sm text-muted-foreground">False Positives (7 days)</div>
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
                <span>7-Day Precision Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={precisionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis domain={[85, 100]} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                  />
                  <Area type="monotone" dataKey="precision" stroke="hsl(var(--admin-normal-safe))" fill="hsl(var(--admin-normal-safe))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="recall" stroke="hsl(var(--admin-sequential-pattern))" fill="hsl(var(--admin-sequential-pattern))" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="f1Score" stroke="hsl(var(--admin-response-anomaly))" fill="hsl(var(--admin-response-anomaly))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Model Performance Comparison</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[80, 100]} />
                  <YAxis dataKey="model" type="category" width={120} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Bar dataKey="precision" fill="hsl(var(--admin-normal-safe))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {confusionMatrixData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{item.prediction}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                      <Badge variant="outline">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-admin-info/10 rounded">
                <p className="text-sm text-muted-foreground">
                  <strong>Overall Accuracy:</strong> The system correctly identifies anomalies with 94.2% precision, 
                  meaning that 94.2% of flagged candidates are actually engaging in suspicious behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Type Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={alertAccuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="accuracy"
                    label={({ name, accuracy }) => `${name}: ${accuracy}%`}
                  >
                    {alertAccuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Improvement Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-admin-normal-safe/10 border border-admin-normal-safe rounded">
                <h3 className="font-semibold text-admin-normal-safe mb-2">Strengths</h3>
                <ul className="text-sm space-y-1">
                  <li>• Device detection: 98.1% accuracy</li>
                  <li>• Similarity detection: 96.2% accuracy</li>
                  <li>• Low false negative rate: 5.1%</li>
                </ul>
              </div>
              
              <div className="p-4 bg-admin-warning/10 border border-admin-warning rounded">
                <h3 className="font-semibold text-admin-warning mb-2">Areas for Improvement</h3>
                <ul className="text-sm space-y-1">
                  <li>• Timing analysis needs refinement</li>
                  <li>• Pattern detection false positives</li>
                  <li>• Threshold tuning required</li>
                </ul>
              </div>
              
              <div className="p-4 bg-admin-sequential-pattern/10 border border-admin-sequential-pattern rounded">
                <h3 className="font-semibold text-admin-sequential-pattern mb-2">Recommendations</h3>
                <ul className="text-sm space-y-1">
                  <li>• Implement adaptive thresholds</li>
                  <li>• Enhance training data quality</li>
                  <li>• Regular model retraining</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}