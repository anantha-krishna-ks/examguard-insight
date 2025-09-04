import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArrowLeft, BarChart3, Filter, Users, Eye, EyeOff, Brain } from "lucide-react";
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

type ViewLevel = 'test' | 'location' | 'testcenter';
type FilterType = 'all' | 'flagged' | 'unflagged';

interface BehavioralPatternAnalysisPageProps {}

// Mock data for different levels
const testLevelData = [
  { name: 'Test 1', sequentialPattern: 152, answerRevision: 26, changeFrequency: 34 },
  { name: 'Test 2', sequentialPattern: 206, answerRevision: 51, changeFrequency: 67 },
  { name: 'Test 3', sequentialPattern: 97, answerRevision: 5, changeFrequency: 12 },
  { name: 'Test 4', sequentialPattern: 134, answerRevision: 33, changeFrequency: 45 },
  { name: 'Test 5', sequentialPattern: 178, answerRevision: 42, changeFrequency: 56 },
];

const locationLevelData = [
  { name: 'Hyderabad', sequentialPattern: 324, answerRevision: 67, changeFrequency: 89 },
  { name: 'Malaysia', sequentialPattern: 289, answerRevision: 54, changeFrequency: 78 },
  { name: 'Mysore', sequentialPattern: 198, answerRevision: 43, changeFrequency: 56 },
  { name: 'Noida', sequentialPattern: 245, answerRevision: 38, changeFrequency: 63 },
  { name: 'Central Region', sequentialPattern: 312, answerRevision: 71, changeFrequency: 94 },
];

const testCenterLevelData = [
  { name: 'HYD-001', sequentialPattern: 89, answerRevision: 21, changeFrequency: 32 },
  { name: 'HYD-002', sequentialPattern: 76, answerRevision: 18, changeFrequency: 28 },
  { name: 'HYD-003', sequentialPattern: 103, answerRevision: 28, changeFrequency: 41 },
  { name: 'HYD-004', sequentialPattern: 94, answerRevision: 15, changeFrequency: 36 },
  { name: 'HYD-005', sequentialPattern: 87, answerRevision: 23, changeFrequency: 34 },
  { name: 'HYD-006', sequentialPattern: 112, answerRevision: 31, changeFrequency: 45 },
];

const behavioralCandidateData = [
  { id: 'BP001', name: 'Raj Patel', email: 'raj@example.com', status: 'Completed', flagged: true, anomalyScore: 0.89, anomalyType: 'Sequential Pattern', testName: 'Behavioral Assessment A' },
  { id: 'BP002', name: 'Priya Singh', email: 'priya@example.com', status: 'In Progress', flagged: false, anomalyScore: 0.23, anomalyType: 'None', testName: 'Pattern Recognition Test' },
  { id: 'BP003', name: 'Kumar Das', email: 'kumar@example.com', status: 'Completed', flagged: true, anomalyScore: 0.94, anomalyType: 'Answer Revision', testName: 'Cognitive Analysis' },
  { id: 'BP004', name: 'Anita Sharma', email: 'anita@example.com', status: 'Not Started', flagged: false, anomalyScore: 0.18, anomalyType: 'None', testName: 'Behavioral Assessment B' },
  { id: 'BP005', name: 'Vikram Gupta', email: 'vikram@example.com', status: 'Completed', flagged: true, anomalyScore: 0.81, anomalyType: 'Change Frequency', testName: 'Pattern Recognition Test' },
];

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};

export function BehavioralPatternAnalysisPage({}: BehavioralPatternAnalysisPageProps) {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('test');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>('all');
  const [clickedSegment, setClickedSegment] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateCharts, setShowCandidateCharts] = useState(false);

  const getCurrentData = () => {
    if (viewLevel === 'test') return testLevelData;
    if (viewLevel === 'location') return locationLevelData;
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
    if (viewLevel === 'test') {
      // Drill down from test to location level
      setViewLevel('location');
    } else if (viewLevel === 'location' && !selectedLocation) {
      setSelectedLocation(data.name);
      setViewLevel('testcenter');
    } else if (viewLevel === 'testcenter') {
      setSelectedTestCenter(data.name);
      setShowCandidates(true);
      if (segment === 'sequentialPattern' || segment === 'answerRevision' || segment === 'changeFrequency') {
        setClickedSegment(segment);
        setCandidateFilter('flagged');
      } else {
        setClickedSegment(null);
        setCandidateFilter('all');
      }
    }
  };

  const getFilteredCandidates = () => {
    let filtered = behavioralCandidateData;
    
    if (candidateFilter === 'flagged') {
      filtered = filtered.filter(c => c.flagged);
    } else if (candidateFilter === 'unflagged') {
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
              {entry.name}: {entry.value}
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
              <h1 className="text-3xl font-bold">Behavioral Pattern Anomaly Analysis</h1>
              <p className="text-muted-foreground">
                Hierarchical drill-down analysis at {levelLabels[viewLevel]} level
                {selectedLocation && ` - ${selectedLocation}`}
                {selectedTestCenter && ` - ${selectedTestCenter}`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-admin-answer-revision border-admin-answer-revision">
            <Brain className="h-4 w-4 mr-2" />
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
                  Showing flagged candidates from {clickedSegment} segment
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
                  dataKey="sequentialPattern" 
                  fill="#2563eb" 
                  name="Sequential Pattern"
                  onClick={(data) => handleBarClick(data, "sequentialPattern")}
                  style={{ cursor: "pointer" }}
                />
                <Bar 
                  dataKey="answerRevision" 
                  fill="#ea580c" 
                  name="Answer Revision"
                  onClick={(data) => handleBarClick(data, "answerRevision")}
                  style={{ cursor: "pointer" }}
                />
                <Bar 
                  dataKey="changeFrequency" 
                  fill="#10b981" 
                  name="Change Frequency"
                  onClick={(data) => handleBarClick(data, "changeFrequency")}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>Behavioral Pattern Anomaly Distribution</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Sequential Pattern</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span>Answer Revision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Change Frequency (Click for flagged candidates)</span>
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
                        clickedSegment ? "Flagged Only" : 
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
                          className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
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