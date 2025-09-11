import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Play, Pause, Square, Settings, Activity, Users, Clock, Target } from "lucide-react";

interface SimulationConfig {
  apiEndpoint: string;
  testName: string;
  location: string;
  testCenter: string;
  startTime: string;
  endTime: string;
  numQuestions: number;
  numCandidates: number;
}

interface CandidateData {
  studentId: string;
  qnId: string;
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
  candidateId: string;
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
    numQuestions: 50,
    numCandidates: 100
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<CandidateData[]>([]);
  const [detectedAnomalies, setDetectedAnomalies] = useState<AnomalyResult[]>([]);
  const [activeTests, setActiveTests] = useState(0);

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
      qnId: `Q_${Math.floor(Math.random() * config.numQuestions) + 1}`,
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
      candidateId: `STD_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };

    setDetectedAnomalies(prev => [...prev.slice(-49), newAnomaly]); // Keep last 50 anomalies
  };

  const startSimulation = () => {
    setIsRunning(true);
    setIsPaused(false);
    setActiveTests(Math.floor(Math.random() * 5) + 1);
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
    setActiveTests(0);
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Anomaly Simulator</h1>
          <p className="text-muted-foreground">Generate and analyze test data for anomaly detection</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-4 h-4 mr-1" />
            {activeTests} Active Tests
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="data">Generated Data</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Simulation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
                    <Input
                      id="apiEndpoint"
                      value={config.apiEndpoint}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                      placeholder="https://api.example.com/v1/data"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name</Label>
                    <Select value={config.testName} onValueChange={(value) => setConfig(prev => ({ ...prev, testName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics-advanced">Mathematics Advanced</SelectItem>
                        <SelectItem value="english-proficiency">English Proficiency</SelectItem>
                        <SelectItem value="science-comprehensive">Science Comprehensive</SelectItem>
                        <SelectItem value="aptitude-general">General Aptitude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={config.location} onValueChange={(value) => setConfig(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="london">London</SelectItem>
                        <SelectItem value="singapore">Singapore</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testCenter">Test Center</Label>
                    <Select value={config.testCenter} onValueChange={(value) => setConfig(prev => ({ ...prev, testCenter: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center-001">Training Center 001</SelectItem>
                        <SelectItem value="center-002">Training Center 002</SelectItem>
                        <SelectItem value="center-003">Training Center 003</SelectItem>
                        <SelectItem value="center-004">Training Center 004</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={config.startTime}
                        onChange={(e) => setConfig(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={config.endTime}
                        onChange={(e) => setConfig(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numQuestions">Number of Questions</Label>
                    <Input
                      id="numQuestions"
                      type="number"
                      value={config.numQuestions}
                      onChange={(e) => setConfig(prev => ({ ...prev, numQuestions: parseInt(e.target.value) || 0 }))}
                      min="1"
                      max="200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numCandidates">Number of Candidates</Label>
                    <Input
                      id="numCandidates"
                      type="number"
                      value={config.numCandidates}
                      onChange={(e) => setConfig(prev => ({ ...prev, numCandidates: parseInt(e.target.value) || 0 }))}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Simulation Control
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={startSimulation}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  <Button
                    onClick={pauseSimulation}
                    disabled={!isRunning}
                    variant="outline"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={stopSimulation}
                    disabled={!isRunning}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simulation Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Data Points</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{generatedData.length}</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Anomalies</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{detectedAnomalies.length}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Tests</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{activeTests}</p>
                      </div>
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Candidates</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{config.numCandidates}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Detected Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {detectedAnomalies.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No anomalies detected yet. Start the simulation to begin detection.</p>
                  ) : (
                    detectedAnomalies.slice().reverse().map((anomaly, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{anomaly.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Candidate: {anomaly.candidateId} • {new Date(anomaly.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Generated Data Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {generatedData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No data generated yet. Start the simulation to begin data generation.</p>
                  ) : (
                    generatedData.slice().reverse().map((data, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-card text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <span className="font-medium">Student:</span> {data.studentId}
                          </div>
                          <div>
                            <span className="font-medium">Question:</span> {data.qnId}
                          </div>
                          <div>
                            <span className="font-medium">Response Time:</span> {data.responseTime.toFixed(1)}s
                          </div>
                          <div>
                            <span className="font-medium">Selected:</span> {data.optionSelected} 
                            {data.optionSelected === data.correctOption ? ' ✓' : ' ✗'}
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <div>Historical Avg: {data.historicalAvg.toFixed(1)}s</div>
                          <div>Difficulty: {data.itemDifficulty.toFixed(2)}</div>
                          <div>Time: {new Date(data.timeStamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}