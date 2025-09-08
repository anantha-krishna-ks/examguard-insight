import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArrowLeft, BarChart3, Filter, Users, Eye, EyeOff, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BehavioralPatternModal } from "@/components/admin/BehavioralPatternModal";
import { ViolinPlot } from "@/components/admin/ViolinPlot";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";

type ViewLevel = 'test' | 'location' | 'testcenter';
type FilterType = 'all' | 'flagged' | 'unflagged';

interface BehavioralPatternAnalysisPageProps {}

// Mock data for different levels
const testLevelData = [
  { name: 'Test 1', sequentialPattern: 152, answerRevision: 26 },
  { name: 'Test 2', sequentialPattern: 206, answerRevision: 51 },
  { name: 'Test 3', sequentialPattern: 97, answerRevision: 5 },
  { name: 'Test 4', sequentialPattern: 134, answerRevision: 33 },
  { name: 'Test 5', sequentialPattern: 178, answerRevision: 42 },
];

const locationLevelData = [
  { name: 'Hyderabad', sequentialPattern: 324, answerRevision: 67 },
  { name: 'Malaysia', sequentialPattern: 289, answerRevision: 54 },
  { name: 'Mysore', sequentialPattern: 198, answerRevision: 43 },
  { name: 'Noida', sequentialPattern: 245, answerRevision: 38 },
  { name: 'Central Region', sequentialPattern: 312, answerRevision: 71 },
];

const testCenterLevelData = [
  { name: 'HYD-001', sequentialPattern: 89, answerRevision: 21 },
  { name: 'HYD-002', sequentialPattern: 76, answerRevision: 18 },
  { name: 'HYD-003', sequentialPattern: 103, answerRevision: 28 },
  { name: 'HYD-004', sequentialPattern: 94, answerRevision: 15 },
  { name: 'HYD-005', sequentialPattern: 87, answerRevision: 23 },
  { name: 'HYD-006', sequentialPattern: 112, answerRevision: 31 },
];

// Answer Revision detailed analysis data
const answerChangePercentageData = {
  test: [
    { name: 'Test 1', changePercentage: 18.5, anomalyCount: 12 },
    { name: 'Test 2', changePercentage: 23.7, anomalyCount: 18 },
    { name: 'Test 3', changePercentage: 8.2, anomalyCount: 3 },
    { name: 'Test 4', changePercentage: 16.9, anomalyCount: 9 },
    { name: 'Test 5', changePercentage: 21.3, anomalyCount: 15 },
  ],
  location: [
    { name: 'Hyderabad', changePercentage: 24.8, anomalyCount: 28 },
    { name: 'Malaysia', changePercentage: 19.6, anomalyCount: 22 },
    { name: 'Mysore', changePercentage: 15.3, anomalyCount: 16 },
    { name: 'Noida', changePercentage: 17.8, anomalyCount: 19 },
    { name: 'Central Region', changePercentage: 26.4, anomalyCount: 31 },
  ],
  testcenter: [
    { name: 'HYD-001', changePercentage: 22.1, anomalyCount: 8 },
    { name: 'HYD-002', changePercentage: 16.7, anomalyCount: 6 },
    { name: 'HYD-003', changePercentage: 28.3, anomalyCount: 11 },
    { name: 'HYD-004', changePercentage: 19.4, anomalyCount: 7 },
    { name: 'HYD-005', changePercentage: 21.8, anomalyCount: 9 },
    { name: 'HYD-006', changePercentage: 25.6, anomalyCount: 12 },
  ]
};

