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

// Mock data for Primary Statistics (Union of all anomaly types) and g2 anomalies
const similarityAnalysisData = [
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
            {/* Similarity Analysis Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Similarity Analysis</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Primary Statistics represents the union of JI1I2, STRINGL, STRINGI1, STRINGI2, TJOINT, and g2 anomalies
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={similarityAnalysisData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Anomaly Student Numbers', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [value, name]}
                      labelFormatter={(label) => `Test: ${label}`}
                    />
                    <Bar dataKey="primaryStatistics" fill="#2563eb" name="Primary Statistics" />
                    <Bar dataKey="g2Anomalies" fill="#ea580c" name="g2 anomalies" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm">Primary Statistics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-600 rounded"></div>
                    <span className="text-sm">g2 anomalies</span>
                  </div>
                </div>
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