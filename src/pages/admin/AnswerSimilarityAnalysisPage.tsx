import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArrowLeft, Grid3X3, BarChart3, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line
} from "recharts";

// Mock data for Primary Statistics (Union of all anomaly types)
const primaryStatisticsData = [
  { 
    name: 'Test 1', 
    sharedWrong: 45, 
    longestRun: 32, 
    longestIncorrect: 28, 
    stringI2: 18, 
    tJoint: 23, 
    g2: 15,
    total: 161
  },
  { 
    name: 'Test 2', 
    sharedWrong: 52, 
    longestRun: 38, 
    longestIncorrect: 35, 
    stringI2: 22, 
    tJoint: 28, 
    g2: 19,
    total: 194
  },
  { 
    name: 'Test 3', 
    sharedWrong: 38, 
    longestRun: 25, 
    longestIncorrect: 21, 
    stringI2: 14, 
    tJoint: 18, 
    g2: 12,
    total: 128
  },
  { 
    name: 'Test 4', 
    sharedWrong: 47, 
    longestRun: 34, 
    longestIncorrect: 30, 
    stringI2: 20, 
    tJoint: 25, 
    g2: 17,
    total: 173
  },
  { 
    name: 'Test 5', 
    sharedWrong: 41, 
    longestRun: 29, 
    longestIncorrect: 26, 
    stringI2: 16, 
    tJoint: 21, 
    g2: 14,
    total: 147
  }
];

// Mock data for similarity analysis overview
const similarityOverviewData = [
  { test: 'Test 1', candidatePairs: 847, highSimilarity: 23, mediumSimilarity: 67, lowSimilarity: 757 },
  { test: 'Test 2', candidatePairs: 923, highSimilarity: 31, mediumSimilarity: 89, lowSimilarity: 803 },
  { test: 'Test 3', candidatePairs: 654, highSimilarity: 12, mediumSimilarity: 45, lowSimilarity: 597 },
  { test: 'Test 4', candidatePairs: 789, highSimilarity: 28, mediumSimilarity: 73, lowSimilarity: 688 },
  { test: 'Test 5', candidatePairs: 712, highSimilarity: 19, mediumSimilarity: 58, lowSimilarity: 635 }
];

// Mock data for detailed similarity metrics
const detailedSimilarityData = [
  { metric: 'JI1I2 (Shared Wrong)', value: 0.73, threshold: 0.65, flagged: 89 },
  { metric: 'STRINGL (Longest Run)', value: 0.68, threshold: 0.60, flagged: 76 },
  { metric: 'STRINGI1 (Longest Incorrect)', value: 0.71, threshold: 0.62, flagged: 82 },
  { metric: 'STRINGI2', value: 0.64, threshold: 0.58, flagged: 63 },
  { metric: 'TJOINT', value: 0.69, threshold: 0.61, flagged: 78 },
  { metric: 'G2 Anomalies', value: 0.66, threshold: 0.59, flagged: 71 }
];

// Mock candidate similarity data
const candidateSimilarityData = [
  { id: 'AS001', name: 'John Smith', email: 'john@example.com', similarityScore: 0.94, matchedWith: 'AS002', testName: 'Math Assessment', flagType: 'Critical' },
  { id: 'AS002', name: 'Sarah Johnson', email: 'sarah@example.com', similarityScore: 0.91, matchedWith: 'AS003', testName: 'Math Assessment', flagType: 'High' },
  { id: 'AS003', name: 'Mike Davis', email: 'mike@example.com', similarityScore: 0.87, matchedWith: 'AS001', testName: 'Science Test', flagType: 'High' },
  { id: 'AS004', name: 'Lisa Wilson', email: 'lisa@example.com', similarityScore: 0.83, matchedWith: 'AS005', testName: 'English Test', flagType: 'Medium' },
  { id: 'AS005', name: 'David Brown', email: 'david@example.com', similarityScore: 0.79, matchedWith: 'AS004', testName: 'English Test', flagType: 'Medium' }
];

export function AnswerSimilarityAnalysisPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getSimilarityColor = (score: number) => {
    if (score > 0.9) return "#ef4444"; // Critical
    if (score > 0.8) return "#f97316"; // High
    if (score > 0.7) return "#eab308"; // Medium
    return "#22c55e"; // Low
  };

  const getThresholdColor = (value: number, threshold: number) => {
    return value > threshold ? "#ef4444" : "#22c55e";
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Answer Similarity Analysis</h1>
              <p className="text-muted-foreground">
                Comprehensive analysis of answer patterns and candidate similarities
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-admin-critical-alert border-admin-critical-alert">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Similarity Analysis
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="candidates">Flagged Candidates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Primary Statistics Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Primary Statistics - Union of All Anomaly Types</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combined analysis of JI1I2, STRINGL, STRINGI1, STRINGI2, TJOINT, and G2 anomalies
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={primaryStatisticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [value, name]}
                      labelFormatter={(label) => `Test: ${label}`}
                    />
                    <Bar dataKey="sharedWrong" stackId="a" fill="#ef4444" name="Shared Wrong Answers (JI1I2)" />
                    <Bar dataKey="longestRun" stackId="a" fill="#f97316" name="Longest Run (STRINGL)" />
                    <Bar dataKey="longestIncorrect" stackId="a" fill="#eab308" name="Longest Incorrect (STRINGI1)" />
                    <Bar dataKey="stringI2" stackId="a" fill="#3b82f6" name="STRINGI2" />
                    <Bar dataKey="tJoint" stackId="a" fill="#8b5cf6" name="TJOINT" />
                    <Bar dataKey="g2" stackId="a" fill="#06b6d4" name="G2 Anomalies" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Similarity Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Similarity Distribution Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={similarityOverviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="highSimilarity" stackId="similarity" fill="#ef4444" name="High Similarity (>0.8)" />
                    <Bar dataKey="mediumSimilarity" stackId="similarity" fill="#f97316" name="Medium Similarity (0.6-0.8)" />
                    <Bar dataKey="lowSimilarity" stackId="similarity" fill="#22c55e" name="Low Similarity (<0.6)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detailedSimilarityData.map((metric, index) => (
                <Card key={metric.metric}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Current Value</span>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: getThresholdColor(metric.value, metric.threshold) }}
                        >
                          {metric.value.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Threshold</span>
                        <span className="text-lg">{metric.threshold.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Flagged Cases</span>
                        <Badge variant={metric.value > metric.threshold ? "destructive" : "secondary"}>
                          {metric.flagged}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(metric.value / 1) * 100}%`,
                            backgroundColor: getThresholdColor(metric.value, metric.threshold)
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Flagged Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Flagged Candidates by Similarity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Candidate ID</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Similarity Score</th>
                        <th className="text-left p-3 font-medium">Matched With</th>
                        <th className="text-left p-3 font-medium">Test</th>
                        <th className="text-left p-3 font-medium">Flag Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateSimilarityData.map((candidate) => (
                        <tr key={candidate.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono text-sm">{candidate.id}</td>
                          <td className="p-3">{candidate.name}</td>
                          <td className="p-3 text-muted-foreground">{candidate.email}</td>
                          <td className="p-3">
                            <span 
                              className="font-bold"
                              style={{ color: getSimilarityColor(candidate.similarityScore) }}
                            >
                              {(candidate.similarityScore * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-3 font-mono text-sm">{candidate.matchedWith}</td>
                          <td className="p-3">{candidate.testName}</td>
                          <td className="p-3">
                            <Badge 
                              variant={
                                candidate.flagType === 'Critical' ? 'destructive' :
                                candidate.flagType === 'High' ? 'secondary' : 'outline'
                              }
                            >
                              {candidate.flagType}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}