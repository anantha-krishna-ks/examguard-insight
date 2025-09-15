import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArrowLeft, Grid3X3, BarChart3, Users, Filter, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CandidateChartsModal } from "@/components/admin/CandidateChartsModal";
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
  Scatter
} from "recharts";

type ViewLevel = "test" | "location" | "testcenter";
type FilterType = "all" | "flagged" | "unflagged";

// Mock data for different levels
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

const locationLevelData = [
  { name: 'New York', primaryStatistics: 189, g2Anomalies: 42 },
  { name: 'California', primaryStatistics: 156, g2Anomalies: 38 },
  { name: 'Texas', primaryStatistics: 134, g2Anomalies: 28 },
  { name: 'Florida', primaryStatistics: 178, g2Anomalies: 35 },
];

const testCenterLevelData = [
  { name: 'NYC Center A', primaryStatistics: 95, g2Anomalies: 18 },
  { name: 'NYC Center B', primaryStatistics: 87, g2Anomalies: 15 },
  { name: 'NYC Center C', primaryStatistics: 102, g2Anomalies: 22 },
];

const candidateData = [
  { id: 'AS001', name: 'John Smith', email: 'john@example.com', similarityScore: 0.94, matchedWith: 'AS002', testName: 'Math Assessment', flagType: 'Critical', flagged: true },
  { id: 'AS002', name: 'Sarah Johnson', email: 'sarah@example.com', similarityScore: 0.91, matchedWith: 'AS003', testName: 'Math Assessment', flagType: 'High', flagged: true },
  { id: 'AS003', name: 'Mike Davis', email: 'mike@example.com', similarityScore: 0.87, matchedWith: 'AS001', testName: 'Science Test', flagType: 'High', flagged: true },
  { id: 'AS004', name: 'Lisa Wilson', email: 'lisa@example.com', similarityScore: 0.83, matchedWith: 'AS005', testName: 'English Test', flagType: 'Medium', flagged: false },
  { id: 'AS005', name: 'David Brown', email: 'david@example.com', similarityScore: 0.79, matchedWith: 'AS004', testName: 'English Test', flagType: 'Medium', flagged: false }
];

// G2 Statistics data for the location tab
const g2StatisticsData = [
  { candidate: 'Candidate_1', g2Value: 1.8, isFlagged: false },
  { candidate: 'Candidate_2', g2Value: 4.7, isFlagged: true },
  { candidate: 'Candidate_3', g2Value: 3.7, isFlagged: true },
  { candidate: 'Candidate_4', g2Value: 2.9, isFlagged: false },
  { candidate: 'Candidate_5', g2Value: 0.8, isFlagged: false },
  { candidate: 'Candidate_6', g2Value: 0.8, isFlagged: false },
  { candidate: 'Candidate_7', g2Value: 0.3, isFlagged: false },
  { candidate: 'Candidate_8', g2Value: 4.3, isFlagged: true },
  { candidate: 'Candidate_9', g2Value: 2.9, isFlagged: false },
  { candidate: 'Candidate_10', g2Value: 3.6, isFlagged: true },
  { candidate: 'Candidate_11', g2Value: 4.8, isFlagged: true },
  { candidate: 'Candidate_12', g2Value: 4.1, isFlagged: true },
  { candidate: 'Candidate_13', g2Value: 1.0, isFlagged: false },
  { candidate: 'Candidate_14', g2Value: 0.9, isFlagged: false }
];

// Similarity heatmap data
const generateSimilarityMatrix = () => {
  const candidates = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'];
  const matrix = [];
  
  for (let i = 0; i < candidates.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      let similarity;
      if (i === j) {
        similarity = 1.0; // Perfect similarity with self
      } else {
        // Generate realistic similarity values based on algorithm
        const overlap = Math.floor(Math.random() * 30) + 15; // 15-45 overlapping items
        const matches = Math.floor(Math.random() * overlap * 0.8); // 0-80% matches
        const totalItems = 50; // Total test items
        
        if (overlap < 15) {
          similarity = 0; // Skip if less than 15 overlapping
        } else {
          const rawSimilarity = matches / overlap;
          const weight = overlap / totalItems;
          similarity = rawSimilarity * weight;
        }
      }
      
      matrix.push({
        x: j,
        y: i,
        similarity: Math.round(similarity * 100) / 100,
        candidateX: candidates[j],
        candidateY: candidates[i]
      });
    }
  }
  
  return matrix;
};

