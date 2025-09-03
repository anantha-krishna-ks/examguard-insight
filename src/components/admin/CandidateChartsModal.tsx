import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

// Mock data for OS Curve
const osCurveData = [
  { time: 0, probability: 0 },
  { time: 30, probability: 0.15 },
  { time: 60, probability: 0.35 },
  { time: 90, probability: 0.55 },
  { time: 120, probability: 0.75 },
  { time: 150, probability: 0.85 },
  { time: 180, probability: 0.92 },
  { time: 210, probability: 0.96 },
  { time: 240, probability: 0.98 },
  { time: 270, probability: 0.99 },
  { time: 300, probability: 1.0 }
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

        <Tabs defaultValue="forensics" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border/50 shadow-sm rounded-lg p-1">
            <TabsTrigger value="forensics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Post Test Forensics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Performance Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forensics" className="space-y-6 mt-6">
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
                    <Badge variant="secondary" className="text-xs">Cumulative Response Probability</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={osCurveData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="osGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Probability', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fill="url(#osGradient)"
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
                        activeDot={{ r: 7, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Item Time Frequency Distribution */}
              <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Time Distribution</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">Response Frequency</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={timeFrequencyData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="timeRange" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        label={{ value: 'Time Range', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="frequency" 
                        fill="url(#barGradient)" 
                        radius={[4, 4, 0, 0]}
                        stroke="hsl(var(--primary))"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">8.5</div>
                  <p className="text-xs text-muted-foreground">Avg. Response Time (min)</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">75%</div>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}