const meanDeviationData = {
  location: [
    { name: 'Hyderabad', scores: [15.2, 16.8, 14.5, 17.1, 15.9, 16.3, 14.8, 17.5, 15.7, 16.1], median: 15.99, q1: 15.2, q3: 16.8 },
    { name: 'Malaysia', scores: [13.8, 14.2, 13.5, 14.7, 13.9, 14.1, 13.6, 14.4, 13.7, 14.0], median: 13.99, q1: 13.5, q3: 14.4 },
    { name: 'Mysore', scores: [12.1, 12.8, 11.9, 13.2, 12.4, 12.6, 12.0, 13.0, 12.3, 12.5], median: 12.48, q1: 12.0, q3: 13.0 },
    { name: 'Noida', scores: [14.3, 15.1, 13.8, 15.6, 14.7, 14.9, 14.2, 15.3, 14.5, 14.8], median: 14.72, q1: 14.2, q3: 15.3 },
  ],
  testcenter: [
    { name: 'HYD-001', scores: [14.8, 15.2, 14.5, 15.7, 15.0, 15.3, 14.7, 15.5, 14.9, 15.1], median: 15.07, q1: 14.7, q3: 15.5 },
    { name: 'HYD-002', scores: [13.2, 13.8, 13.0, 14.1, 13.5, 13.7, 13.1, 13.9, 13.3, 13.6], median: 13.52, q1: 13.1, q3: 13.9 },
    { name: 'HYD-003', scores: [16.1, 16.9, 15.8, 17.2, 16.5, 16.7, 16.0, 17.0, 16.3, 16.6], median: 16.51, q1: 16.0, q3: 17.0 },
    { name: 'HYD-004', scores: [15.3, 15.9, 15.0, 16.2, 15.6, 15.8, 15.2, 16.0, 15.4, 15.7], median: 15.61, q1: 15.2, q3: 16.0 },
    { name: 'HYD-005', scores: [14.5, 15.1, 14.2, 15.4, 14.8, 15.0, 14.4, 15.2, 14.6, 14.9], median: 14.81, q1: 14.4, q3: 15.2 },
    { name: 'HYD-006', scores: [16.8, 17.6, 16.5, 17.9, 17.2, 17.4, 16.7, 17.7, 17.0, 17.3], median: 17.21, q1: 16.7, q3: 17.7 },
  ]
};

const wrTeRatioData = {
  test: [
    { name: 'Test 1', wrRatio: 0.72, teRatio: 0.28, combinedRatio: 2.57 },
    { name: 'Test 2', wrRatio: 0.68, teRatio: 0.32, combinedRatio: 2.13 },
    { name: 'Test 3', wrRatio: 0.81, teRatio: 0.19, combinedRatio: 4.26 },
    { name: 'Test 4', wrRatio: 0.75, teRatio: 0.25, combinedRatio: 3.00 },
    { name: 'Test 5', wrRatio: 0.70, teRatio: 0.30, combinedRatio: 2.33 },
  ],
  location: [
    { name: 'Hyderabad', wrRatio: 0.73, teRatio: 0.27, combinedRatio: 2.70 },
    { name: 'Malaysia', wrRatio: 0.69, teRatio: 0.31, combinedRatio: 2.23 },
    { name: 'Mysore', wrRatio: 0.78, teRatio: 0.22, combinedRatio: 3.55 },
    { name: 'Noida', wrRatio: 0.71, teRatio: 0.29, combinedRatio: 2.45 },
    { name: 'Central Region', wrRatio: 0.67, teRatio: 0.33, combinedRatio: 2.03 },
  ],
  testcenter: [
    { name: 'HYD-001', wrRatio: 0.74, teRatio: 0.26, combinedRatio: 2.85 },
    { name: 'HYD-002', wrRatio: 0.71, teRatio: 0.29, combinedRatio: 2.45 },
    { name: 'HYD-003', wrRatio: 0.76, teRatio: 0.24, combinedRatio: 3.17 },
    { name: 'HYD-004', wrRatio: 0.72, teRatio: 0.28, combinedRatio: 2.57 },
    { name: 'HYD-005', wrRatio: 0.73, teRatio: 0.27, combinedRatio: 2.70 },
    { name: 'HYD-006', wrRatio: 0.75, teRatio: 0.25, combinedRatio: 3.00 },
  ]
};

