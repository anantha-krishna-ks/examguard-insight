import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Download, Printer, Maximize2, FileText, Image, FileSpreadsheet, Users } from "lucide-react";

interface CandidateChartsModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for Sequential Pattern Detection
const sequentialPatternData = [
  { test: 'Test 1', sequentialPatterns: 152, answerRevisions: 26, flagged: true },
  { test: 'Test 2', sequentialPatterns: 206, answerRevisions: 51, flagged: true },
  { test: 'Test 3', sequentialPatterns: 97, answerRevisions: 5, flagged: false },
  { test: 'Test 4', sequentialPatterns: 134, answerRevisions: 33, flagged: false },
  { test: 'Test 5', sequentialPatterns: 178, answerRevisions: 42, flagged: true }
];

// Mock data for Item-to-Item Transition Clusters
const transitionClustersData = Array.from({ length: 100 }, (_, i) => ({
  itemNumber: i + 1,
  wrongToRight: Math.floor(Math.random() * 15) + 5,
  wrongToWrong: Math.floor(Math.random() * 8) + 2,
  rightToWrong: Math.floor(Math.random() * 12) + 3,
  rightToRight: Math.floor(Math.random() * 20) + 10
}));

// Mock data for Answer Changes Over Time (Burst Analysis)
const burstChangesData = Array.from({ length: 60 }, (_, i) => ({
  minute: i,
  wrongToRightChanges: i === 22 ? 18 : i === 24 ? 12 : Math.floor(Math.random() * 4) + 1
}));

// Mock data for Score Profile Anomaly
const scoreProfileData = [
  { candidateId: 'C_A_001_001', avgCorrectness: 0.63 },
  { candidateId: 'C_A_001_002', avgCorrectness: 0.51 },
  { candidateId: 'C_A_001_003', avgCorrectness: 0.48 },
  { candidateId: 'C_A_001_004', avgCorrectness: 0.41 },
  { candidateId: 'C_A_001_005', avgCorrectness: 0.40 },
  { candidateId: 'C_A_001_006', avgCorrectness: 0.40 },
  { candidateId: 'C_A_001_007', avgCorrectness: 0.39 },
  { candidateId: 'C_A_001_008', avgCorrectness: 0.38 },
  { candidateId: 'C_A_001_009', avgCorrectness: 0.29 },
  { candidateId: 'C_A_001_010', avgCorrectness: 0.28 },
  { candidateId: 'C_A_001_011', avgCorrectness: 0.21 },
  { candidateId: 'C_A_001_012', avgCorrectness: 0.20 },
  { candidateId: 'C_A_001_013', avgCorrectness: 0.20 },
  { candidateId: 'C_A_001_014', avgCorrectness: 0.10 }
];

// Mock data for Inter-Test Taker Similarity
const similarityData = [
  { student1: 'BP001', student2: 'BP003', similarity: 0.94, responses: 'Identical in 94% responses' },
  { student1: 'BP002', student2: 'BP005', similarity: 0.87, responses: 'Identical in 87% responses' },
  { student1: 'BP001', student2: 'BP004', similarity: 0.78, responses: 'Identical in 78% responses' }
];

