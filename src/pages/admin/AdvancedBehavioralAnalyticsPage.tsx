import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateChartsModal } from "@/components/admin/CandidateChartsModal";
import { AnomalyDetailModal } from "@/components/admin/AnomalyDetailModal";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ViewLevel = 'test' | 'location' | 'testCenter';
type FilterType = 'all' | 'flagged' | 'normal';

// Mock data for different levels
const testLevelData = [
  { name: 'Test 1', aiPowered: 45, biometric: 67 },
  { name: 'Test 2', aiPowered: 32, biometric: 54 },
  { name: 'Test 3', aiPowered: 28, biometric: 41 },
  { name: 'Test 4', aiPowered: 56, biometric: 72 },
  { name: 'Test 5', aiPowered: 78, biometric: 89 },
];

const locationLevelData = [
  { name: 'Location A', aiPowered: 89, biometric: 124 },
  { name: 'Location B', aiPowered: 123, biometric: 167 },
  { name: 'Location C', aiPowered: 67, biometric: 95 },
  { name: 'Location D', aiPowered: 98, biometric: 134 },
];

const testCenterLevelData = [
  { name: 'Center 001', aiPowered: 23, biometric: 31 },
  { name: 'Center 002', aiPowered: 34, biometric: 46 },
  { name: 'Center 003', aiPowered: 45, biometric: 61 },
  { name: 'Center 004', aiPowered: 29, biometric: 39 },
];

const candidateData = [
  { 
    id: 'C001', 
    name: 'John Doe', 
    testCenter: 'Center 001', 
    status: 'Flagged', 
    behavioralScore: 85, 
    patternType: 'AI-Powered Behaviour Detection',
    flagged: true 
  },
  { 
    id: 'C002', 
    name: 'Jane Smith', 
    testCenter: 'Center 001', 
    status: 'Normal', 
    behavioralScore: 45, 
    patternType: 'Biometric Continuity Verification',
    flagged: false 
  },
  { 
    id: 'C003', 
    name: 'Mike Johnson', 
    testCenter: 'Center 002', 
    status: 'Flagged', 
    behavioralScore: 92, 
    patternType: 'AI-Powered Behaviour Detection',
    flagged: true 
  },
  { 
    id: 'C004', 
    name: 'Sarah Wilson', 
    testCenter: 'Center 002', 
    status: 'Normal', 
    behavioralScore: 38, 
    patternType: 'Biometric Continuity Verification',
    flagged: false 
  },
];

export default function AdvancedBehavioralAnalyticsPage() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState<ViewLevel>('test');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);

  const handleLevelChange = (level: ViewLevel) => {
    setCurrentLevel(level);
    setSelectedLocation(null);
    setSelectedTestCenter(null);
    setShowCandidates(false);
  };

  const handleBarClick = (data: any) => {
    if (currentLevel === 'test') {
      setSelectedLocation(data.name);
      setCurrentLevel('location');
    } else if (currentLevel === 'location') {
      setSelectedTestCenter(data.name);
      setCurrentLevel('testCenter');
    } else if (currentLevel === 'testCenter') {
      setShowCandidates(true);
    }
  };

  const getFilteredCandidates = () => {
    switch (candidateFilter) {
      case 'flagged':
        return candidateData.filter(c => c.flagged);
      case 'normal':
        return candidateData.filter(c => !c.flagged);
      default:
        return candidateData;
    }
  };

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowAnomalyModal(true);
  };

  const getCurrentData = () => {
    switch (currentLevel) {
      case 'test':
        return testLevelData;
      case 'location':
        return locationLevelData;
      case 'testCenter':
        return testCenterLevelData;
      default:
        return testLevelData;
    }
  };

  const getCurrentTitle = () => {
    switch (currentLevel) {
      case 'test':
        return 'Advanced Behavioral Analytics - Test Level';
      case 'location':
        return `Advanced Behavioral Analytics - Location Level (${selectedLocation})`;
      case 'testCenter':
        return `Advanced Behavioral Analytics - Test Center Level (${selectedTestCenter})`;
      default:
        return 'Advanced Behavioral Analytics';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold mb-2">{`${currentLevel}: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
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
            <h1 className="text-3xl font-bold">Advanced Behavioral Analytics</h1>
            <p className="text-muted-foreground">
              Hierarchical drill-down analysis at {currentLevel} level
              {selectedLocation && ` - ${selectedLocation}`}
              {selectedTestCenter && ` - ${selectedTestCenter}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-500 border-blue-500">
          AI Analytics
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
          <Tabs value={currentLevel} onValueChange={(value) => handleLevelChange(value as ViewLevel)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="testCenter">Test Center</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="aiPowered" 
                        fill="#3b82f6" 
                        name="AI-Powered Behaviour Detection"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="biometric" 
                        fill="#10b981" 
                        name="Biometric Continuity Verification"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
        </CardContent>
      </Card>

      {showCandidates && currentLevel === 'testCenter' && (
        <Card>
          <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Candidate List - {selectedTestCenter}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <select
                          value={candidateFilter}
                          onChange={(e) => setCandidateFilter(e.target.value as FilterType)}
                          className="border border-border rounded px-2 py-1 text-sm"
                        >
                          <option value="all">All Candidates</option>
                          <option value="flagged">Flagged Only</option>
                          <option value="normal">Normal Only</option>
                        </select>
                      </div>
                    </div>
          </CardHeader>
          <CardContent>
            <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Test Center</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Behavioral Score</TableHead>
                          <TableHead>Anomaly Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredCandidates().map((candidate) => (
                          <TableRow 
                            key={candidate.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleCandidateClick(candidate)}
                          >
                            <TableCell className="font-medium">{candidate.id}</TableCell>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.testCenter}</TableCell>
                            <TableCell>
                              <Badge variant={candidate.flagged ? "destructive" : "default"}>
                                {candidate.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{candidate.behavioralScore}</TableCell>
                            <TableCell>{candidate.patternType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedCandidate && (
        <>
          <CandidateChartsModal
            isOpen={showCandidateModal}
            onClose={() => {
              setShowCandidateModal(false);
              setSelectedCandidate(null);
            }}
            candidate={selectedCandidate}
          />
          <AnomalyDetailModal
            isOpen={showAnomalyModal}
            onClose={() => {
              setShowAnomalyModal(false);
              setSelectedCandidate(null);
            }}
            candidate={selectedCandidate}
          />
        </>
      )}
    </div>
  );
}