const behavioralCandidateData = [
  { id: 'BP001', name: 'Raj Patel', email: 'raj@example.com', status: 'Completed', flagged: true, anomalyScore: 0.89, anomalyType: 'Sequential Pattern', testName: 'Behavioral Assessment A' },
  { id: 'BP002', name: 'Priya Singh', email: 'priya@example.com', status: 'In Progress', flagged: false, anomalyScore: 0.23, anomalyType: 'None', testName: 'Pattern Recognition Test' },
  { id: 'BP003', name: 'Kumar Das', email: 'kumar@example.com', status: 'Completed', flagged: true, anomalyScore: 0.94, anomalyType: 'Answer Revision', testName: 'Cognitive Analysis' },
  { id: 'BP004', name: 'Anita Sharma', email: 'anita@example.com', status: 'Not Started', flagged: false, anomalyScore: 0.18, anomalyType: 'None', testName: 'Behavioral Assessment B' },
  { id: 'BP005', name: 'Vikram Gupta', email: 'vikram@example.com', status: 'Completed', flagged: true, anomalyScore: 0.81, anomalyType: 'Change Frequency', testName: 'Pattern Recognition Test' },
];


// Violin plot data for WR scores
const violinPlotData = {
  location: [
    { name: 'Hyderabad', scores: [28, 29, 30, 31, 29, 28, 30, 31, 29, 30], median: 29.5, q1: 28.5, q3: 30.5 },
    { name: 'Malaysia', scores: [26, 27, 28, 29, 27, 26, 28, 29, 27, 28], median: 27.5, q1: 26.5, q3: 28.5 },
    { name: 'Mysore', scores: [30, 31, 32, 33, 31, 30, 32, 33, 31, 32], median: 31.5, q1: 30.5, q3: 32.5 },
    { name: 'Noida', scores: [29, 30, 31, 32, 30, 29, 31, 32, 30, 31], median: 30.5, q1: 29.5, q3: 31.5 },
  ],
  testcenter: [
    { name: 'HYD-001', scores: [27, 28, 29, 30, 28, 27, 29, 30, 28, 29], median: 28.5, q1: 27.5, q3: 29.5 },
    { name: 'HYD-002', scores: [25, 26, 27, 28, 26, 25, 27, 28, 26, 27], median: 26.5, q1: 25.5, q3: 27.5 },
    { name: 'HYD-003', scores: [29, 30, 31, 32, 30, 29, 31, 32, 30, 31], median: 30.5, q1: 29.5, q3: 31.5 },
    { name: 'HYD-004', scores: [28, 29, 30, 31, 29, 28, 30, 31, 29, 30], median: 29.5, q1: 28.5, q3: 30.5 },
    { name: 'HYD-005', scores: [26, 27, 28, 29, 27, 26, 28, 29, 27, 28], median: 27.5, q1: 26.5, q3: 28.5 },
    { name: 'HYD-006', scores: [30, 31, 32, 33, 31, 30, 32, 33, 31, 32], median: 31.5, q1: 30.5, q3: 32.5 },
  ]
};

// Test Center specific additional data
const perItemChangesData = {
  'HYD-001': [
    { item: 'Item 1', wrongToRight: 8, wrongToWrong: 4, rightToWrong: 2 },
    { item: 'Item 2', wrongToRight: 12, wrongToWrong: 6, rightToWrong: 3 },
    { item: 'Item 3', wrongToRight: 6, wrongToWrong: 8, rightToWrong: 5 },
    { item: 'Item 4', wrongToRight: 10, wrongToWrong: 3, rightToWrong: 1 },
    { item: 'Item 5', wrongToRight: 15, wrongToWrong: 7, rightToWrong: 4 },
  ],
  'HYD-002': [
    { item: 'Item 1', wrongToRight: 6, wrongToWrong: 3, rightToWrong: 1 },
    { item: 'Item 2', wrongToRight: 9, wrongToWrong: 5, rightToWrong: 2 },
    { item: 'Item 3', wrongToRight: 4, wrongToWrong: 6, rightToWrong: 4 },
    { item: 'Item 4', wrongToRight: 8, wrongToWrong: 2, rightToWrong: 1 },
    { item: 'Item 5', wrongToRight: 11, wrongToWrong: 5, rightToWrong: 3 },
  ],
  'HYD-003': [
    { item: 'Item 1', wrongToRight: 14, wrongToWrong: 8, rightToWrong: 3 },
    { item: 'Item 2', wrongToRight: 18, wrongToWrong: 10, rightToWrong: 5 },
    { item: 'Item 3', wrongToRight: 10, wrongToWrong: 12, rightToWrong: 7 },
    { item: 'Item 4', wrongToRight: 16, wrongToWrong: 6, rightToWrong: 2 },
    { item: 'Item 5', wrongToRight: 22, wrongToWrong: 11, rightToWrong: 6 },
  ],
};

