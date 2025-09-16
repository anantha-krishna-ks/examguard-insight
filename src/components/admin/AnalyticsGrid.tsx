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

const testLevelData = [
  { 
    name: 'Test 1', 
    primaryStatistics: 161, // Union of: sharedWrong(45) + longestRun(32) + longestIncorrect(28) + stringI2(18) + tJoint(23) + g2(15)
    g2Anomalies: 26
  },
  { 
    name: 'Test 2', 
    primaryStatistics: 206, // Union of all anomaly types
    g2Anomalies: 51
  },
  { 
    name: 'Test 3', 
    primaryStatistics: 97, // Union of all anomaly types
    g2Anomalies: 5
  },
  { 
    name: 'Test 4', 
    primaryStatistics: 173, // Union of all anomaly types
    g2Anomalies: 34
  },
  { 
    name: 'Test 5', 
    primaryStatistics: 147, // Union of all anomaly types
    g2Anomalies: 22
  }
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

// AI Based Technique mock data
const advancedBehavioralData = [
  { category: 'Test 1', aiPowered: 45, biometric: 67 },
  { category: 'Test 2', aiPowered: 32, biometric: 54 },
  { category: 'Test 3', aiPowered: 28, biometric: 41 },
];

const technicalSecurityData = [
  { category: 'Test 1', systemIntegrity: 89, contentSecurity: 56, sessionRecording: 72 },
  { category: 'Test 2', systemIntegrity: 67, contentSecurity: 43, sessionRecording: 58 },
  { category: 'Test 3', systemIntegrity: 82, contentSecurity: 61, sessionRecording: 49 },
];

const multiModalData = [
  { category: 'Multi-Modal Data Capture', captured: 719, processed: 588, analyzed: 530 },
];

export function AnalyticsGrid({ onChartClick }: AnalyticsGridProps) {
  const navigate = useNavigate();
  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.9) return "#ef4444"; // Critical
    if (similarity > 0.8) return "#f97316"; // Warning
    return "#3b82f6"; // Normal
  };

  const getSimilarityHeatmapColor = (similarity: number) => {
    if (similarity === 0) return "#1a1a2e"; // Dark purple for no data
    if (similarity < 0.3) return "#16213e"; // Very dark blue
    if (similarity < 0.4) return "#0f3460"; // Dark blue
    if (similarity < 0.5) return "#0e4b99"; // Medium blue
    if (similarity < 0.6) return "#2e8b99"; // Teal
    if (similarity < 0.7) return "#5cb3cc"; // Light teal
    if (similarity < 0.8) return "#7dd3fc"; // Light blue
    if (similarity < 0.9) return "#fde047"; // Yellow
    return "#fef08a"; // Light yellow for high similarity
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Statistical Technique</h2>
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
            onClick={() => navigate('/admin/answer-similarity-analysis')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-4 w-4 text-admin-critical-alert" />
            <CardTitle className="text-sm font-medium">Answer Similarity Anomaly</CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testLevelData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Anomaly Student Numbers', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `Test: ${label}`}
              />
              <Bar 
                dataKey="primaryStatistics" 
                fill="#2563eb" 
                name="Primary Statistics"
                onClick={(data) => onChartClick('similarity', data)}
                style={{ cursor: 'pointer' }}
              />
              <Bar 
                dataKey="g2Anomalies" 
                fill="#ea580c" 
                name="g2 anomalies"
                onClick={(data) => onChartClick('similarity', data)}
                style={{ cursor: 'pointer' }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm">Primary Statistics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-sm">g2 anomalies</span>
            </div>
          </div>
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

      {/* AI Based Technique Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">AI Based Technique</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Advanced Behavioural Analytics */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/admin/advanced-behavioral-analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm font-medium">Advanced Behavioural Analytics</CardTitle>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={advancedBehavioralData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="aiPowered" fill="#3b82f6" name="AI-Powered Behaviour Detection" />
                  <Bar dataKey="biometric" fill="#10b981" name="Biometric Continuity Verification" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Behavioral pattern analysis</span>
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  AI Analytics
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Technical Security and Content Protection */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/admin/technical-security')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <CardTitle className="text-sm font-medium">Technical Security and Content Protection</CardTitle>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={technicalSecurityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="systemIntegrity" fill="#8b5cf6" name="System Integrity Monitoring" />
                  <Bar dataKey="contentSecurity" fill="#f59e0b" name="Content Security and Anti-Harvesting" />
                  <Bar dataKey="sessionRecording" fill="#10b981" name="Session Recording and Documentation" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Security monitoring results</span>
                <Badge variant="outline" className="text-purple-500 border-purple-500">
                  Security AI
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Modal Data Capture */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/admin/multi-modal-data-capture')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm font-medium">Multi-Modal Data Capture</CardTitle>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={multiModalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="captured" fill="#059669" name="Captured" />
                  <Bar dataKey="processed" fill="#0d9488" name="Processed" />
                  <Bar dataKey="analyzed" fill="#0891b2" name="Analyzed" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Multi-modal data processing</span>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Data AI
                </Badge>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}