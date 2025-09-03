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
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Clock, Download, Printer, Maximize2, FileText, Image, FileSpreadsheet } from "lucide-react";

interface CandidateChartsModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for Sequential Pattern Detection
const sequentialPatternData = [
  { pattern: 'A-B-C-D', frequency: 8, length: 4, isAnomaly: false },
  { pattern: 'A-A-A-A', frequency: 12, length: 4, isAnomaly: true },
  { pattern: 'B-C-D-A', frequency: 6, length: 4, isAnomaly: false },
  { pattern: 'A-B-A-B', frequency: 15, length: 4, isAnomaly: true },
  { pattern: 'C-C-C-C-C-C', frequency: 3, length: 6, isAnomaly: true },
  { pattern: 'Random', frequency: 45, length: 1, isAnomaly: false },
];

// Mock data for Answer Revision Tracker
const answerRevisionData = [
  { item: 'Q1', revisions: 0, finalAnswer: 'A', timeSpent: 45 },
  { item: 'Q2', revisions: 2, finalAnswer: 'B', timeSpent: 78 },
  { item: 'Q3', revisions: 1, finalAnswer: 'C', timeSpent: 52 },
  { item: 'Q4', revisions: 4, finalAnswer: 'A', timeSpent: 95, isFlipFlop: true },
  { item: 'Q5', revisions: 0, finalAnswer: 'D', timeSpent: 38 },
  { item: 'Q6', revisions: 3, finalAnswer: 'B', timeSpent: 87, isRapid: true },
  { item: 'Q7', revisions: 1, finalAnswer: 'A', timeSpent: 46 },
  { item: 'Q8', revisions: 5, finalAnswer: 'C', timeSpent: 120, isFlipFlop: true },
];

// Mock data for Change Frequency Heatmap
const changeFrequencyData = [
  { item: 'Q1', wrongToRight: 12, wrongToWrong: 3, rightToWrong: 1 },
  { item: 'Q2', wrongToRight: 8, wrongToWrong: 7, rightToWrong: 2 },
  { item: 'Q3', wrongToRight: 15, wrongToWrong: 4, rightToWrong: 0 },
  { item: 'Q4', wrongToRight: 6, wrongToWrong: 12, rightToWrong: 5 },
  { item: 'Q5', wrongToRight: 18, wrongToWrong: 2, rightToWrong: 1 },
  { item: 'Q6', wrongToRight: 9, wrongToWrong: 8, rightToWrong: 3 },
  { item: 'Q7', wrongToRight: 14, wrongToWrong: 5, rightToWrong: 2 },
  { item: 'Q8', wrongToRight: 4, wrongToWrong: 15, rightToWrong: 8 },
];

// Mock data for Time Window Analysis
const timeWindowData = [
  { timeWindow: '0-5s', answerChanges: 2, wrRatio: 0.15, deviation: -0.8 },
  { timeWindow: '5-10s', answerChanges: 8, wrRatio: 0.42, deviation: -0.2 },
  { timeWindow: '10-15s', answerChanges: 15, wrRatio: 0.67, deviation: 0.1 },
  { timeWindow: '15-20s', answerChanges: 12, wrRatio: 0.58, deviation: 0.0 },
  { timeWindow: '20-25s', answerChanges: 6, wrRatio: 0.33, deviation: -0.5 },
  { timeWindow: '25-30s', answerChanges: 3, wrRatio: 0.18, deviation: -0.7 },
];

// Mock data for Score Profile Anomaly
const scoreProfileData = [
  { position: 1, score: 1, difficulty: 1.2, cluster: 'beginning' },
  { position: 2, score: 1, difficulty: 1.4, cluster: 'beginning' },
  { position: 3, score: 0, difficulty: 1.6, cluster: 'beginning' },
  { position: 4, score: 1, difficulty: 1.8, cluster: 'beginning' },
  { position: 5, score: 0, difficulty: 2.0, cluster: 'middle' },
  { position: 6, score: 0, difficulty: 2.2, cluster: 'middle' },
  { position: 7, score: 1, difficulty: 2.4, cluster: 'middle' },
  { position: 8, score: 0, difficulty: 2.6, cluster: 'middle' },
  { position: 9, score: 1, difficulty: 2.8, cluster: 'end' },
  { position: 10, score: 1, difficulty: 3.0, cluster: 'end' },
  { position: 11, score: 1, difficulty: 3.2, cluster: 'end' },
  { position: 12, score: 1, difficulty: 3.4, cluster: 'end' },
];

// Mock data for Behavioral Pattern Distribution (Violin Plot style)
const behavioralDistributionData = [
  { region: 'HYDERABAD', scores: [18, 19, 22, 24, 26, 25, 23, 21, 20, 24, 25], outlier: 27.5, color: '#10b981' },
  { region: 'MALAYSIA', scores: [20, 21, 23, 25, 27, 26, 24, 22, 25, 26, 27], outlier: 25.8, color: '#6b7280' },
  { region: 'MYSORE', scores: [16, 17, 19, 21, 23, 22, 20, 18, 21, 22, 23], outlier: 26.2, color: '#ef4444' },
  { region: 'NOIDA', scores: [22, 23, 25, 27, 29, 28, 26, 24, 27, 28, 29], outlier: 25.1, color: '#f97316' },
];

