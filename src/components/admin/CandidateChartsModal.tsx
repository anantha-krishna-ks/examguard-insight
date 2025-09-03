import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { BarChart3, TrendingUp, Clock } from "lucide-react";

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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
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
        <div className="bg-card p-3 border rounded shadow-sm">
          <p className="font-medium">{data.itemId}</p>
          <p>Difficulty: {data.difficulty}</p>
          <p>Response Time: {data.responseTime}s</p>
          <p>Result: {data.correct ? 'Correct' : 'Incorrect'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Candidate Analytics - {candidate?.name}
            </DialogTitle>
            <Badge variant="outline" className="text-primary border-primary">
              {candidate?.id}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="forensics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forensics">Post Test Forensics</TabsTrigger>
            <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="forensics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* OS Curve */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>OS Curve (Cumulative Response Probability)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={osCurveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Item Time Frequency Distribution */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Item Time Frequency Distribution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timeRange" 
                        label={{ value: 'Time Range', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="frequency" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Response Time vs Difficulty */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Response Time vs Item Difficulty</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Green indicates correct answers, red indicates incorrect answers
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={responseTimeDifficultyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="difficulty" 
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      label={{ value: 'Item Difficulty', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="responseTime"
                      label={{ value: 'Response Time (seconds)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<ScatterTooltip />} />
                    <Scatter dataKey="responseTime">
                      {responseTimeDifficultyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.correct ? "#10b981" : "#ef4444"} 
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Correct Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Incorrect Answer</span>
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