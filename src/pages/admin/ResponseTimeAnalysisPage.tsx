import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, Filter, Users, Eye, EyeOff } from "lucide-react";
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
  Cell
} from "recharts";

type ViewLevel = "test" | "location" | "testcenter";
type FilterType = "all" | "flagged" | "unflagged";

// Mock data for different levels
const testLevelData = [
  { name: 'Test 1', notStarted: 5.43, inProgress: 78.26, completed: 16.30 },
  { name: 'Test 2', notStarted: 13.81, inProgress: 69.06, completed: 17.13 },
  { name: 'Test 3', notStarted: 0.00, inProgress: 90.91, completed: 9.09 },
];

const locationLevelData = [
  { name: 'New York', notStarted: 8.2, inProgress: 75.4, completed: 16.4 },
  { name: 'California', notStarted: 12.1, inProgress: 71.2, completed: 16.7 },
  { name: 'Texas', notStarted: 6.8, inProgress: 79.3, completed: 13.9 },
  { name: 'Florida', notStarted: 15.2, inProgress: 68.1, completed: 16.7 },
];

const testCenterLevelData = [
  { name: 'NYC Center A', notStarted: 7.1, inProgress: 76.8, completed: 16.1 },
  { name: 'NYC Center B', notStarted: 9.3, inProgress: 74.0, completed: 16.7 },
  { name: 'NYC Center C', notStarted: 8.8, inProgress: 75.2, completed: 16.0 },
];

const candidateData = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com', status: 'Completed', flagged: false, anomalyScore: 0.23, anomalyType: 'None', testName: 'Mathematics Assessment' },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', status: 'In Progress', flagged: true, anomalyScore: 0.87, anomalyType: 'Item Pre-Knowledge', testName: 'Science Aptitude Test' },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', status: 'Completed', flagged: true, anomalyScore: 0.92, anomalyType: 'Rapid Guessing', testName: 'English Proficiency' },
  { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', status: 'Not Started', flagged: false, anomalyScore: 0.15, anomalyType: 'None', testName: 'Logic & Reasoning' },
  { id: 'C005', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Completed', flagged: true, anomalyScore: 0.78, anomalyType: 'Item Pre-Knowledge', testName: 'Mathematics Assessment' },
];

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};


export default function ResponseTimeAnalysisPage() {
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
      if (segment === "completed") {
        setClickedSegment("completed");
        setCandidateFilter("flagged");
      } else {
        setClickedSegment(null);
        setCandidateFilter("all");
      }
    }
  };

  const getFilteredCandidates = () => {
    let filtered = candidateData;
    
    if (candidateFilter === "flagged") {
      filtered = filtered.filter(c => c.flagged);
    } else if (candidateFilter === "unflagged") {
      filtered = filtered.filter(c => !c.flagged);
    }
    
    return filtered;
  };

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowCandidateCharts(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Click to drill down
          </p>
        </div>
      );
    }
    return null;
  };

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
            <h1 className="text-3xl font-bold">Response Time-Based Anomaly Analysis</h1>
            <p className="text-muted-foreground">
              Hierarchical drill-down analysis at {levelLabels[viewLevel]} level
              {selectedLocation && ` - ${selectedLocation}`}
              {selectedTestCenter && ` - ${selectedTestCenter}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-admin-response-anomaly border-admin-response-anomaly">
          Response Anomalies
        </Badge>
      </div>

      {/* Level Selector Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Analysis Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={viewLevel} onValueChange={handleLevelChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="testcenter">Test Center</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-admin-response-anomaly" />
              <CardTitle>
                Response Time Anomaly - {levelLabels[viewLevel]} Level
                {selectedLocation && ` (${selectedLocation})`}
              </CardTitle>
            </div>
            {clickedSegment && (
              <Badge variant="destructive">
                Showing flagged candidates from completed segment
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="notStarted" 
                stackId="stack" 
                fill="#f59e0b" 
                name="Not Started"
                onClick={(data) => handleBarClick(data)}
                style={{ cursor: "pointer" }}
              />
              <Bar 
                dataKey="inProgress" 
                stackId="stack" 
                fill="#10b981" 
                name="In Progress"
                onClick={(data) => handleBarClick(data)}
                style={{ cursor: "pointer" }}
              />
              <Bar 
                dataKey="completed" 
                stackId="stack" 
                fill="#ef4444" 
                name="Completed"
                onClick={(data) => handleBarClick(data, "completed")}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>Percent Student Test Completion</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Not Started</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Completed (Click red segment for flagged candidates)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate List */}
      {showCandidates && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-admin-sequential-pattern" />
                <CardTitle>
                  Candidate Information - {selectedTestCenter}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={candidateFilter} onValueChange={(value: FilterType) => setCandidateFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={
                      clickedSegment === "completed" ? "Flagged Only" : 
                      candidateFilter === "all" ? "All Candidates" :
                      candidateFilter === "flagged" ? "Flagged Only" : "Unflagged Only"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Candidates</SelectItem>
                    <SelectItem value="flagged">Flagged Only</SelectItem>
                    <SelectItem value="unflagged">Unflagged Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="rounded-lg border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-semibold text-foreground">Candidate ID</th>
                      <th className="text-left p-4 font-semibold text-foreground">Name</th>
                      <th className="text-left p-4 font-semibold text-foreground">Email</th>
                      <th className="text-left p-4 font-semibold text-foreground">Test Name</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Anomaly Score</th>
                      <th className="text-left p-4 font-semibold text-foreground">Anomaly Type</th>
                      <th className="text-left p-4 font-semibold text-foreground">Flag Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredCandidates().map((candidate, index) => (
                      <tr 
                        key={candidate.id} 
                        onClick={() => handleCandidateClick(candidate)}
                        className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                      >
                        <td className="p-4 font-mono text-sm text-muted-foreground">{candidate.id}</td>
                        <td className="p-4 font-medium">{candidate.name}</td>
                        <td className="p-4 text-muted-foreground">{candidate.email}</td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className="bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1"
                          >
                            {candidate.testName}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={candidate.status === 'Completed' ? 'default' : 
                                    candidate.status === 'In Progress' ? 'secondary' : 'outline'}
                            className="font-medium"
                          >
                            {candidate.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${candidate.anomalyScore > 0.7 ? 'text-red-500' : 
                                         candidate.anomalyScore > 0.4 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {candidate.anomalyScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={candidate.anomalyType === 'None' ? 'secondary' : 'destructive'}
                            className="font-medium"
                          >
                            {candidate.anomalyType}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {candidate.flagged ? (
                            <div className="flex items-center space-x-2 text-red-500">
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">Flagged</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-green-500">
                              <EyeOff className="h-4 w-4" />
                              <span className="font-medium">Normal</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getFilteredCandidates().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No candidates found matching the current filter.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidate Charts Modal */}
      <CandidateChartsModal 
        candidate={selectedCandidate}
        isOpen={showCandidateCharts}
        onClose={() => setShowCandidateCharts(false)}
      />
    </div>
  );
}