import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateChartsModal } from "@/components/admin/CandidateChartsModal";
import { TechnicalSecurityModal } from "@/components/admin/TechnicalSecurityModal";
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
  { name: 'Test 1', systemIntegrity: 89, contentSecurity: 56, sessionRecording: 72 },
  { name: 'Test 2', systemIntegrity: 67, contentSecurity: 43, sessionRecording: 58 },
  { name: 'Test 3', systemIntegrity: 82, contentSecurity: 61, sessionRecording: 49 },
  { name: 'Test 4', systemIntegrity: 134, contentSecurity: 78, sessionRecording: 91 },
  { name: 'Test 5', systemIntegrity: 198, contentSecurity: 112, sessionRecording: 156 },
];

const locationLevelData = [
  { name: 'Location A', systemIntegrity: 234, contentSecurity: 134, sessionRecording: 189 },
  { name: 'Location B', systemIntegrity: 189, contentSecurity: 98, sessionRecording: 156 },
  { name: 'Location C', systemIntegrity: 156, contentSecurity: 87, sessionRecording: 123 },
  { name: 'Location D', systemIntegrity: 298, contentSecurity: 167, sessionRecording: 234 },
];

const testCenterLevelData = [
  { name: 'Center 001', systemIntegrity: 67, contentSecurity: 34, sessionRecording: 45 },
  { name: 'Center 002', systemIntegrity: 89, contentSecurity: 45, sessionRecording: 67 },
  { name: 'Center 003', systemIntegrity: 123, contentSecurity: 67, sessionRecording: 89 },
  { name: 'Center 004', systemIntegrity: 78, contentSecurity: 42, sessionRecording: 56 },
];

const candidateData = [
  { 
    id: 'C001', 
    name: 'John Doe', 
    testCenter: 'Center 001', 
    status: 'Flagged', 
    securityScore: 78, 
    violationType: 'System Integrity Monitoring',
    flagged: true 
  },
  { 
    id: 'C002', 
    name: 'Jane Smith', 
    testCenter: 'Center 001', 
    status: 'Normal', 
    securityScore: 23, 
    violationType: 'Content Security and Anti-Harvesting',
    flagged: false 
  },
  { 
    id: 'C003', 
    name: 'Mike Johnson', 
    testCenter: 'Center 002', 
    status: 'Flagged', 
    securityScore: 89, 
    violationType: 'System Integrity Monitoring',
    flagged: true 
  },
  { 
    id: 'C004', 
    name: 'Sarah Wilson', 
    testCenter: 'Center 002', 
    status: 'Normal', 
    securityScore: 15, 
    violationType: 'Content Security and Anti-Harvesting',
    flagged: false 
  },
];

export default function TechnicalSecurityPage() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState<ViewLevel>('test');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTestCenter, setSelectedTestCenter] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState<FilterType>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

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
    setShowSecurityModal(true);
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
        return 'Technical Security and Content Protection - Test Level';
      case 'location':
        return `Technical Security and Content Protection - Location Level (${selectedLocation})`;
      case 'testCenter':
        return `Technical Security and Content Protection - Test Center Level (${selectedTestCenter})`;
      default:
        return 'Technical Security and Content Protection';
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
            <h1 className="text-3xl font-bold">Technical Security and Content Protection</h1>
            <p className="text-muted-foreground">
              Hierarchical drill-down analysis at {currentLevel} level
              {selectedLocation && ` - ${selectedLocation}`}
              {selectedTestCenter && ` - ${selectedTestCenter}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-500 border-purple-500">
          Security AI
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
                  <CardTitle>Security Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="systemIntegrity" 
                        fill="#8b5cf6" 
                        name="System Integrity Monitoring"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="contentSecurity" 
                        fill="#f59e0b" 
                        name="Content Security and Anti-Harvesting"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="sessionRecording" 
                        fill="#10b981" 
                        name="Session Recording and Documentation"
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
                          <TableHead>Security Score</TableHead>
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
                            <TableCell>{candidate.securityScore}</TableCell>
                            <TableCell>{candidate.violationType}</TableCell>
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
          <TechnicalSecurityModal
            isOpen={showSecurityModal}
            onClose={() => {
              setShowSecurityModal(false);
              setSelectedCandidate(null);
            }}
            candidate={selectedCandidate}
          />
        </>
      )}
    </div>
  );
}