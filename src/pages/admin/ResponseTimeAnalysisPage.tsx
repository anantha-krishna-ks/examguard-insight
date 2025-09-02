import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, TrendingUp, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";

// Mock data for OS Curve and item time frequency distribution
const osCurveData = [
  { percentile: 0, responseTime: 12, frequency: 2 },
  { percentile: 10, responseTime: 25, frequency: 8 },
  { percentile: 20, responseTime: 35, frequency: 15 },
  { percentile: 30, responseTime: 42, frequency: 23 },
  { percentile: 40, responseTime: 48, frequency: 31 },
  { percentile: 50, responseTime: 55, frequency: 45 },
  { percentile: 60, responseTime: 62, frequency: 38 },
  { percentile: 70, responseTime: 68, frequency: 28 },
  { percentile: 80, responseTime: 75, frequency: 18 },
  { percentile: 90, responseTime: 85, frequency: 8 },
  { percentile: 100, responseTime: 120, frequency: 3 },
];

// Mock data for mean and standard deviation per item
const itemStatsData = [
  { item: "Q1", mean: 45.2, stdDev: 12.3, difficulty: "Easy" },
  { item: "Q2", mean: 62.8, stdDev: 18.7, difficulty: "Medium" },
  { item: "Q3", mean: 78.5, stdDev: 25.1, difficulty: "Hard" },
  { item: "Q4", mean: 38.9, stdDev: 8.4, difficulty: "Easy" },
  { item: "Q5", mean: 95.2, stdDev: 32.6, difficulty: "Expert" },
  { item: "Q6", mean: 55.7, stdDev: 15.2, difficulty: "Medium" },
  { item: "Q7", mean: 42.1, stdDev: 11.8, difficulty: "Easy" },
  { item: "Q8", mean: 88.3, stdDev: 28.9, difficulty: "Hard" },
];

// Mock data for Response Time vs Difficulty with answer correctness
const difficultyResponseData = [
  { responseTime: 25, difficulty: 1, correct: true, candidate: "C001" },
  { responseTime: 32, difficulty: 1, correct: true, candidate: "C002" },
  { responseTime: 28, difficulty: 1, correct: false, candidate: "C003" },
  { responseTime: 45, difficulty: 2, correct: true, candidate: "C001" },
  { responseTime: 58, difficulty: 2, correct: false, candidate: "C002" },
  { responseTime: 52, difficulty: 2, correct: true, candidate: "C003" },
  { responseTime: 75, difficulty: 3, correct: true, candidate: "C001" },
  { responseTime: 82, difficulty: 3, correct: false, candidate: "C002" },
  { responseTime: 95, difficulty: 3, correct: false, candidate: "C003" },
  { responseTime: 120, difficulty: 4, correct: false, candidate: "C001" },
  { responseTime: 115, difficulty: 4, correct: true, candidate: "C002" },
  { responseTime: 105, difficulty: 4, correct: false, candidate: "C003" },
];

const difficultyLabels = {
  1: "Easy",
  2: "Medium", 
  3: "Hard",
  4: "Expert"
};

export default function ResponseTimeAnalysisPage() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItemStats = itemStatsData.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCorrectColor = (correct: boolean) => correct ? "#22c55e" : "#ef4444";

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Response Time Analysis</h1>
            <p className="text-muted-foreground">Detailed forensic analysis of response time patterns</p>
          </div>
        </div>
        <Badge variant="outline" className="text-admin-response-anomaly border-admin-response-anomaly">
          Post-Test Forensics
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search items or difficulty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="C001">Candidate C001</SelectItem>
                <SelectItem value="C002">Candidate C002</SelectItem>
                <SelectItem value="C003">Candidate C003</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* OS Curve and Frequency Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-admin-response-anomaly" />
            <CardTitle>OS Curve & Item Time Frequency Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OS Curve */}
            <div>
              <h4 className="text-sm font-medium mb-4">OS Curve (Cumulative Distribution)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={osCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="percentile" label={{ value: 'Percentile', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Response Time (s)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number, name: string) => [`${value}s`, 'Response Time']} />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="hsl(var(--admin-response-anomaly))" 
                    fill="hsl(var(--admin-response-anomaly) / 0.3)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Frequency Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-4">Time Frequency Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={osCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="responseTime" label={{ value: 'Response Time (s)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="hsl(var(--admin-sequential-pattern))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mean and Standard Deviation */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-admin-answer-revision" />
            <CardTitle>Item-wise Response Time Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredItemStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}s`, 
                  name === 'mean' ? 'Mean' : 'Std Deviation'
                ]} 
              />
              <Bar dataKey="mean" fill="hsl(var(--admin-answer-revision))" name="mean" />
              <Bar dataKey="stdDev" fill="hsl(var(--admin-answer-revision) / 0.6)" name="stdDev" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time vs Difficulty with Correctness */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-admin-critical-alert" />
            <CardTitle>Response Time vs Difficulty (Answer Correctness)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Correct Answer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Wrong Answer</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={difficultyResponseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="difficulty" 
                type="number"
                domain={[0.5, 4.5]}
                ticks={[1, 2, 3, 4]}
                tickFormatter={(value) => difficultyLabels[value as keyof typeof difficultyLabels]}
                label={{ value: 'Difficulty Level', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="responseTime"
                label={{ value: 'Response Time (s)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 border rounded shadow">
                        <p>Candidate: {data.candidate}</p>
                        <p>Difficulty: {difficultyLabels[data.difficulty as keyof typeof difficultyLabels]}</p>
                        <p>Response Time: {data.responseTime}s</p>
                        <p>Answer: {data.correct ? 'Correct' : 'Wrong'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="responseTime">
                {difficultyResponseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorrectColor(entry.correct)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}