const responseTimeWindowData = {
  'HYD-001': [
    { timeWindow: '0-5s', changes: 12, mostModifiedItem: 'Item 3' },
    { timeWindow: '5-10s', changes: 8, mostModifiedItem: 'Item 1' },
    { timeWindow: '10-15s', changes: 6, mostModifiedItem: 'Item 5' },
    { timeWindow: '15-20s', changes: 4, mostModifiedItem: 'Item 2' },
    { timeWindow: '20-25s', changes: 3, mostModifiedItem: 'Item 4' },
  ],
  'HYD-002': [
    { timeWindow: '0-5s', changes: 9, mostModifiedItem: 'Item 2' },
    { timeWindow: '5-10s', changes: 6, mostModifiedItem: 'Item 1' },
    { timeWindow: '10-15s', changes: 4, mostModifiedItem: 'Item 4' },
    { timeWindow: '15-20s', changes: 3, mostModifiedItem: 'Item 3' },
    { timeWindow: '20-25s', changes: 2, mostModifiedItem: 'Item 5' },
  ],
  'HYD-003': [
    { timeWindow: '0-5s', changes: 18, mostModifiedItem: 'Item 5' },
    { timeWindow: '5-10s', changes: 14, mostModifiedItem: 'Item 2' },
    { timeWindow: '10-15s', changes: 10, mostModifiedItem: 'Item 1' },
    { timeWindow: '15-20s', changes: 8, mostModifiedItem: 'Item 3' },
    { timeWindow: '20-25s', changes: 5, mostModifiedItem: 'Item 4' },
  ],
};

const probabilityCorrectnessData = {
  'HYD-001': [
    { item: 'Item 1', probability: 0.72, candidatesAffected: 15 },
    { item: 'Item 2', probability: 0.68, candidatesAffected: 18 },
    { item: 'Item 3', probability: 0.81, candidatesAffected: 12 },
    { item: 'Item 4', probability: 0.75, candidatesAffected: 14 },
    { item: 'Item 5', probability: 0.63, candidatesAffected: 20 },
  ],
  'HYD-002': [
    { item: 'Item 1', probability: 0.69, candidatesAffected: 12 },
    { item: 'Item 2', probability: 0.74, candidatesAffected: 14 },
    { item: 'Item 3', probability: 0.66, candidatesAffected: 16 },
    { item: 'Item 4', probability: 0.78, candidatesAffected: 11 },
    { item: 'Item 5', probability: 0.71, candidatesAffected: 13 },
  ],
  'HYD-003': [
    { item: 'Item 1', probability: 0.65, candidatesAffected: 22 },
    { item: 'Item 2', probability: 0.59, candidatesAffected: 26 },
    { item: 'Item 3', probability: 0.73, candidatesAffected: 18 },
    { item: 'Item 4', probability: 0.67, candidatesAffected: 20 },
    { item: 'Item 5', probability: 0.61, candidatesAffected: 24 },
  ],
};

const levelLabels = {
  test: "Test",
  location: "Location", 
  testcenter: "Test Center"
};

