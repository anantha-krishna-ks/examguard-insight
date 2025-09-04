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
  ScatterChart,
  Scatter,
  Cell,
  Legend,
  ReferenceDot
} from "recharts";
import { BarChart3, TrendingUp, Clock, Download, Printer, Maximize2, FileText, Image, FileSpreadsheet, Users, Target, AlertTriangle, Activity } from "lucide-react";

interface CandidateChartsModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for OS Curve - Perfect S-curve shape
const osCurveData = [
  { time: -15, probability: 0.01 },
  { time: -10, probability: 0.02 },
  { time: -5, probability: 0.05 },
  { time: -2, probability: 0.12 },
  { time: 0, probability: 0.25 },
  { time: 2, probability: 0.45 },
  { time: 4, probability: 0.65 },
  { time: 6, probability: 0.80 },
  { time: 8, probability: 0.90 },
  { time: 10, probability: 0.95 },
  { time: 15, probability: 0.98 },
  { time: 20, probability: 0.99 },
  { time: 25, probability: 1.0 }
];

// Anomaly data points
const anomalyData = [
  { time: 6, probability: 0.05, itemNo: 6, outlierScore: 20.004859271615384 }
];

// Mock data for item time frequency distribution
const timeFrequencyData = [
  { timeRange: "0-30s", frequency: 8 },
  { timeRange: "31-60s", frequency: 15 },
  { timeRange: "61-90s", frequency: 22 },
  { timeRange: "91-120s", frequency: 18 },
  { timeRange: "121-150s", frequency: 12 },
  { timeRange: "151-180s", frequency: 8 },
  { timeRange: "181-210s", frequency: 5 },
  { timeRange: "211-240s", frequency: 3 },
  { timeRange: "241s+", frequency: 2 }
];

// Mock data for individual anomaly frequency charts
const generateAnomalyFrequencyData = (itemNo: number, responseTime: number) => [
  { timeRange: "1-44", frequency: 45, isAnomaly: false },
  { timeRange: "45-88", frequency: 30, isAnomaly: false },
  { timeRange: "89-132", frequency: 16, isAnomaly: false },
  { timeRange: "133-176", frequency: 8, isAnomaly: false },
  { timeRange: "177-220", frequency: 2, isAnomaly: false },
  { timeRange: "221-264", frequency: 1, isAnomaly: false },
  { timeRange: "265-308", frequency: 0, isAnomaly: false },
  { timeRange: "309-352", frequency: 0, isAnomaly: false },
  { timeRange: "353-396", frequency: 0, isAnomaly: false },
  { timeRange: "397-440", frequency: 1, isAnomaly: responseTime >= 397 }
];

// Mock data for Behavioral Pattern Anomaly Analysis

// Sequential Pattern Detection Data
const sequentialPatternData = [
  { test: "Test 1", sequential: 152, revision: 26 },
  { test: "Test 2", sequential: 206, revision: 51 },
  { test: "Test 3", sequential: 97, revision: 5 }
];

// Answer Revision Tracker Data
const answerRevisionData = [
  { item: "Q1", totalChanges: 2, flipFlopBehavior: false, rapidRevisions: 0 },
  { item: "Q2", totalChanges: 5, flipFlopBehavior: true, rapidRevisions: 2 },
  { item: "Q3", totalChanges: 1, flipFlopBehavior: false, rapidRevisions: 0 },
  { item: "Q4", totalChanges: 8, flipFlopBehavior: true, rapidRevisions: 4 },
  { item: "Q5", totalChanges: 3, flipFlopBehavior: false, rapidRevisions: 1 },
  { item: "Q6", totalChanges: 12, flipFlopBehavior: true, rapidRevisions: 6 }
];

// Item-to-Item Transition Clusters Data
const transitionClustersData = Array.from({ length: 50 }, (_, i) => ({
  item: `Item${i + 1}`,
  wrongToRight: Math.floor(Math.random() * 25) + 5,
  wrongToWrong: Math.floor(Math.random() * 15) + 2,
  rightToWrong: Math.floor(Math.random() * 10) + 1,
  rightToRight: Math.floor(Math.random() * 30) + 10
}));

// Time Window Analysis - Wrong→Right Changes
const timeWindowData = [
  { minute: 0, changes: 4 }, { minute: 2, changes: 0 }, { minute: 4, changes: 3 },
  { minute: 6, changes: 3 }, { minute: 8, changes: 1 }, { minute: 10, changes: 4 },
  { minute: 12, changes: 2 }, { minute: 14, changes: 6 }, { minute: 16, changes: 4 },
  { minute: 18, changes: 1 }, { minute: 20, changes: 2 }, { minute: 22, changes: 18 },
  { minute: 24, changes: 12 }, { minute: 26, changes: 2 }, { minute: 28, changes: 1 },
  { minute: 30, changes: 4 }, { minute: 32, changes: 2 }, { minute: 34, changes: 4 },
  { minute: 36, changes: 3 }, { minute: 38, changes: 1 }, { minute: 40, changes: 3 },
  { minute: 42, changes: 2 }, { minute: 44, changes: 1 }, { minute: 46, changes: 2 },
  { minute: 48, changes: 3 }, { minute: 50, changes: 1 }, { minute: 52, changes: 3 },
  { minute: 54, changes: 4 }, { minute: 56, changes: 2 }, { minute: 58, changes: 1 }
];

