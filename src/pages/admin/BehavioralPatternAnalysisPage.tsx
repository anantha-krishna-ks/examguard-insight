import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
  { name: 'Test 1', sequentialPattern: 152, answerRevision: 26 },
  { name: 'Test 2', sequentialPattern: 206, answerRevision: 51 },
  { name: 'Test 3', sequentialPattern: 97, answerRevision: 5 },
  { name: 'Test 4', sequentialPattern: 134, answerRevision: 33 },
  { name: 'Test 5', sequentialPattern: 178, answerRevision: 42 },
];

const locationLevelData = [
  { name: 'North Region', sequentialPattern: 324, answerRevision: 67 },
  { name: 'South Region', sequentialPattern: 289, answerRevision: 54 },
  { name: 'East Region', sequentialPattern: 198, answerRevision: 43 },
  { name: 'West Region', sequentialPattern: 245, answerRevision: 38 },
  { name: 'Central Region', sequentialPattern: 312, answerRevision: 71 },
];

const testCenterLevelData = [
  { name: 'TC-001', sequentialPattern: 89, answerRevision: 21 },
  { name: 'TC-002', sequentialPattern: 76, answerRevision: 18 },
  { name: 'TC-003', sequentialPattern: 103, answerRevision: 28 },
  { name: 'TC-004', sequentialPattern: 94, answerRevision: 15 },
  { name: 'TC-005', sequentialPattern: 87, answerRevision: 23 },
  { name: 'TC-006', sequentialPattern: 112, answerRevision: 31 },
];

const candidateData = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com', status: 'Completed', flagged: false, anomalyScore: 0.23, anomalyType: 'None', testName: 'Mathematics Assessment' },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', status: 'In Progress', flagged: true, anomalyScore: 0.87, anomalyType: 'Sequential Pattern', testName: 'Science Aptitude Test' },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', status: 'Completed', flagged: true, anomalyScore: 0.92, anomalyType: 'Answer Revision', testName: 'English Proficiency' },
  { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', status: 'Not Started', flagged: false, anomalyScore: 0.15, anomalyType: 'None', testName: 'Logic & Reasoning' },
  { id: 'C005', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Completed', flagged: true, anomalyScore: 0.78, anomalyType: 'Sequential Pattern', testName: 'Mathematics Assessment' },
];

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};

export function BehavioralPatternAnalysisPage() {
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
      if (segment === "answerRevision") {
        setClickedSegment("answerRevision");
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
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Sequential Pattern: {payload[0]?.value || 0}
          </p>
          <p className="text-sm text-orange-600">
            Answer Revision: {payload[1]?.value || 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total Anomalies: {(payload[0]?.value || 0) + (payload[1]?.value || 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            Click to drill down
          </p>
        </div>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (viewLevel === 'testcenter' && selectedLocation) {
      return `Behavioral Pattern Anomaly - ${selectedLocation} Test Centers`;
    }
    
    switch (viewLevel) {
      case 'test': return 'Behavioral Pattern Anomaly - Test Level';
      case 'location': return 'Behavioral Pattern Anomaly - Location Level';
      case 'testcenter': return 'Behavioral Pattern Anomaly - Test Center Level';
      default: return 'Behavioral Pattern Anomaly';
    }
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
              onClick={() => navigate("/admin")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Behavioral Pattern Anomaly Analysis</h1>
              <p className="text-muted-foreground">
                Hierarchical drill-down analysis at {levelLabels[viewLevel]} level
                {selectedLocation && ` - ${selectedLocation}`}
                {selectedTestCenter && ` - ${selectedTestCenter}`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-admin-answer-revision border-admin-answer-revision">
            Behavioral Analysis
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
                <BarChart3 className="h-5 w-5 text-admin-answer-revision" />
                <CardTitle>
                  Behavioral Pattern Anomaly - {levelLabels[viewLevel]} Level
                  {selectedLocation && ` (${selectedLocation})`}
                </CardTitle>
              </div>
              {clickedSegment && (
                <Badge variant="destructive">
                  Showing flagged candidates from answer revision segment
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sequentialPattern" 
                  fill="#2563eb" 
                  name="Sequential Pattern Numbers"
                  onClick={(data) => handleBarClick(data)}
                  style={{ cursor: "pointer" }}
                />
                <Bar 
                  dataKey="answerRevision" 
                  fill="#ea580c" 
                  name="Answer Revision Numbers"
                  onClick={(data) => handleBarClick(data, "answerRevision")}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Chart Legend and Info */}
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>Anomaly Student Numbers</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Sequential Pattern</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span>Answer Revision (Click orange segment for flagged candidates)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getCurrentData().reduce((sum, item) => sum + item.sequentialPattern, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Sequential Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {getCurrentData().reduce((sum, item) => sum + item.answerRevision, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Answer Revisions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getCurrentData().length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {viewLevel === 'test' ? 'Tests' : viewLevel === 'location' ? 'Locations' : 'Test Centers'} Analyzed
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
                        clickedSegment === "answerRevision" ? "Flagged Only" : 
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
    </div>
  );
}