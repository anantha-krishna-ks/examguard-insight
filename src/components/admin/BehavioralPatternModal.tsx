import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";
import { 
  Download, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  BarChart3,
  Activity,
  Eye,
  FileText,
  X
} from "lucide-react";

interface BehavioralPatternModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for Sequential Pattern Detection
const sequentialPatternData = [
  { pattern: 'A-B-C-D', occurrences: 8, zScore: 3.2 },
  { pattern: 'B-C-D-A', occurrences: 5, zScore: 2.1 },
  { pattern: 'C-D-A-B', occurrences: 3, zScore: 1.4 },
  { pattern: 'D-A-B-C', occurrences: 2, zScore: 0.8 },
];

// Original sequential pattern data for table
const sequentialTableData = [
  { sequence: "ABCD", occurrences: 12, length: 4, zScore: 3.2, flagged: true },
  { sequence: "AAAA", occurrences: 8, length: 4, zScore: 2.8, flagged: true },
  { sequence: "ABAB", occurrences: 6, length: 4, zScore: 2.1, flagged: false },
  { sequence: "BCDA", occurrences: 15, length: 4, zScore: 4.1, flagged: true },
  { sequence: "DDDD", occurrences: 5, length: 4, zScore: 1.8, flagged: false },
];

const answerRevisionData = [
  { item: "Q1", totalChanges: 3, flipFlops: 1, rapidChanges: 0, difficulty: "Easy" },
  { item: "Q5", totalChanges: 7, flipFlops: 2, rapidChanges: 3, difficulty: "Hard" },
  { item: "Q12", totalChanges: 5, flipFlops: 1, rapidChanges: 1, difficulty: "Medium" },
  { item: "Q18", totalChanges: 9, flipFlops: 3, rapidChanges: 4, difficulty: "Hard" },
  { item: "Q25", totalChanges: 2, flipFlops: 0, rapidChanges: 0, difficulty: "Easy" },
];

const changeFrequencyData = [
  { item: "Q1", wrongToRight: 2, wrongToWrong: 1, rightToWrong: 0, testCenter: "HYD-001" },
  { item: "Q2", wrongToRight: 1, wrongToWrong: 3, rightToWrong: 1, testCenter: "HYD-001" },
  { item: "Q3", wrongToRight: 4, wrongToWrong: 0, rightToWrong: 2, testCenter: "HYD-001" },
  { item: "Q4", wrongToRight: 0, wrongToWrong: 5, rightToWrong: 1, testCenter: "HYD-001" },
  { item: "Q5", wrongToRight: 3, wrongToWrong: 2, rightToWrong: 3, testCenter: "HYD-001" },
];

const timeWindowData = [
  { minute: 5, changes: 2, wrTeRatio: 0.4 },
  { minute: 10, changes: 1, wrTeRatio: 0.2 },
  { minute: 15, changes: 4, wrTeRatio: 0.8 },
  { minute: 20, changes: 6, wrTeRatio: 1.2 },
  { minute: 25, changes: 18, wrTeRatio: 3.6 },
  { minute: 30, changes: 12, wrTeRatio: 2.4 },
  { minute: 35, changes: 3, wrTeRatio: 0.6 },
  { minute: 40, changes: 2, wrTeRatio: 0.4 },
  { minute: 45, changes: 1, wrTeRatio: 0.2 },
];

const scoreProfileData = [
  { section: "Verbal", score: 85, variance: 12, personFit: 0.89 },
  { section: "Quantitative", score: 92, variance: 8, personFit: 0.95 },
  { section: "Logical", score: 78, variance: 15, personFit: 0.72 },
];

const similarityData = [
  { candidateId: "BP003", similarity: 0.95, identicalResponses: 47, suspicionLevel: "High" },
  { candidateId: "BP007", similarity: 0.82, identicalResponses: 39, suspicionLevel: "Medium" },
  { candidateId: "BP012", similarity: 0.76, identicalResponses: 36, suspicionLevel: "Medium" },
];

export function BehavioralPatternModal({ candidate, isOpen, onClose }: BehavioralPatternModalProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAnomalyType, setSelectedAnomalyType] = useState("all");

  if (!candidate) return null;

  const handleExport = (format: string) => {
    console.log(`Exporting behavioral pattern data as ${format}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-primary" />
              <div>
                <span className="text-xl">Behavioral Pattern Analysis</span>
                {candidate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{candidate.name}</span> • ID: {candidate.id}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className="ml-4">
              Comprehensive Analysis
            </Badge>
          </DialogTitle>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleExport}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="png">PNG Charts</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Filter Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Analysis Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Test Center</label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centers</SelectItem>
                    <SelectItem value="hyd001">HYD-001</SelectItem>
                    <SelectItem value="hyd002">HYD-002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Test ID</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test1">Test-001</SelectItem>
                    <SelectItem value="test2">Test-002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Student ID</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={candidate.id} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={candidate.id}>{candidate.id}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Anomaly Type</label>
                <Select value={selectedAnomalyType} onValueChange={setSelectedAnomalyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sequential">Sequential Pattern</SelectItem>
                    <SelectItem value="revision">Answer Revision</SelectItem>
                    <SelectItem value="frequency">Change Frequency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Sequential Patterns</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Flagged patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Answer Revisions</p>
                  <p className="text-2xl font-bold">26</p>
                  <p className="text-xs text-muted-foreground">Total changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Rapid Changes</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">Under 10 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Similarity Score</p>
                  <p className="text-2xl font-bold">0.95</p>
                  <p className="text-xs text-muted-foreground">Highest match</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sequential Pattern Detection Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Sequential Pattern Detection</span>
              <Badge variant="destructive" className="ml-2">High Risk</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sequentialPatternData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pattern" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Pattern: ${label}`}
                />
                <Bar dataKey="occurrences" fill="#2563eb" name="Occurrences" />
                <Bar dataKey="zScore" fill="#dc2626" name="Z-Score" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-800">🚨 Anomaly Detected</p>
              <p className="text-xs text-red-700 mt-1">
                Pattern "A-B-C-D" repeated 8 times (Z-score: 3.2) • Pattern length ≥6 items detected
              </p>
            </div>
          </CardContent>
        </Card>

        {/* All other sections displayed linearly without tabs */}
        {/* Answer Revision Tracker, Change Frequency, Time Window Analysis, Score Profile, Similarity */}
      </DialogContent>
    </Dialog>
  );
}
      </DialogContent>
    </Dialog>
  );
}