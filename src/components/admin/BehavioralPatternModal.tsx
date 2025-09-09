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
  { minute: 5, candidateChanges: 2, testCenterAvg: 1.2, candidateWrTe: 0.4, testCenterWrTe: 0.3 },
  { minute: 10, candidateChanges: 1, testCenterAvg: 1.5, candidateWrTe: 0.2, testCenterWrTe: 0.4 },
  { minute: 15, candidateChanges: 4, testCenterAvg: 2.1, candidateWrTe: 0.8, testCenterWrTe: 0.6 },
  { minute: 20, candidateChanges: 6, testCenterAvg: 2.8, candidateWrTe: 1.2, testCenterWrTe: 0.8 },
  { minute: 25, candidateChanges: 18, testCenterAvg: 3.2, candidateWrTe: 3.6, testCenterWrTe: 1.1 },
  { minute: 30, candidateChanges: 12, testCenterAvg: 2.9, candidateWrTe: 2.4, testCenterWrTe: 0.9 },
  { minute: 35, candidateChanges: 3, testCenterAvg: 2.2, candidateWrTe: 0.6, testCenterWrTe: 0.7 },
  { minute: 40, candidateChanges: 2, testCenterAvg: 1.8, candidateWrTe: 0.4, testCenterWrTe: 0.5 },
  { minute: 45, candidateChanges: 1, testCenterAvg: 1.3, candidateWrTe: 0.2, testCenterWrTe: 0.3 },
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Analysis Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Test Center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centers</SelectItem>
                    <SelectItem value="HYD-001">HYD-001</SelectItem>
                    <SelectItem value="HYD-002">HYD-002</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Test ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tests</SelectItem>
                    <SelectItem value="test1">Test-001</SelectItem>
                    <SelectItem value="test2">Test-002</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedAnomalyType} onValueChange={setSelectedAnomalyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Anomaly Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Anomalies</SelectItem>
                    <SelectItem value="sequential">Sequential Pattern</SelectItem>
                    <SelectItem value="revision">Answer Revision</SelectItem>
                    <SelectItem value="frequency">Change Frequency</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={() => {setSelectedFilter('all'); setSelectedAnomalyType('all');}}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sequential Patterns</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">≥6 items or ≥3 repeats</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Answer Revisions</p>
                    <p className="text-2xl font-bold text-orange-600">28</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Including flip-flops</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Anomaly Score</p>
                    <p className="text-2xl font-bold text-red-600">0.89</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">High risk threshold</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Similarity Index</p>
                    <p className="text-2xl font-bold text-purple-600">0.67</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">With other students</p>
              </CardContent>
            </Card>
          </div>

          {/* Sequential Pattern Detection */}
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


          {/* Change Frequency Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Change Frequency Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={changeFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Item: ${label}`}
                  />
                  <Bar dataKey="wrongToRight" fill="#10b981" name="W→R" />
                  <Bar dataKey="wrongToWrong" fill="#f59e0b" name="W→W" />
                  <Bar dataKey="rightToWrong" fill="#ef4444" name="R→W" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-800">💡 Most Modified Item</p>
                <p className="text-xs text-blue-700">Item Q18: 12 total changes (HYD-001 Test Center)</p>
              </div>
            </CardContent>
          </Card>

          {/* Time Window Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Time Window Analysis (5-second intervals)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeWindowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="minute" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Time: ${label}s`}
                  />
                  <Line type="monotone" dataKey="candidateChanges" stroke="#8b5cf6" strokeWidth={3} name="Candidate Changes" />
                  <Line type="monotone" dataKey="testCenterAvg" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Test Center Average" />
                  <Line type="monotone" dataKey="candidateWrTe" stroke="#06b6d4" strokeWidth={3} name="Candidate WR/TE" />
                  <Line type="monotone" dataKey="testCenterWrTe" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="Test Center WR/TE Avg" />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-sm font-medium text-purple-800">📊 Candidate vs Test Center</p>
                  <p className="text-xs text-purple-700">
                    Peak: 25s window (18 vs 3.2 avg) • 4.6σ above test center mean
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-800">🎯 Deviation Analysis</p>
                  <p className="text-xs text-blue-700">
                    WR/TE: 3.6 vs 1.1 center avg • 2.3× higher than expected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button variant="outline" disabled className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
                <Button variant="outline" disabled className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>PDF Summary</span>
                </Button>
                <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}