export function BehavioralPatternAnalysisPage({}: BehavioralPatternAnalysisPageProps) {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('test');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>('all');
  const [clickedSegment, setClickedSegment] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateCharts, setShowCandidateCharts] = useState(false);

  const getCurrentData = () => {
    if (viewLevel === 'test') return testLevelData;
    if (viewLevel === 'location') return locationLevelData;
    return testCenterLevelData;
  };

  const getCurrentAnswerChangeData = () => {
    return answerChangePercentageData[viewLevel] || [];
  };

  const getCurrentMeanDeviationData = () => {
    if (viewLevel === 'location') return meanDeviationData.location;
    if (viewLevel === 'testcenter') return meanDeviationData.testcenter;
    return [];
  };

  const getCurrentWrTeRatioData = () => {
    return wrTeRatioData[viewLevel] || [];
  };

  const getCurrentPerItemChangesData = () => {
    if (viewLevel === 'testcenter' && selectedTestCenter) {
      return perItemChangesData[selectedTestCenter as keyof typeof perItemChangesData] || [];
    }
    return [];
  };

  const getCurrentResponseTimeData = () => {
    if (viewLevel === 'testcenter' && selectedTestCenter) {
      return responseTimeWindowData[selectedTestCenter as keyof typeof responseTimeWindowData] || [];
    }
    return [];
  };

  const getCurrentProbabilityData = () => {
    if (viewLevel === 'testcenter' && selectedTestCenter) {
      return probabilityCorrectnessData[selectedTestCenter as keyof typeof probabilityCorrectnessData] || [];
    }
    return [];
  };

  const getCurrentViolinData = () => {
    if (viewLevel === 'location') return violinPlotData.location;
    if (viewLevel === 'testcenter') return violinPlotData.testcenter;
    return [];
  };

  const handleLevelChange = (level: ViewLevel) => {
    setViewLevel(level);
    setSelectedLocation(null);
    setSelectedTestCenter(null);
    setShowCandidates(false);
    setClickedSegment(null);
  };

  const handleBarClick = (data: any, segment?: string) => {
    if (viewLevel === 'test') {
      // Drill down from test to location level
      setViewLevel('location');
    } else if (viewLevel === 'location' && !selectedLocation) {
      setSelectedLocation(data.name);
      setViewLevel('testcenter');
      } else if (viewLevel === 'testcenter') {
        setSelectedTestCenter(data.name);
        setShowCandidates(true);
        if (segment === 'sequentialPattern' || segment === 'answerRevision') {
          setClickedSegment(segment);
          setCandidateFilter('flagged');
        } else {
          setClickedSegment(null);
          setCandidateFilter('all');
        }
      }
    };

    const getFilteredCandidates = () => {
      let filtered = behavioralCandidateData;
      
      if (candidateFilter === 'flagged') {
        filtered = filtered.filter(c => c.flagged);
      } else if (candidateFilter === 'unflagged') {
        filtered = filtered.filter(c => !c.flagged);
      }
      
      return filtered;
    };

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowCandidateCharts(true);
  };


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Click to drill down
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Behavioral Pattern Anomaly Analysis</h1>
              <p className="text-muted-foreground">
                Hierarchical drill-down analysis at {levelLabels[viewLevel]} level
                {selectedLocation && ` - ${selectedLocation}`}
                {selectedTestCenter && ` - ${selectedTestCenter}`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-admin-answer-revision border-admin-answer-revision">
            <Brain className="h-4 w-4 mr-2" />
            Behavioral Analysis
          </Badge>
        </div>

        {/* Level Selector Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Analysis Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={viewLevel} onValueChange={handleLevelChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="test">Test</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="testcenter">Test Center</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-admin-answer-revision" />
                <CardTitle>
                  Behavioral Pattern Anomaly - {levelLabels[viewLevel]} Level
                  {selectedLocation && ` (${selectedLocation})`}
                </CardTitle>
              </div>
              {clickedSegment && (
                <Badge variant="destructive">
                  Showing flagged candidates from {clickedSegment} segment
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sequentialPattern" 
                  fill="#2563eb" 
                  name="Sequential Pattern"
                  onClick={(data) => handleBarClick(data, "sequentialPattern")}
                  style={{ cursor: "pointer" }}
                />
                <Bar 
                  dataKey="answerRevision" 
                  fill="#ea580c" 
                  name="Answer Revision"
                  onClick={(data) => handleBarClick(data, "answerRevision")}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>Behavioral Pattern Anomaly Distribution</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Sequential Pattern</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span>Answer Revision (Click for detailed analysis)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Revision Detailed Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Answer Revision Detailed Analysis</h2>
          
          {/* Answer Change Percentage Anomaly */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-500" />
                <span>Answer Change Percentage Anomaly (Revision on &gt;15% of total items)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCurrentAnswerChangeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'changePercentage' ? `${value}%` : value,
                      name === 'changePercentage' ? 'Change Percentage' : 'Anomaly Count'
                    ]}
                  />
                  <Bar dataKey="changePercentage" fill="#ef4444" name="Change Percentage" />
                  <Bar dataKey="anomalyCount" fill="#f59e0b" name="Anomaly Count" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-muted/20 rounded text-sm">
                <p className="font-medium">Anomaly Threshold: &gt;15% revision rate</p>
                <p className="text-xs text-muted-foreground">
                  Red bars show percentage of items revised, yellow bars show count of candidates with anomalous revision patterns.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deviation from Mean Values - Violin Plot */}
          {(viewLevel === 'location' || viewLevel === 'testcenter') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span>Deviation from Mean Values at {levelLabels[viewLevel]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ViolinPlot 
                  data={getCurrentMeanDeviationData()} 
                  width={400} 
                  height={300} 
                />
                <div className="mt-4 p-3 bg-muted/20 rounded text-sm">
                  <p className="font-medium">Mean Deviation Analysis:</p>
                  <p className="text-xs text-muted-foreground">
                    Violin plot shows how answer revision patterns deviate from location means. 
                    Wider sections indicate more common deviation ranges.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* WR/TE Ratio Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span>WR/TE Ratio Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCurrentWrTeRatioData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (typeof value === 'number') {
                        return [
                          name === 'combinedRatio' ? value.toFixed(2) : `${(value * 100).toFixed(1)}%`,
                          name === 'wrRatio' ? 'WR Ratio' : name === 'teRatio' ? 'TE Ratio' : 'WR/TE Ratio'
                        ];
                      }
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="wrRatio" fill="#10b981" name="WR Ratio" />
                  <Bar dataKey="teRatio" fill="#3b82f6" name="TE Ratio" />
                  <Bar dataKey="combinedRatio" fill="#8b5cf6" name="WR/TE Combined Ratio" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>WR (Wrong-Right) Ratio</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>TE (Time Extension) Ratio</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Combined WR/TE Ratio</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Center Specific Additional Charts */}
        {viewLevel === 'testcenter' && selectedTestCenter && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Test Center Detailed Analysis - {selectedTestCenter}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Per Item Changes Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Per Item Changes (W-R, W-W, R-W)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCurrentPerItemChangesData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="item" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="wrongToRight" fill="#10b981" name="W→R" />
                      <Bar dataKey="wrongToWrong" fill="#f59e0b" name="W→W" />
                      <Bar dataKey="rightToWrong" fill="#ef4444" name="R→W" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Wrong→Right</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Wrong→Wrong</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Right→Wrong</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Window Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <span>Response Changes in 5s Time Windows</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getCurrentResponseTimeData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeWindow" />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => `Time Window: ${label}`}
                        formatter={(value, name, props) => [
                          value,
                          'Changes',
                          `Most Modified: ${props.payload.mostModifiedItem}`
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="changes" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-muted/20 rounded text-sm">
                    <p className="font-medium">Time Window Analysis:</p>
                    <p className="text-xs text-muted-foreground">
                      Line plot shows response changes within 5-second intervals. Hover over points to see the most modified item in each window.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Probability of Correctness Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    <span>Probability of Correctness for Item Changes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCurrentProbabilityData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="item" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (typeof value === 'number') {
                            return [
                              name === 'probability' ? `${(value * 100).toFixed(1)}%` : value,
                              name === 'probability' ? 'Probability' : 'Candidates Affected'
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      <Bar dataKey="probability" fill="#6366f1" name="Probability" />
                      <Bar dataKey="candidatesAffected" fill="#06b6d4" name="Candidates Affected" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-muted/20 rounded text-sm">
                    <p className="font-medium">Correctness Probability:</p>
                    <p className="text-xs text-muted-foreground">
                      Shows probability of correct answers after item changes and number of candidates affected per item.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* WR/TE Ratio for Test Center */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <span>WR/TE Ratio Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCurrentWrTeRatioData().filter(d => d.name === selectedTestCenter)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (typeof value === 'number') {
                            return [
                              name === 'combinedRatio' ? value.toFixed(2) : `${(value * 100).toFixed(1)}%`,
                              name === 'wrRatio' ? 'WR Ratio' : name === 'teRatio' ? 'TE Ratio' : 'WR/TE Ratio'
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      <Bar dataKey="wrRatio" fill="#10b981" name="WR Ratio" />
                      <Bar dataKey="teRatio" fill="#3b82f6" name="TE Ratio" />
                      <Bar dataKey="combinedRatio" fill="#8b5cf6" name="WR/TE Combined Ratio" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>WR (Wrong-Right) Ratio</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>TE (Time Extension) Ratio</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Combined WR/TE Ratio</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Violin Plot for Student WR Scores */}
        {(viewLevel === 'location' || viewLevel === 'testcenter') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>Student WR Scores - Violin Plot</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ViolinPlot 
                data={getCurrentViolinData()} 
                width={400} 
                height={300} 
              />
              <div className="mt-4 p-3 bg-muted/20 rounded text-sm">
                <p className="font-medium">Distribution Analysis:</p>
                <p className="text-xs text-muted-foreground">
                  Violin plot shows score distribution patterns across {levelLabels[viewLevel].toLowerCase()}s.
                  Higher density areas indicate more common score ranges.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidate List */}
        {showCandidates && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-admin-sequential-pattern" />
                  <CardTitle>
                    Candidate Information - {selectedTestCenter}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={candidateFilter} onValueChange={(value: FilterType) => setCandidateFilter(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={
                        clickedSegment ? "Flagged Only" : 
                        candidateFilter === "all" ? "All Candidates" :
                        candidateFilter === "flagged" ? "Flagged Only" : "Unflagged Only"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="flagged">Flagged Only</SelectItem>
                      <SelectItem value="unflagged">Unflagged Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="rounded-lg border bg-card">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left p-4 font-semibold text-foreground">Candidate ID</th>
                        <th className="text-left p-4 font-semibold text-foreground">Name</th>
                        <th className="text-left p-4 font-semibold text-foreground">Email</th>
                        <th className="text-left p-4 font-semibold text-foreground">Test Name</th>
                        <th className="text-left p-4 font-semibold text-foreground">Status</th>
                        <th className="text-left p-4 font-semibold text-foreground">Anomaly Score</th>
                        <th className="text-left p-4 font-semibold text-foreground">Anomaly Type</th>
                        <th className="text-left p-4 font-semibold text-foreground">Flag Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredCandidates().map((candidate, index) => (
                        <tr 
                          key={candidate.id} 
                          onClick={() => handleCandidateClick(candidate)}
                          className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                        >
                          <td className="p-4 font-mono text-sm text-muted-foreground">{candidate.id}</td>
                          <td className="p-4 font-medium">{candidate.name}</td>
                          <td className="p-4 text-muted-foreground">{candidate.email}</td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1"
                            >
                              {candidate.testName}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={candidate.status === 'Completed' ? 'default' : 
                                      candidate.status === 'In Progress' ? 'secondary' : 'outline'}
                              className="font-medium"
                            >
                              {candidate.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className={`font-semibold ${candidate.anomalyScore > 0.7 ? 'text-red-500' : 
                                           candidate.anomalyScore > 0.4 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {candidate.anomalyScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={candidate.anomalyType === 'None' ? 'secondary' : 'destructive'}
                              className="font-medium"
                            >
                              {candidate.anomalyType}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {candidate.flagged ? (
                              <div className="flex items-center space-x-2 text-red-500">
                                <Eye className="h-4 w-4" />
                                <span className="font-medium">Flagged</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-green-500">
                                <EyeOff className="h-4 w-4" />
                                <span className="font-medium">Normal</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {getFilteredCandidates().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No candidates found matching the current filter.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Behavioral Pattern Modal */}
        <BehavioralPatternModal 
          candidate={selectedCandidate}
          isOpen={showCandidateCharts}
          onClose={() => setShowCandidateCharts(false)}
        />
      </div>
    </div>
  );
}