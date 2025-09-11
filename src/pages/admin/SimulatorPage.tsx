import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Play, Pause, Square, Settings, Activity, BarChart3 } from "lucide-react";

interface SimulationConfig {
  apiEndpoint: string;
  testName: string;
  location: string;
  testCenter: string;
  startTime: string;
  endTime: string;
  numberOfQuestions: number;
  numberOfCandidates: number;
}

interface CandidateData {
  studentId: string;
  questionId: string;
  responseTime: number;
  timeStamp: string;
  historicalAvg: number;
  optionSelected: string;
  correctOption: string;
  itemDifficulty: number;
}

interface AnomalyResult {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  studentId: string;
  questionId: string;
  timestamp: string;
}

export default function SimulatorPage() {
  const [config, setConfig] = useState<SimulationConfig>({
    apiEndpoint: "https://api.exam-monitor.com/v1/data",
    testName: "",
    location: "",
    testCenter: "",
    startTime: "",
    endTime: "",
    numberOfQuestions: 50,
    numberOfCandidates: 100
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<CandidateData[]>([]);
  const [detectedAnomalies, setDetectedAnomalies] = useState<AnomalyResult[]>([]);

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 0.5;
        });
        
        // Generate mock data
        generateMockData();
        
        // Detect anomalies
        if (Math.random() < 0.1) { // 10% chance of anomaly per tick
          detectAnomalies();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const generateMockData = () => {
    const newData: CandidateData = {
      studentId: `STD_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      questionId: `Q_${Math.floor(Math.random() * config.numberOfQuestions) + 1}`,
      responseTime: Math.random() * 300 + 10, // 10-310 seconds
      timeStamp: new Date().toISOString(),
      historicalAvg: Math.random() * 180 + 60, // 60-240 seconds
      optionSelected: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      correctOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      itemDifficulty: Math.random() * 0.8 + 0.1 // 0.1-0.9
    };

    setGeneratedData(prev => [...prev.slice(-99), newData]); // Keep last 100 entries
  };

  const detectAnomalies = () => {
    const anomalyTypes = [
      "Response Time-Based Anomaly",
      "Answer Revision Pattern",
      "Deviation from Test Center Mean",
      "WR/TE Ratio Anomaly",
      "Response Time Window Change",
      "Probability Correctness Anomaly",
      "Score Profile Anomaly",
      "Inter-Test Taker Similarity"
    ];

    const newAnomaly: AnomalyResult = {
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      description: "Anomalous behavior detected in candidate response patterns",
      studentId: `STD_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      questionId: `Q_${Math.floor(Math.random() * config.numberOfQuestions) + 1}`,
      timestamp: new Date().toISOString()
    };

    setDetectedAnomalies(prev => [...prev.slice(-49), newAnomaly]); // Keep last 50 anomalies
  };

  const startSimulation = () => {
    setIsRunning(true);
    setIsPaused(false);
    setProgress(0);
    setGeneratedData([]);
    setDetectedAnomalies([]);
  };

  const pauseSimulation = () => {
    setIsPaused(!isPaused);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Test Data Simulator</h1>
          <p className="text-muted-foreground">Generate test data and detect anomalies in real-time</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Configuration */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Set up your simulation parameters and test details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
                  <Input
                    id="apiEndpoint"
                    value={config.apiEndpoint}
                    onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/test-data"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name</Label>
                    <Select 
                      value={config.testName} 
                      onValueChange={(value) => setConfig({ ...config, testName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics Assessment">Mathematics Assessment</SelectItem>
                        <SelectItem value="Science Evaluation">Science Evaluation</SelectItem>
                        <SelectItem value="Language Proficiency">Language Proficiency</SelectItem>
                        <SelectItem value="Critical Thinking">Critical Thinking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={config.location} 
                      onValueChange={(value) => setConfig({ ...config, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="Chicago">Chicago</SelectItem>
                        <SelectItem value="Houston">Houston</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testCenter">Test Center</Label>
                  <Select 
                    value={config.testCenter} 
                    onValueChange={(value) => setConfig({ ...config, testCenter: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Center A">Center A</SelectItem>
                      <SelectItem value="Center B">Center B</SelectItem>
                      <SelectItem value="Center C">Center C</SelectItem>
                      <SelectItem value="Center D">Center D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={config.startTime}
                      onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={config.endTime}
                      onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                    <Input
                      id="numberOfQuestions"
                      type="number"
                      min="1"
                      max="200"
                      value={config.numberOfQuestions}
                      onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfCandidates">Number of Candidates</Label>
                    <Input
                      id="numberOfCandidates"
                      type="number"
                      min="1"
                      max="1000"
                      value={config.numberOfCandidates}
                      onChange={(e) => setConfig({ ...config, numberOfCandidates: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Simulation */}
          <div className="flex flex-col gap-6">
            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Simulation Control
                </CardTitle>
                <CardDescription>
                  Control your simulation and monitor progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Status: <span className={`${isRunning ? 'text-green-600' : isPaused ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                        {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
                  </div>
                  <div className="flex gap-2">
                    {!isRunning && !isPaused && (
                      <Button onClick={startSimulation} className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    )}
                    {isRunning && (
                      <Button onClick={pauseSimulation} variant="outline" className="flex items-center gap-2">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    {(isRunning || isPaused) && (
                      <Button onClick={stopSimulation} variant="destructive" className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>

                <Progress value={progress} className="w-full" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="font-medium">{generatedData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Anomalies:</span>
                    <span className="font-medium text-red-600">{detectedAnomalies.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Detection Results */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Detected Anomalies
                </CardTitle>
                <CardDescription>
                  Real-time anomaly detection results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {detectedAnomalies.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No anomalies detected yet</p>
                        <p className="text-sm">Start the simulation to begin detection</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detectedAnomalies.map((anomaly, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(anomaly.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <h4 className="font-medium">{anomaly.type}</h4>
                          <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>Student: {anomaly.studentId}</span>
                            <span>Question: {anomaly.questionId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Generated Data Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Generated Data
                </CardTitle>
                <CardDescription>
                  Latest generated test responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {generatedData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No data generated yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {generatedData.slice(-10).map((data, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                          <span className="font-mono">{data.studentId}</span>
                          <span>Q{data.questionId}</span>
                          <span className={`font-medium ${data.optionSelected === data.correctOption ? 'text-green-600' : 'text-red-600'}`}>
                            {data.optionSelected === data.correctOption ? 'Correct' : 'Wrong'}
                          </span>
                          <span className="text-muted-foreground">{data.responseTime.toFixed(0)}ms</span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}