// Inter-Test Taker Similarity Data (Probability of Wrong→Right Transitions)
const similarityData = [
  { candidateId: "Cand_111", probability: 1.0 },
  { candidateId: "Cand_20", probability: 1.0 },
  { candidateId: "Cand_93", probability: 0.61 },
  { candidateId: "Cand_18", probability: 0.51 },
  { candidateId: "Cand_95", probability: 0.51 },
  { candidateId: "Cand_17", probability: 0.51 },
  { candidateId: "Cand_16", probability: 0.51 },
  { candidateId: "Cand_14", probability: 0.51 },
  { candidateId: "Cand_10", probability: 0.41 },
  { candidateId: "Cand_02", probability: 0.41 },
  { candidateId: "Cand_18", probability: 0.34 },
  { candidateId: "Cand_01", probability: 0.31 },
  { candidateId: "Cand_07", probability: 0.29 },
  { candidateId: "Cand_04", probability: 0.28 },
  { candidateId: "Cand_12", probability: 0.25 },
  { candidateId: "Cand_04", probability: 0.25 },
  { candidateId: "Cand_09", probability: 0.18 },
  { candidateId: "Cand_06", probability: 0.13 },
  { candidateId: "Cand_05", probability: 0.12 }
];

// Score Profile Anomaly Detection
const scoreProfileData = [
  { section: "Math", variability: 0.85, personFit: 0.12, clusteredCorrectness: false },
  { section: "Verbal", variability: 0.23, personFit: -2.45, clusteredCorrectness: true },
  { section: "Logic", variability: 0.67, personFit: 0.89, clusteredCorrectness: false }
];

