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
import { BarChart3, TrendingUp, Clock, Download, Printer, Maximize2, FileText, Image, FileSpreadsheet } from "lucide-react";

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

// Mock data for Response Time vs Difficulty
const responseTimeDifficultyData = [
  { difficulty: 1.2, responseTime: 45, correct: true, itemId: "Q1" },
  { difficulty: 1.5, responseTime: 62, correct: true, itemId: "Q2" },
  { difficulty: 1.8, responseTime: 78, correct: false, itemId: "Q3" },
  { difficulty: 2.1, responseTime: 95, correct: true, itemId: "Q4" },
  { difficulty: 2.4, responseTime: 120, correct: false, itemId: "Q5" },
  { difficulty: 2.7, responseTime: 145, correct: true, itemId: "Q6" },
  { difficulty: 3.0, responseTime: 180, correct: false, itemId: "Q7" },
  { difficulty: 3.3, responseTime: 210, correct: true, itemId: "Q8" },
  { difficulty: 3.6, responseTime: 240, correct: false, itemId: "Q9" },
  { difficulty: 3.9, responseTime: 275, correct: true, itemId: "Q10" }
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

  const AnomalyTooltip = ({ active, payload, coordinate }: any) => {
    if (active && coordinate) {
      const anomaly = anomalyData.find(a => 
        Math.abs(coordinate.x - (20 + ((a.time + 15) / 40) * 600)) < 20 &&
        Math.abs(coordinate.y - (30 + (1 - a.probability) * 260)) < 20
      );
      
      if (anomaly) {
        return (
          <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
            <p className="font-semibold text-foreground mb-2">Item: {anomaly.itemNo}</p>
            <p className="text-sm text-muted-foreground">
              Outlier Score: <span className="font-medium text-foreground">{anomaly.outlierScore}, Item: {anomaly.itemNo}</span>
            </p>
          </div>
        );
      }
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
          <p className="font-semibold text-foreground mb-2">{data.itemId}</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Difficulty:</span> <span className="font-medium">{data.difficulty}</span></p>
            <p><span className="text-muted-foreground">Response Time:</span> <span className="font-medium">{data.responseTime}s</span></p>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Result:</span>
              <Badge variant={data.correct ? "default" : "destructive"} className="text-xs">
                {data.correct ? 'Correct' : 'Incorrect'}
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
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto transition-all duration-300`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Candidate Analytics
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
                <div className="text-2xl font-bold text-primary">8.5</div>
                <p className="text-xs text-muted-foreground">Avg. Response Time (min)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">35/50</div>
                <p className="text-xs text-muted-foreground">Score</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">2.1</div>
                <p className="text-xs text-muted-foreground">Avg. Difficulty</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Anomalous Items</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Graphs Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* OS Curve */}
              <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">OS Curve Analysis</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">S-Curve with Anomalies</Badge>
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                    <p className="font-semibold mb-1">Anomaly Detected - Item No: 6</p>
                    <p>Item Response Time: 395 sec | Percentile Rank: 99.96% | Outlier Score: 20.00</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Legend */}
                  <div className="mb-4 flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-1 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium">S-Curve</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 border border-red-600"></div>
                      <span className="text-sm font-medium">Actual Outliers</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={osCurveData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                       <defs>
                         <linearGradient id="osGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                         </linearGradient>
                         <linearGradient id="osStroke" x1="0" y1="0" x2="1" y2="0">
                           <stop offset="0%" stopColor="#3b82f6"/>
                           <stop offset="100%" stopColor="#6366f1"/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        domain={[-15, 25]}
                        ticks={[-15, -10, -5, 0, 5, 10, 15, 20, 25]}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        domain={[0, 1]}
                        tickCount={11}
                      />
                       <Tooltip 
                         content={({ active, payload, coordinate }: any) => {
                           if (active && coordinate) {
                             const anomaly = anomalyData[0]; // Since we only have one anomaly
                             return (
                               <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
                                 <p className="font-semibold text-foreground mb-2">Item: {anomaly.itemNo}</p>
                                 <p className="text-sm text-muted-foreground">
                                   Outlier Score: <span className="font-medium text-foreground">{anomaly.outlierScore}, Item: {anomaly.itemNo}</span>
                                 </p>
                               </div>
                             );
                           }
                           return null;
                         }}
                       />
                        <Line 
                          type="monotone" 
                          dataKey="probability" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={false}
                          name="S-Curve"
                        />
                        {anomalyData.map((anomaly, index) => (
                          <ReferenceDot
                            key={`anomaly-${index}`}
                            x={anomaly.time}
                            y={anomaly.probability}
                            r={6}
                            fill="#ef4444"
                            stroke="#dc2626"
                            strokeWidth={2}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rapid Guessing Detection */}
              <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Clock className="h-5 w-5 text-red-500" />
                      </div>
                      <CardTitle className="text-lg">Rapid Guessing Detection</CardTitle>
                    </div>
                    <Badge variant="destructive" className="text-xs">Flagged Responses</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={timeFrequencyData.slice(0, 3)} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                       <defs>
                         <linearGradient id="rapidGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                           <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="timeRange" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Response Time Range (<5s flagged)', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="frequency" 
                        fill="url(#rapidGradient)" 
                        radius={[4, 4, 0, 0]}
                        stroke="#dc2626"
                        strokeWidth={1}
                       />
                     </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>
            
            {/* Response Time vs Difficulty */}
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Response Time vs Item Difficulty</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Performance Correlation</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Correlation between item difficulty and response time, color-coded by accuracy
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={responseTimeDifficultyData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="difficulty" 
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Item Difficulty Level', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <YAxis 
                      dataKey="responseTime"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Response Time (seconds)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <Tooltip content={<ScatterTooltip />} />
                    <Scatter dataKey="responseTime" fill="hsl(var(--primary))">
                      {responseTimeDifficultyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.correct ? "#10b981" : "#ef4444"}
                          stroke={entry.correct ? "#059669" : "#dc2626"}
                          strokeWidth={2}
                          r={6}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-6 flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-600"></div>
                    <span className="font-medium">Correct Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-600"></div>
                    <span className="font-medium">Incorrect Answer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Response Time Statistics Section */}
          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Response Time Statistics</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">Flagged items with anomalous response times</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">SL No.</th>
                      <th className="text-left p-3 font-semibold">Item Name</th>
                      <th className="text-left p-3 font-semibold">Item Response Time</th>
                      <th className="text-left p-3 font-semibold">Flagged</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3">1</td>
                      <td className="p-3 font-medium">Question 6</td>
                      <td className="p-3">395 seconds</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">Outlier</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3">2</td>
                      <td className="p-3 font-medium">Question 3</td>
                      <td className="p-3">3 seconds</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">Rapid Guess</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-3">3</td>
                      <td className="p-3 font-medium">Question 8</td>
                      <td className="p-3">285 seconds</td>
                      <td className="p-3">
                        <Badge variant="destructive" className="text-xs">Outlier</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Individual Anomaly Frequency Charts */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10">
                <BarChart3 className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold">Individual Anomaly Analysis</h3>
            </div>
            
            {anomalyData.map((anomaly, index) => {
              const responseTime = 395; // Mock response time for item 6
              const percentileRank = 99.96;
              const chartData = generateAnomalyFrequencyData(anomaly.itemNo, responseTime);
              
              return (
                <Card key={`anomaly-chart-${index}`} className="border-2 border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-semibold text-foreground mb-1">
                        Item No: {anomaly.itemNo}, Item Response Time (Sec): {responseTime}, 
                        Item PercentileRank (%): {percentileRank}, Outlier Score: {anomaly.outlierScore.toFixed(2)}
                      </h4>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-8 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-cyan-400 border border-cyan-500"></div>
                        <span className="text-sm font-medium">Bar Dataset</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 border border-red-600"></div>
                        <span className="text-sm font-medium">Marker</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis 
                          dataKey="timeRange" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          label={{ value: 'Item Response', position: 'insideBottom', offset: -40, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          label={{ value: 'Item Response Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                        />
                        <Tooltip 
                          content={({ active, payload, label }: any) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-card p-4 border rounded-lg shadow-lg backdrop-blur-sm border-border/50">
                                  <p className="font-semibold text-foreground mb-2">{label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Frequency: <span className="font-medium text-foreground">{data.frequency}</span>
                                  </p>
                                  {data.isAnomaly && (
                                    <p className="text-sm text-red-500 font-medium">Anomaly Detected</p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="frequency" 
                          fill="#22d3ee"
                          stroke="#06b6d4"
                          strokeWidth={1}
                          radius={[2, 2, 0, 0]}
                        />
                        {chartData.map((entry, barIndex) => 
                          entry.isAnomaly ? (
                            <ReferenceDot
                              key={`marker-${barIndex}`}
                              x={entry.timeRange}
                              y={entry.frequency}
                              r={0}
                              fill="transparent"
                              shape={(props: any) => {
                                const { cx, cy } = props;
                                return (
                                  <rect
                                    x={cx - 8}
                                    y={cy - 8}
                                    width={16}
                                    height={16}
                                    fill="#ef4444"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                  />
                                );
                              }}
                            />
                          ) : null
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}