// Mock data for Inter-Test Taker Similarity
const similarityData = [
  { candidateA: 'C001', candidateB: 'C002', similarity: 0.92, responseString: 'ABCDABCD...' },
  { candidateA: 'C001', candidateB: 'C003', similarity: 0.15, responseString: 'Different' },
  { candidateA: 'C001', candidateB: 'C004', similarity: 0.88, responseString: 'ABCDABCD...' },
  { candidateA: 'C001', candidateB: 'C005', similarity: 0.23, responseString: 'Different' },
];

export function CandidateChartsModal({ candidate, isOpen, onClose }: CandidateChartsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleExport = (format: string) => {
    // Mock export functionality - in real app would generate actual exports
    const candidateName = candidate?.name?.replace(/\s+/g, '_') || 'candidate';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${candidateName}_behavioral_analysis_${timestamp}`;
    
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
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50 z-50">
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

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50 z-50">
          <p className="font-semibold text-foreground mb-2">Position: {data.position}</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Score:</span> <span className="font-medium">{data.score}</span></p>
            <p><span className="text-muted-foreground">Difficulty:</span> <span className="font-medium">{data.difficulty}</span></p>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Cluster:</span>
              <Badge variant={data.cluster === 'end' ? "destructive" : "secondary"} className="text-xs">
                {data.cluster}
              </Badge>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto transition-all duration-300 z-50`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Behavioral Pattern Analysis
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
                <DropdownMenuContent className="bg-card border z-50">
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
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-xs text-muted-foreground">Sequential Patterns</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">18</div>
                <p className="text-xs text-muted-foreground">Answer Revisions</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-xs text-muted-foreground">Flip-Flop Behavior</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">0.87</div>
                <p className="text-xs text-muted-foreground">Similarity Score</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Charts Section */}
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
                  <Badge variant="secondary" className="text-xs">≥6 items or ≥3 repeats flagged</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sequentialPatternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="pattern" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="frequency" fill="#3b82f6" name="Frequency">
                      {sequentialPatternData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isAnomaly ? "#ef4444" : "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Detected Patterns:</span>
                    <ul className="mt-1 space-y-1">
                      {sequentialPatternData.filter(p => p.isAnomaly).map((pattern, idx) => (
                        <li key={idx} className="text-red-600">• {pattern.pattern} (x{pattern.frequency})</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Z-Score Analysis:</span>
                    <p className="mt-1 text-muted-foreground">Chi-square: 15.24 (p &lt; 0.001)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Revision Tracker */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg">Answer Revision Tracker</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Flip-flop & rapid revisions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={answerRevisionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="item" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revisions" fill="#ea580c" name="Revisions">
                      {answerRevisionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isFlipFlop ? "#ef4444" : entry.isRapid ? "#f97316" : "#ea580c"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    <span>Normal Revisions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Rapid (&lt;10s)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Flip-Flop (A→B→A)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Frequency Heatmap */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                    </div>
                    <CardTitle className="text-lg">Change Frequency Heatmap</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">W→R, W→W, R→W transitions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={changeFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="item" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="wrongToRight" fill="#10b981" name="Wrong→Right" />
                    <Bar dataKey="wrongToWrong" fill="#f59e0b" name="Wrong→Wrong" />
                    <Bar dataKey="rightToWrong" fill="#ef4444" name="Right→Wrong" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm">
                  <p><span className="font-medium">Most Modified Item:</span> Q4 (Test Center A)</p>
                </div>
              </CardContent>
            </Card>

            {/* Time Window Analysis */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">Time Window Analysis</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">5-second windows</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeWindowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="timeWindow" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="answerChanges" stroke="#8b5cf6" strokeWidth={2} name="Answer Changes" />
                    <Line type="monotone" dataKey="wrRatio" stroke="#06b6d4" strokeWidth={2} name="WR/TE Ratio" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm">
                  <p><span className="font-medium">Peak Activity:</span> 10-15s window (15 changes)</p>
                  <p><span className="font-medium">Mean Deviation:</span> -0.2 from expected pattern</p>
                </div>
              </CardContent>
            </Card>

            {/* Behavioral Pattern Distribution - Violin Plot */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle className="text-lg">Behavioral Pattern Distribution</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Regional WR Scores - Violin Plot</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={400}>
                    <svg width="100%" height="100%" viewBox="0 0 800 400">
                      {/* Background Grid */}
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Y-axis */}
                      <line x1="80" y1="50" x2="80" y2="350" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
                      
                      {/* Y-axis labels */}
                      {[15, 20, 25, 30, 35].map((value, index) => (
                        <g key={value}>
                          <line x1="75" y1={350 - (value - 15) * 15} x2="80" y2={350 - (value - 15) * 15} stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
                          <text x="70" y={355 - (value - 15) * 15} textAnchor="end" fontSize="12" fill="hsl(var(--muted-foreground))">{value}</text>
                        </g>
                      ))}
                      
                      {/* Title */}
                      <text x="400" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="hsl(var(--foreground))">
                        Student WR Scores - Violin Plot
                      </text>
                      
                      {/* Violin shapes for each region */}
                      {behavioralDistributionData.map((region, regionIndex) => {
                        const xCenter = 150 + regionIndex * 150;
                        const maxWidth = 60;
                        
                        // Create violin shape points
                        const violinPoints = [];
                        
                        // Left side of violin (density distribution)
                        for (let y = 50; y <= 350; y += 10) {
                          const scoreValue = 15 + ((350 - y) / 15);
                          const density = region.scores.filter(s => Math.abs(s - scoreValue) < 2).length / region.scores.length;
                          const width = density * maxWidth;
                          violinPoints.push(`${xCenter - width},${y}`);
                        }
                        
                        // Right side of violin (reverse)
                        for (let y = 350; y >= 50; y -= 10) {
                          const scoreValue = 15 + ((350 - y) / 15);
                          const density = region.scores.filter(s => Math.abs(s - scoreValue) < 2).length / region.scores.length;
                          const width = density * maxWidth;
                          violinPoints.push(`${xCenter + width},${y}`);
                        }
                        
                        return (
                          <g key={region.region}>
                            {/* Violin shape */}
                            <polygon
                              points={violinPoints.join(' ')}
                              fill={region.color}
                              fillOpacity="0.6"
                              stroke={region.color}
                              strokeWidth="2"
                            />
                            
                            {/* Box plot inside violin */}
                            <rect
                              x={xCenter - 8}
                              y={350 - (Math.max(...region.scores) - 15) * 15}
                              width="16"
                              height={(Math.max(...region.scores) - Math.min(...region.scores)) * 15}
                              fill="rgba(0,0,0,0.3)"
                              stroke="hsl(var(--foreground))"
                              strokeWidth="1"
                            />
                            
                            {/* Median line */}
                            <line
                              x1={xCenter - 8}
                              y1={350 - (region.scores.sort((a,b) => a-b)[Math.floor(region.scores.length/2)] - 15) * 15}
                              x2={xCenter + 8}
                              y2={350 - (region.scores.sort((a,b) => a-b)[Math.floor(region.scores.length/2)] - 15) * 15}
                              stroke="hsl(var(--foreground))"
                              strokeWidth="2"
                            />
                            
                            {/* Outlier point */}
                            <circle
                              cx={xCenter}
                              cy={350 - (region.outlier - 15) * 15}
                              r="4"
                              fill="#ef4444"
                              stroke="#dc2626"
                              strokeWidth="2"
                            />
                            
                            {/* Region label */}
                            <text
                              x={xCenter}
                              y="380"
                              textAnchor="middle"
                              fontSize="12"
                              fill="hsl(var(--muted-foreground))"
                            >
                              {region.region}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Legend */}
                      <g transform="translate(650, 80)">
                        {behavioralDistributionData.map((region, index) => (
                          <g key={region.region} transform={`translate(0, ${index * 25})`}>
                            <rect x="0" y="0" width="15" height="15" fill={region.color} />
                            <text x="20" y="12" fontSize="12" fill="hsl(var(--foreground))">{region.region}</text>
                          </g>
                        ))}
                      </g>
                      
                      {/* Y-axis label */}
                      <text x="25" y="200" textAnchor="middle" fontSize="14" fill="hsl(var(--muted-foreground))" transform="rotate(-90, 25, 200)">
                        WR Score
                      </text>
                    </svg>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Distribution Analysis:</span>
                    <p className="text-muted-foreground">NOIDA shows highest median WR scores</p>
                  </div>
                  <div>
                    <span className="font-medium">Outlier Detection:</span>
                    <p className="text-red-600">4 outliers detected across regions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inter-Test Taker Similarity */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <BarChart3 className="h-5 w-5 text-indigo-500" />
                    </div>
                    <CardTitle className="text-lg">Inter-Test Taker Similarity</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Collusion detection</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {similarityData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div>
                        <span className="font-medium">{item.candidateA} ↔ {item.candidateB}</span>
                        <p className="text-sm text-muted-foreground">{item.responseString}</p>
                      </div>
                      <Badge 
                        variant={item.similarity > 0.8 ? "destructive" : "secondary"}
                        className="font-mono"
                      >
                        {(item.similarity * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm">
                  <p><span className="font-medium">High Similarity Alert:</span> 2 candidate pairs above 80% threshold</p>
                  <p className="text-red-600"><span className="font-medium">Potential Collusion:</span> C001-C002 (92%), C001-C004 (88%)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}