export function CandidateChartsModal({ candidate, isOpen, onClose }: CandidateChartsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleExport = (format: string) => {
    // Mock export functionality - in real app would generate actual exports
    const candidateName = candidate?.name?.replace(/\s+/g, '_') || 'candidate';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${candidateName}_analytics_${timestamp}`;
    
    switch (format) {
      case 'pdf':
        console.log(`Exporting ${filename}.pdf`);
        // Implementation would use libraries like jsPDF or react-to-pdf
        break;
      case 'png':
        console.log(`Exporting ${filename}.png`);
        // Implementation would capture canvas/svg and convert to image
        break;
      case 'csv':
        console.log(`Exporting ${filename}.csv`);
        // Implementation would convert chart data to CSV format
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

  const SimilarityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <p className="text-sm text-muted-foreground">
            Transition Probability: <span className="font-medium text-foreground">{(payload[0].value * 100).toFixed(1)}%</span>
          </p>
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
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">7</div>
                <p className="text-xs text-muted-foreground">Sequential Patterns</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">15</div>
                <p className="text-xs text-muted-foreground">Answer Revisions</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Flip-Flop Behaviors</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-xs text-muted-foreground">Pattern Similarity</p>
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
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Sequential Pattern Detection</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Patterns ≥6 items</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Behavioral Pattern Anomaly - Sequential patterns and answer revisions across tests
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4 flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-blue-600 rounded"></div>
                    <span className="text-sm font-medium">Sequential Pattern Numbers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm font-medium">Answer Revision Numbers</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={sequentialPatternData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="test" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Test', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Anomaly Student Numbers', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="sequential" 
                      fill="#2563eb"
                      radius={[2, 2, 0, 0]}
                      name="Sequential Pattern Numbers"
                    />
                    <Bar 
                      dataKey="revision" 
                      fill="#ea580c"
                      radius={[2, 2, 0, 0]}
                      name="Answer Revision Numbers"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Answer Revision Tracker */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Activity className="h-5 w-5 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg">Answer Revision Tracker</CardTitle>
                  </div>
                  <Badge variant="destructive" className="text-xs">Flip-Flop Detected</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Tracks total answer changes and flags rapid revisions (&lt;10s) and flip-flopping behavior
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={answerRevisionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="item" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Question Items', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Number of Changes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
                              <p className="font-semibold text-foreground mb-2">{label}</p>
                              <p className="text-sm text-muted-foreground">Total Changes: <span className="font-medium text-foreground">{data.totalChanges}</span></p>
                              <p className="text-sm text-muted-foreground">Rapid Revisions: <span className="font-medium text-foreground">{data.rapidRevisions}</span></p>
                              {data.flipFlopBehavior && (
                                <p className="text-sm text-red-500 font-medium">⚠ Flip-Flop Behavior Detected</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="totalChanges" radius={[4, 4, 0, 0]}>
                      {answerRevisionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.flipFlopBehavior ? "#ef4444" : "#3b82f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Item-to-Item Transition Clusters */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                    </div>
                    <CardTitle className="text-lg">Item-to-Item Transition Clusters (All Items)</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">W→R, W→W, R→W Analysis</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Shows transition patterns between wrong and right answers across all test items
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Wrong to Right</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Wrong to Wrong</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Right to Wrong</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={transitionClustersData.slice(0, 20)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="item" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      label={{ value: 'Transition to Item', position: 'insideBottom', offset: -40, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip content={<TransitionTooltip />} />
                    <Bar 
                      dataKey="wrongToRight" 
                      stackId="transitions"
                      fill="#ef4444"
                      name="Wrong→Right"
                    />
                    <Bar 
                      dataKey="wrongToWrong" 
                      stackId="transitions"
                      fill="#f97316"
                      name="Wrong→Wrong"
                    />
                    <Bar 
                      dataKey="rightToWrong" 
                      stackId="transitions"
                      fill="#22c55e"
                      name="Right→Wrong"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Window Analysis */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">Burst of Wrong→Right Changes Across Candidates</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">5-second windows</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Time-based analysis of answer changes showing WR/TE ratio and deviation patterns
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={timeWindowData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="minute" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Minute of session', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Wrong→Right Changes (count)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
                              <p className="font-semibold text-foreground mb-2">Minute {label}</p>
                              <p className="text-sm text-muted-foreground">
                                Wrong→Right Changes: <span className="font-medium text-foreground">{payload[0].value}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="changes" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, fill: '#1d4ed8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inter-Test Taker Similarity */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">Probability of Transitioning from Wrong to Right (Center A)</CardTitle>
                  </div>
                  <Badge variant="destructive" className="text-xs">Collusive Behavior</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Detects identical response strings and clusters across students for potential collusion
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={similarityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="candidateId" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      label={{ value: 'Candidate ID', position: 'insideBottom', offset: -40, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 1.0]}
                      label={{ value: 'Wrong To Right | Total Wrong Answer Probability', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip content={<SimilarityTooltip />} />
                    <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                      {similarityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.probability >= 0.8 ? "#ef4444" : entry.probability >= 0.5 ? "#f59e0b" : "#06b6d4"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>High Risk (≥80%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span>Medium Risk (50-79%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                    <span>Low Risk (&lt;50%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Profile Anomaly Panel */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle className="text-lg">Score Profile Anomaly Panel</CardTitle>
                  </div>
                  <Badge variant="destructive" className="text-xs">IRT-Based</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Flags low response variability and uses IRT-based person-fit statistics
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-semibold">Section</th>
                        <th className="text-left p-3 font-semibold">Response Variability</th>
                        <th className="text-left p-3 font-semibold">Person-Fit Score</th>
                        <th className="text-left p-3 font-semibold">Clustered Correctness</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreProfileData.map((section, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="p-3 font-medium">{section.section}</td>
                          <td className="p-3">{section.variability.toFixed(2)}</td>
                          <td className="p-3">{section.personFit.toFixed(2)}</td>
                          <td className="p-3">
                            <Badge variant={section.clusteredCorrectness ? "destructive" : "default"} className="text-xs">
                              {section.clusteredCorrectness ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={
                                section.variability < 0.3 || section.personFit < -2.0 || section.clusteredCorrectness 
                                  ? "destructive" 
                                  : "default"
                              } 
                              className="text-xs"
                            >
                              {section.variability < 0.3 || section.personFit < -2.0 || section.clusteredCorrectness 
                                ? 'Flagged' 
                                : 'Normal'
                              }
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Behavioral Pattern Summary Statistics */}
          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Behavioral Pattern Summary</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">Flagged behavioral anomalies and threshold breaches</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Anomaly Type</th>
                      <th className="text-left p-3 font-semibold">Detection Method</th>
                      <th className="text-left p-3 font-semibold">Threshold</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3 font-medium">Sequential Patterns</td>
                      <td className="p-3">Pattern Length Detection</td>
                      <td className="p-3">≥6 items or ≥3 repeats</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">7 Detected</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3 font-medium">Flip-Flop Behavior</td>
                      <td className="p-3">A→B→A Pattern</td>
                      <td className="p-3">≥3 oscillations</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">3 Items Flagged</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3 font-medium">Rapid Revisions</td>
                      <td className="p-3">Time-based Analysis</td>
                      <td className="p-3">&lt;10 seconds</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">13 Rapid Changes</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3 font-medium">Response Variability</td>
                      <td className="p-3">IRT Person-Fit</td>
                      <td className="p-3">&lt;0.3 or Z &lt; -2.0</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">1 Section Flagged</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3 font-medium">Pattern Similarity</td>
                      <td className="p-3">Cluster Analysis</td>
                      <td className="p-3">≥80% similarity</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">2 High Risk</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </DialogContent>
    </Dialog>
  );
}