export function CandidateChartsModal({ candidate, isOpen, onClose }: CandidateChartsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleExport = (format: string) => {
    // Mock export functionality - in real app would generate actual exports
    const candidateName = candidate?.name?.replace(/\s+/g, '_') || 'candidate';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${candidateName}_behavioral_analytics_${timestamp}`;
    
    switch (format) {
      case 'pdf':
        console.log(`Exporting ${filename}.pdf`);
        break;
      case 'png':
        console.log(`Exporting ${filename}.png`);
        break;
      case 'csv':
        console.log(`Exporting ${filename}.csv`);
        break;
      case 'print':
        window.print();
        break;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const TransitionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
          <p className="font-semibold text-foreground mb-2">Item {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="font-medium text-foreground">{entry.value}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total transitions:</span>
              <span className="font-medium text-foreground">{total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto transition-all duration-300`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Behavioral Pattern Analytics
              </DialogTitle>
              <Badge variant="outline" className="text-primary border-primary font-medium">
                {candidate?.name}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {candidate?.id}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('png')}>
                    <Image className="h-4 w-4 mr-2" />
                    Export as Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Data (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('print')}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-2"
              >
                <Maximize2 className="h-4 w-4" />
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </Button>
            </div>
          </div>
          <Separator className="mt-4" />
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">567</div>
                <p className="text-xs text-muted-foreground">Total Sequential Patterns</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">157</div>
                <p className="text-xs text-muted-foreground">Answer Revisions</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">34</div>
                <p className="text-xs text-muted-foreground">Change Frequency Events</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">High</div>
                <p className="text-xs text-muted-foreground">Anomaly Risk Level</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Behavioral Pattern Analysis Charts */}
          <div className="space-y-6">
            {/* Sequential Pattern Detection */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">Sequential Pattern Detection</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Z-score Anomaly Flags</Badge>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Patterns ≥6 items detected in Tests 1, 2, and 5</p>
                  <p>Repeated sequences (A,B,C,D) flagged • Chi-square p-value &lt; 0.001</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={sequentialPatternData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="test" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sequentialPatterns" fill="#2563eb" name="Sequential Patterns" />
                    <Bar dataKey="answerRevisions" fill="#ea580c" name="Answer Revisions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Change Frequency Heatmap */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">Item-to-Item Transition Clusters (All Items)</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">W→R, W→W, R→W Analysis</Badge>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Most modified item: Item 25 (Test Center C)</p>
                  <p>High transition frequency in items 20-30 • Pattern indicates strategic revision behavior</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={transitionClustersData.slice(0, 50)} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="itemNumber" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={4} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<TransitionTooltip />} />
                    <Bar dataKey="wrongToRight" stackId="transitions" fill="#ef4444" name="Wrong to Right" />
                    <Bar dataKey="wrongToWrong" stackId="transitions" fill="#f97316" name="Wrong to Wrong" />
                    <Bar dataKey="rightToWrong" stackId="transitions" fill="#10b981" name="Right to Wrong" />
                    <Bar dataKey="rightToRight" stackId="transitions" fill="#6b7280" name="Right to Right" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Burst of Wrong→Right Changes */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <CardTitle className="text-lg">Burst of Wrong→Right Changes Across Candidates</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Time Window Analysis</Badge>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Significant burst detected at minute 22-24</p>
                  <p>Peak: 18 wrong→right changes • Possible collaboration or external assistance</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={burstChangesData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="minute" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="wrongToRightChanges" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      name="Wrong→Right Changes (count)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Profile Anomaly */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <BarChart3 className="h-5 w-5 text-cyan-500" />
                    </div>
                    <CardTitle className="text-lg">Average Correctness for Candidates in Center A</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">IRT Person-Fit Statistics</Badge>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Low response variability detected in candidates C_A_001_013 & C_A_001_014</p>
                  <p>Flat scoring pattern • Clustered correctness at test end suggests unusual behavior</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={scoreProfileData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="candidateId" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={10} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      domain={[0, 1]}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgCorrectness" fill="#06b6d4" name="Average Correctness (Proportion)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inter-Test Taker Similarity */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Users className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle className="text-lg">Inter-Test Taker Similarity</CardTitle>
                  </div>
                  <Badge variant="destructive" className="text-xs">Collusion Detection</Badge>
                </div>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <p className="font-semibold mb-1 text-red-800">High similarity detected between multiple candidates</p>
                  <p className="text-red-700">Cluster analysis indicates potential collusive behavior • Investigation recommended</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {similarityData.map((similarity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono text-xs">{similarity.student1}</Badge>
                          <span className="text-muted-foreground">↔</span>
                          <Badge variant="outline" className="font-mono text-xs">{similarity.student2}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{similarity.responses}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${similarity.similarity > 0.9 ? 'text-red-500' : similarity.similarity > 0.8 ? 'text-orange-500' : 'text-yellow-500'}`}>
                            {(similarity.similarity * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Similarity</div>
                        </div>
                        <Badge variant={similarity.similarity > 0.9 ? "destructive" : similarity.similarity > 0.8 ? "secondary" : "outline"} className="text-xs">
                          {similarity.similarity > 0.9 ? 'Critical' : similarity.similarity > 0.8 ? 'High' : 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter Bar and Export Options */}
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Test Center:</label>
                    <select className="px-3 py-1 border border-border rounded-md bg-background text-sm">
                      <option>All Centers</option>
                      <option>Center A</option>
                      <option>Center B</option>
                      <option>Center C</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Anomaly Type:</label>
                    <select className="px-3 py-1 border border-border rounded-md bg-background text-sm">
                      <option>All Types</option>
                      <option>Sequential Pattern</option>
                      <option>Answer Revision</option>
                      <option>Change Frequency</option>
                      <option>Similarity</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled className="flex items-center space-x-1">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>
                    <Button variant="outline" size="sm" disabled className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>PDF Summary</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Export functionality currently disabled. Contact administrator for detailed reports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}