const similarityMatrixData = generateSimilarityMatrix();

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};


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
  const [viewLevel, setViewLevel] = useState<ViewLevel>("test");
  
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>("all");
  const [clickedSegment, setClickedSegment] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateCharts, setShowCandidateCharts] = useState(false);

  const getCurrentData = () => {
    if (viewLevel === "test") return testLevelData;
    if (viewLevel === "location") return locationLevelData;
    return testCenterLevelData;
  };

  const handleLevelChange = (level: ViewLevel) => {
    setViewLevel(level);
    setSelectedLocation(null);
    setSelectedTestCenter(null);
    setShowCandidates(false);
    setClickedSegment(null);
  };

  const handleBarClick = (data: any, segment?: string) => {
    if (viewLevel === "test") {
      // Drill down from test to location level
      setViewLevel("location");
    } else if (viewLevel === "location" && !selectedLocation) {
      setSelectedLocation(data.name);
      setViewLevel("testcenter");
    } else if (viewLevel === "testcenter") {
      setSelectedTestCenter(data.name);
      setShowCandidates(true);
      if (segment === "primaryStatistics") {
        setClickedSegment("primaryStatistics");
        setCandidateFilter("flagged");
      } else {
        setClickedSegment(null);
        setCandidateFilter("all");
      }
    }
  };

  const getFilteredCandidates = () => {
    return candidateData.filter(candidate => {
      if (candidateFilter === "flagged") return candidate.flagged;
      if (candidateFilter === "unflagged") return !candidate.flagged;
      return true;
    });
  };

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowCandidateCharts(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
        <Tabs value={viewLevel} onValueChange={handleLevelChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="testcenter">Test Center</TabsTrigger>
          </TabsList>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Answer Similarity Analysis - {levelLabels[viewLevel]} Level</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Primary Statistics represents the union of JI1I2, STRINGL, STRINGI1, STRINGI2, TJOINT, and g2 anomalies. Click bars to drill down.
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getCurrentData()} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Anomaly Student Numbers', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="primaryStatistics" 
                      fill="#2563eb" 
                      name="Primary Statistics"
                      onClick={(data) => handleBarClick(data, "primaryStatistics")}
                      style={{ cursor: 'pointer' }}
                    />
                    <Bar 
                      dataKey="g2Anomalies" 
                      fill="#ea580c" 
                      name="g2 anomalies"
                      onClick={(data) => handleBarClick(data, "g2Anomalies")}
                      style={{ cursor: 'pointer' }}
                    />
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

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            {/* G2 Statistics Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>G2 Statistics with Cut-off Highlight (3.09)</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  G2 values for each candidate with candidates on Y-axis (vertical orientation)
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart 
                    data={g2StatisticsData} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      domain={[-1, 5]} 
                      label={{ value: 'G2 Statistic', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="candidate" 
                      label={{ value: 'Candidates', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(2), 'G2 Value']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar 
                      dataKey="g2Value"
                      name="G2 Value"
                    >
                      {g2StatisticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isFlagged ? "#ef4444" : "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">Normal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Flagged (&gt;3.09)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-2 border border-red-500 border-dashed"></div>
                    <span className="text-sm">Cut-off = 3.09</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similarity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Grid3X3 className="h-5 w-5" />
                  <span>Candidate Response Similarity Matrix</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Weighted similarity based on overlapping responses (minimum 15 items overlap required)
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={600}>
                  <ScatterChart
                    margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      domain={[0, 19]}
                      tickFormatter={(value) => `C${value + 1}`}
                      label={{ value: 'Candidates', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      domain={[0, 19]}
                      tickFormatter={(value) => `C${value + 1}`}
                      label={{ value: 'Candidates', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string, props: any) => [
                        props.payload.similarity.toFixed(3), 
                        'Similarity'
                      ]}
                      labelFormatter={(label, payload) => 
                        payload && payload[0] ? 
                        `${payload[0].payload.candidateY} vs ${payload[0].payload.candidateX}` : 
                        ''
                      }
                    />
                    <Scatter 
                      data={similarityMatrixData} 
                      fill="#8884d8"
                    >
                      {similarityMatrixData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${240 + (entry.similarity * 60)}, 70%, ${30 + (entry.similarity * 50)}%)`}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center items-center space-x-4">
                  <span className="text-sm font-medium">Similarity Scale:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4" style={{ backgroundColor: 'hsl(240, 70%, 30%)' }}></div>
                    <span className="text-sm">0.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4" style={{ backgroundColor: 'hsl(270, 70%, 55%)' }}></div>
                    <span className="text-sm">0.5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4" style={{ backgroundColor: 'hsl(300, 70%, 80%)' }}></div>
                    <span className="text-sm">1.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Center Tab */}
          <TabsContent value="testcenter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Answer Similarity Analysis - {levelLabels[viewLevel]} Level</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Primary Statistics represents the union of JI1I2, STRINGL, STRINGI1, STRINGI2, TJOINT, and g2 anomalies. Click bars to drill down.
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getCurrentData()} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Anomaly Student Numbers', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="primaryStatistics" 
                      fill="#2563eb" 
                      name="Primary Statistics"
                      onClick={(data) => handleBarClick(data, "primaryStatistics")}
                      style={{ cursor: 'pointer' }}
                    />
                    <Bar 
                      dataKey="g2Anomalies" 
                      fill="#ea580c" 
                      name="g2 anomalies"
                      onClick={(data) => handleBarClick(data, "g2Anomalies")}
                      style={{ cursor: 'pointer' }}
                    />
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

            {/* Candidate List - Only show when drilling down to test center level */}
            {showCandidates && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Flagged Candidates</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Select value={candidateFilter} onValueChange={(value: FilterType) => setCandidateFilter(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Candidates</SelectItem>
                          <SelectItem value="flagged">Flagged Only</SelectItem>
                          <SelectItem value="unflagged">Not Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredCandidates().map((candidate) => (
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
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCandidateClick(candidate)}
                                className="flex items-center space-x-1"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>

        {/* Candidate Charts Modal */}
        {selectedCandidate && (
          <CandidateChartsModal
            candidate={selectedCandidate}
            isOpen={showCandidateCharts}
            onClose={() => {
              setShowCandidateCharts(false);
              setSelectedCandidate(null);
            }}
          />
        )}
      </div>
    </div>
  );
}