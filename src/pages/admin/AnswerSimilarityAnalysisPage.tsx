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
  ReferenceLine,
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

// Mock G2 Statistics data for vertical chart
const g2StatisticsData = [
  { candidate: 'Candidate_1', g2Value: 1.8, aboveThreshold: false },
  { candidate: 'Candidate_2', g2Value: 4.8, aboveThreshold: true },
  { candidate: 'Candidate_3', g2Value: 3.7, aboveThreshold: true },
  { candidate: 'Candidate_4', g2Value: 3.0, aboveThreshold: false },
  { candidate: 'Candidate_5', g2Value: 0.8, aboveThreshold: false },
  { candidate: 'Candidate_6', g2Value: 0.8, aboveThreshold: false },
  { candidate: 'Candidate_7', g2Value: 0.3, aboveThreshold: false },
  { candidate: 'Candidate_8', g2Value: 4.3, aboveThreshold: true },
  { candidate: 'Candidate_9', g2Value: 3.0, aboveThreshold: false },
  { candidate: 'Candidate_10', g2Value: 3.6, aboveThreshold: true },
  { candidate: 'Candidate_11', g2Value: 4.8, aboveThreshold: true },
  { candidate: 'Candidate_12', g2Value: 4.2, aboveThreshold: true },
  { candidate: 'Candidate_13', g2Value: 1.0, aboveThreshold: false },
  { candidate: 'Candidate_14', g2Value: 1.0, aboveThreshold: false }
];

// Mock similarity heatmap data - calculate weighted similarity
const generateSimilarityHeatmapData = () => {
  const candidates = Array.from({ length: 22 }, (_, i) => i);
  const data = [];
  
  for (let i = 0; i < candidates.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      if (i === j) {
        data.push({ x: j, y: i, similarity: 1.0 });
      } else {
        // Simulate calculation: overlap, matches, weight, final similarity
        const totalItems = 100;
        const overlap = Math.floor(Math.random() * 40) + 60; // 60-100 items
        if (overlap < 15) {
          data.push({ x: j, y: i, similarity: 0 }); // Skip if < 15 overlapping
        } else {
          const matches = Math.floor(Math.random() * overlap);
          const rawSimilarity = matches / overlap;
          const weight = overlap / totalItems;
          const finalSimilarity = rawSimilarity * weight;
          data.push({ x: j, y: i, similarity: Math.min(finalSimilarity, 1.0) });
        }
      }
    }
  }
  return data;
};

const similarityHeatmapData = generateSimilarityHeatmapData();

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

  const getG2Color = (value: number) => {
    return value > 3.09 ? "#ef4444" : "#3b82f6"; // Red if above threshold, blue if below
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
            {/* Original Answer Similarity Analysis Chart */}
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

            {/* G2 Statistics Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>G2 Statistics with Cut-off Highlight (3.09)</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  G2 statistic values for candidate_15 compared to other candidates. Red bars indicate values above the 3.09 threshold.
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart 
                    data={g2StatisticsData} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      domain={[-5, 5]} 
                      label={{ value: 'G2 Statistic', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="candidate" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(2), 'G2 Value']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <ReferenceLine x={3.09} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />
                    <Bar dataKey="g2Value" name="G2 Statistic">
                      {g2StatisticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getG2Color(entry.g2Value)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm">Below Threshold</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span className="text-sm">Above Threshold (3.09)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similarity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Grid3X3 className="h-5 w-5" />
                  <span>Sample: Candidate Response Similarity Matrix</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Weighted similarity heatmap calculated using overlap-based algorithm. Darker colors indicate lower similarity, brighter colors indicate higher similarity.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={500}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          domain={[0, 21]} 
                          tickCount={11}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          domain={[0, 21]} 
                          tickCount={11}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string, props: any) => [
                            props.payload.similarity.toFixed(3), 
                            'Similarity'
                          ]}
                          labelFormatter={(label, payload) => 
                            payload && payload[0] ? 
                            `Candidate ${payload[0].payload.y} vs ${payload[0].payload.x}` : 
                            ''
                          }
                        />
                        <Scatter dataKey="similarity" fill="#8884d8">
                          {similarityHeatmapData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={getSimilarityHeatmapColor(entry.similarity)} 
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Color Legend */}
                  <div className="w-20 ml-4 flex flex-col justify-center">
                    <div className="text-xs font-medium mb-2 text-center">Similarity</div>
                    <div className="flex flex-col space-y-1">
                      {[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2].map((val) => (
                        <div key={val} className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 border border-gray-300" 
                            style={{ backgroundColor: getSimilarityHeatmapColor(val) }}
                          ></div>
                          <span className="text-xs">{val.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
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