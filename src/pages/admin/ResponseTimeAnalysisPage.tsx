import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, BarChart3, Filter, Users, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  { id: 'C001', name: 'John Doe', email: 'john@example.com', status: 'Completed', flagged: false, anomalyScore: 0.23 },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', status: 'In Progress', flagged: true, anomalyScore: 0.87 },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', status: 'Completed', flagged: true, anomalyScore: 0.92 },
  { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', status: 'Not Started', flagged: false, anomalyScore: 0.15 },
  { id: 'C005', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Completed', flagged: true, anomalyScore: 0.78 },
];

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};

const sliderMarks = [
  { value: 0, label: "Test" },
  { value: 50, label: "Location" },
  { value: 100, label: "Test Center" }
];

export default function ResponseTimeAnalysisPage() {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>("test");
  const [sliderValue, setSliderValue] = useState([0]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>("all");
  const [clickedSegment, setClickedSegment] = useState<string | null>(null);

  const getCurrentData = () => {
    if (viewLevel === "test") return testLevelData;
    if (viewLevel === "location") return locationLevelData;
    return testCenterLevelData;
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const newLevel = value[0] <= 25 ? "test" : value[0] <= 75 ? "location" : "testcenter";
    setViewLevel(newLevel);
    setSelectedLocation(null);
    setSelectedTestCenter(null);
    setShowCandidates(false);
    setClickedSegment(null);
  };

  const handleBarClick = (data: any, segment?: string) => {
    if (viewLevel === "location" && !selectedLocation) {
      setSelectedLocation(data.name);
      setViewLevel("testcenter");
      setSliderValue([100]);
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
          {viewLevel !== "test" && (
            <p className="text-xs text-muted-foreground mt-1">
              Click to drill down
            </p>
          )}
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

      {/* Level Selector Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Analysis Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-2">
              <span className={viewLevel === "test" ? "font-medium text-foreground" : ""}>Test</span>
              <span className={viewLevel === "location" ? "font-medium text-foreground" : ""}>Location</span>
              <span className={viewLevel === "testcenter" ? "font-medium text-foreground" : ""}>Test Center</span>
            </div>
          </div>
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
                style={{ cursor: viewLevel !== "test" ? "pointer" : "default" }}
              />
              <Bar 
                dataKey="inProgress" 
                stackId="stack" 
                fill="#10b981" 
                name="In Progress"
                onClick={(data) => handleBarClick(data)}
                style={{ cursor: viewLevel !== "test" ? "pointer" : "default" }}
              />
              <Bar 
                dataKey="completed" 
                stackId="stack" 
                fill="#ef4444" 
                name="Completed"
                onClick={(data) => handleBarClick(data, "completed")}
                style={{ cursor: viewLevel !== "test" ? "pointer" : "default" }}
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
                    <SelectValue />
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Candidate ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Anomaly Score</th>
                    <th className="text-left p-2">Flag Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredCandidates().map((candidate) => (
                    <tr key={candidate.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-sm">{candidate.id}</td>
                      <td className="p-2">{candidate.name}</td>
                      <td className="p-2 text-muted-foreground">{candidate.email}</td>
                      <td className="p-2">
                        <Badge 
                          variant={candidate.status === 'Completed' ? 'default' : 
                                  candidate.status === 'In Progress' ? 'secondary' : 'outline'}
                        >
                          {candidate.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <span className={candidate.anomalyScore > 0.7 ? 'text-red-500 font-medium' : 
                                       candidate.anomalyScore > 0.4 ? 'text-yellow-500' : 'text-green-500'}>
                          {candidate.anomalyScore.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-2">
                        {candidate.flagged ? (
                          <div className="flex items-center space-x-1 text-red-500">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">Flagged</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-green-500">
                            <EyeOff className="h-4 w-4" />
                            <span className="text-sm">Normal</span>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}