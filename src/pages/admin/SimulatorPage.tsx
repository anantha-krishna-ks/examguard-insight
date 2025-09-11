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
  // Candidate Information
  studentId: string;
  qnId: string;
  candidateQnResponseTime: number;
  timeStamp: string;
  historicalAvg: number;
  optionSelected: string;
  correctOption: string;
  itemDifficulty: number;
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
    // Candidate Information
    studentId: "",
    qnId: "",
    candidateQnResponseTime: 0,
    timeStamp: "",
    historicalAvg: 0,
    optionSelected: "",
    correctOption: "",
    itemDifficulty: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<CandidateData[]>([]);
  const [detectedAnomalies, setDetectedAnomalies] = useState<AnomalyResult[]>([]);
  const [testQueue, setTestQueue] = useState<SimulationConfig[]>([]);

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

  const addTestToQueue = () => {
    if (config.testName && config.numberOfQuestions) {
      setTestQueue(prev => [...prev, { ...config }]);
      // Reset form after adding
      setConfig({
        ...config,
        testName: "",
        numberOfQuestions: 50
      });
    }
  };

  const removeTestFromQueue = (index: number) => {
    setTestQueue(prev => prev.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Test Forensics Data Simulator</h1>
          <p className="text-slate-400">Generate real-time test data with configurable anomalies to validate your forensics application.</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Configuration */}
          <div className="bg-slate-800 rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-6">Configuration</h2>
            
            <div className="space-y-6 flex-1">
              {/* API Endpoint */}
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint" className="text-slate-300">API Endpoint URL</Label>
                <Input
                  id="apiEndpoint"
                  value={config.apiEndpoint}
                  onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  placeholder="https://yourapi.com/testdata"
                />
              </div>

              {/* Test Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Test Configuration</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Test Name</Label>
                    <Select 
                      value={config.testName} 
                      onValueChange={(value) => setConfig({ ...config, testName: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select test name" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="Mathematics Assessment">Mathematics Assessment</SelectItem>
                        <SelectItem value="Science Evaluation">Science Evaluation</SelectItem>
                        <SelectItem value="Language Proficiency">Language Proficiency</SelectItem>
                        <SelectItem value="Critical Thinking">Critical Thinking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Location</Label>
                    <Select 
                      value={config.location} 
                      onValueChange={(value) => setConfig({ ...config, location: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="Chicago">Chicago</SelectItem>
                        <SelectItem value="Houston">Houston</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Test Center</Label>
                    <Select 
                      value={config.testCenter} 
                      onValueChange={(value) => setConfig({ ...config, testCenter: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select test center" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="Center A">Center A</SelectItem>
                        <SelectItem value="Center B">Center B</SelectItem>
                        <SelectItem value="Center C">Center C</SelectItem>
                        <SelectItem value="Center D">Center D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Start Time</Label>
                    <Input
                      type="datetime-local"
                      value={config.startTime}
                      onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">End Time</Label>
                    <Input
                      type="datetime-local"
                      value={config.endTime}
                      onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Questions</Label>
                  <Input
                    type="number"
                    value={config.numberOfQuestions}
                    onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="Number of Questions"
                    min="1"
                    max="200"
                  />
                </div>
              </div>

              {/* Candidate Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Candidate Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Student ID</Label>
                    <Input
                      value={config.studentId}
                      onChange={(e) => setConfig({ ...config, studentId: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="e.g., STD_001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Question ID</Label>
                    <Input
                      value={config.qnId}
                      onChange={(e) => setConfig({ ...config, qnId: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="e.g., Q_001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Response Time (ms)</Label>
                    <Input
                      type="number"
                      value={config.candidateQnResponseTime}
                      onChange={(e) => setConfig({ ...config, candidateQnResponseTime: parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="Response time in milliseconds"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Time Stamp</Label>
                    <Input
                      value={config.timeStamp}
                      onChange={(e) => setConfig({ ...config, timeStamp: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="ISO timestamp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Historical Average (ms)</Label>
                    <Input
                      type="number"
                      value={config.historicalAvg}
                      onChange={(e) => setConfig({ ...config, historicalAvg: parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="Historical average response time"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Option Selected</Label>
                    <Select 
                      value={config.optionSelected} 
                      onValueChange={(value) => setConfig({ ...config, optionSelected: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Correct Option</Label>
                    <Select 
                      value={config.correctOption} 
                      onValueChange={(value) => setConfig({ ...config, correctOption: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select correct option" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Item Difficulty</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={config.itemDifficulty}
                      onChange={(e) => setConfig({ ...config, itemDifficulty: parseFloat(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="0.0 - 1.0"
                      min="0"
                      max="1"
                    />
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={startSimulation}
                  disabled={isRunning}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Run Simulation
                </Button>
                <Button 
                  onClick={stopSimulation}
                  disabled={!isRunning && !isPaused}
                  variant="destructive"
                  className="flex-1"
                >
                  Stop Simulation
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Live Dashboard */}
          <div className="bg-slate-800 rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-6">Live Dashboard</h2>
            
            <div className="flex-1 space-y-6">
              {/* Dashboard Status */}
              <div className="text-center py-8">
                {!isRunning && testQueue.length === 0 ? (
                  <p className="text-slate-400">Simulation has not started. Configure tests and press 'Run'.</p>
                ) : !isRunning ? (
                  <p className="text-slate-400">Ready to start simulation. Press 'Run Simulation' to begin.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Simulation Running</span>
                      </div>
                      <span className="text-slate-400">Progress: {progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="w-full max-w-md mx-auto" />
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{generatedData.length}</p>
                        <p className="text-slate-400 text-sm">Data Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-400">{detectedAnomalies.length}</p>
                        <p className="text-slate-400 text-sm">Anomalies</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Log */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-4">Event Log</h3>
                <div className="bg-slate-900 rounded-lg p-4 h-[400px]">
                  <ScrollArea className="h-full">
                    {detectedAnomalies.length === 0 && generatedData.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-slate-500 text-center">Event log is empty<br />Start simulation to see events</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Show recent anomalies first */}
                        {detectedAnomalies.slice(-10).reverse().map((anomaly, index) => (
                          <div key={`anomaly-${index}`} className="border-l-4 border-red-500 pl-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="destructive" className="text-xs">
                                ANOMALY
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {new Date(anomaly.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-white text-sm font-medium">{anomaly.type}</p>
                            <p className="text-slate-400 text-xs">
                              Student: {anomaly.studentId} • Question: {anomaly.questionId}
                            </p>
                          </div>
                        ))}
                        
                        {/* Show recent data points */}
                        {generatedData.slice(-5).reverse().map((data, index) => (
                          <div key={`data-${index}`} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                                DATA
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {new Date(data.timeStamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-white text-sm">
                              {data.studentId} answered Q{data.questionId}
                            </p>
                            <p className="text-slate-400 text-xs">
                              Response: {data.optionSelected} • 
                              Time: {data.responseTime.toFixed(0)}ms • 
                              <span className={data.optionSelected === data.correctOption ? 'text-green-400' : 'text-red-400'}>
                                {data.optionSelected === data.correctOption ? 'Correct' : 'Wrong'}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}