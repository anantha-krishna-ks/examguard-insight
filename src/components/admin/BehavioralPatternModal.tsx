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

// Mock data for behavioral pattern analysis
const sequentialPatternData = [
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
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span>Behavioral Pattern Analysis - {candidate.name}</span>
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

        <Tabs defaultValue="sequential" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="sequential">Sequential Patterns</TabsTrigger>
            <TabsTrigger value="revisions">Answer Revisions</TabsTrigger>
            <TabsTrigger value="frequency">Change Frequency</TabsTrigger>
            <TabsTrigger value="timewindow">Time Analysis</TabsTrigger>
            <TabsTrigger value="profile">Score Profile</TabsTrigger>
            <TabsTrigger value="similarity">Similarity</TabsTrigger>
          </TabsList>

          <TabsContent value="sequential">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Sequential Pattern Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Patterns ≥6 items</p>
                          <p className="text-xl font-bold">2</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Repeated ≥3 times</p>
                          <p className="text-xl font-bold">3</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Z-score {">"}= 2.5</p>
                          <p className="text-xl font-bold text-red-500">3</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-2 text-left">Sequence</th>
                          <th className="border border-border p-2 text-left">Occurrences</th>
                          <th className="border border-border p-2 text-left">Length</th>
                          <th className="border border-border p-2 text-left">Z-Score</th>
                          <th className="border border-border p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sequentialPatternData.map((pattern, index) => (
                          <tr key={index} className="hover:bg-muted/10">
                            <td className="border border-border p-2 font-mono">{pattern.sequence}</td>
                            <td className="border border-border p-2">{pattern.occurrences}</td>
                            <td className="border border-border p-2">{pattern.length}</td>
                            <td className="border border-border p-2">{pattern.zScore}</td>
                            <td className="border border-border p-2">
                              <Badge variant={pattern.flagged ? "destructive" : "secondary"}>
                                {pattern.flagged ? "Flagged" : "Normal"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revisions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Answer Revision Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={answerRevisionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalChanges" fill="#2563eb" name="Total Changes" />
                    <Bar dataKey="flipFlops" fill="#ea580c" name="Flip-Flops" />
                    <Bar dataKey="rapidChanges" fill="#dc2626" name="Rapid Changes" />
                  </BarChart>
                </ResponsiveContainer>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Flip-Flop Behavior (A → B → A)</h4>
                    <p className="text-sm text-muted-foreground">Total instances: <span className="font-semibold">7</span></p>
                    <p className="text-sm text-muted-foreground">Most affected item: Q18 (3 flip-flops)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rapid Revisions ({"<"}10s)</h4>
                    <p className="text-sm text-muted-foreground">Total instances: <span className="font-semibold">8</span></p>
                    <p className="text-sm text-muted-foreground">Clustered on difficult items: 75%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frequency">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
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
                <div className="mt-4 p-3 bg-muted/20 rounded">
                  <p className="text-sm"><strong>Most Modified Item:</strong> Q3 (6 total transitions)</p>
                  <p className="text-sm"><strong>Test Center Average:</strong> HYD-001 shows highest W→R transitions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timewindow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Time Window Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeWindowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="minute" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="changes" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Answer Changes"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="wrTeRatio" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      name="WR/TE Ratio"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">Peak Activity Window</p>
                      <p className="font-semibold">Minutes 20-30</p>
                      <p className="text-xs">18 changes in 5-second window</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">Deviation from Mean</p>
                      <p className="font-semibold text-red-500">+3.2σ</p>
                      <p className="text-xs">Significantly above average</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Score Profile Anomaly Panel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {scoreProfileData.map((section, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{section.section}</h4>
                          <p className="text-2xl font-bold">{section.score}%</p>
                          <p className="text-sm text-muted-foreground">Variance: {section.variance}</p>
                          <p className="text-sm text-muted-foreground">Person-Fit: {section.personFit}</p>
                          <Badge variant={section.personFit < 0.8 ? "destructive" : "secondary"}>
                            {section.personFit < 0.8 ? "Low Variability" : "Normal"}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold">IRT-Based Person-Fit Statistics</h4>
                    </div>
                    <p className="text-sm mt-2">Logical section shows low response variability (0.72), indicating potential flat scoring pattern.</p>
                    <p className="text-sm">Clustered correctness detected in final 20% of test items.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similarity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Inter-Test Taker Similarity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-2 text-left">Candidate ID</th>
                          <th className="border border-border p-2 text-left">Similarity Score</th>
                          <th className="border border-border p-2 text-left">Identical Responses</th>
                          <th className="border border-border p-2 text-left">Suspicion Level</th>
                          <th className="border border-border p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {similarityData.map((item, index) => (
                          <tr key={index} className="hover:bg-muted/10">
                            <td className="border border-border p-2 font-mono">{item.candidateId}</td>
                            <td className="border border-border p-2">{item.similarity}</td>
                            <td className="border border-border p-2">{item.identicalResponses}/50</td>
                            <td className="border border-border p-2">
                              <Badge variant={
                                item.suspicionLevel === "High" ? "destructive" : 
                                item.suspicionLevel === "Medium" ? "secondary" : "outline"
                              }>
                                {item.suspicionLevel}
                              </Badge>
                            </td>
                            <td className="border border-border p-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold">Collusive Behavior Alert</h4>
                    </div>
                    <p className="text-sm mt-2">High similarity (0.95) detected with candidate BP003.</p>
                    <p className="text-sm">Cluster analysis suggests potential coordinated responses in questions 15-35.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}