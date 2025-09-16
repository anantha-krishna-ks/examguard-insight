import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateChartsModal } from "@/components/admin/CandidateChartsModal";
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
  { name: 'Test 1', alerts: 89, violations: 34, resolved: 28 },
  { name: 'Test 2', alerts: 156, violations: 67, resolved: 52 },
  { name: 'Test 3', alerts: 72, violations: 27, resolved: 22 },
  { name: 'Test 4', alerts: 134, violations: 56, resolved: 43 },
  { name: 'Test 5', alerts: 198, violations: 78, resolved: 65 },
];

const locationLevelData = [
  { name: 'Location A', alerts: 234, violations: 89, resolved: 72 },
  { name: 'Location B', alerts: 189, violations: 134, resolved: 98 },
  { name: 'Location C', alerts: 156, violations: 67, resolved: 54 },
  { name: 'Location D', alerts: 298, violations: 123, resolved: 89 },
];

const testCenterLevelData = [
  { name: 'Center 001', alerts: 67, violations: 23, resolved: 18 },
  { name: 'Center 002', alerts: 89, violations: 34, resolved: 27 },
  { name: 'Center 003', alerts: 123, violations: 45, resolved: 38 },
  { name: 'Center 004', alerts: 78, violations: 29, resolved: 24 },
];

const candidateData = [
  { 
    id: 'C001', 
    name: 'John Doe', 
    testCenter: 'Center 001', 
    status: 'Flagged', 
    securityScore: 78, 
    violationType: 'Content Protection',
    flagged: true 
  },
  { 
    id: 'C002', 
    name: 'Jane Smith', 
    testCenter: 'Center 001', 
    status: 'Normal', 
    securityScore: 23, 
    violationType: 'None',
    flagged: false 
  },
  { 
    id: 'C003', 
    name: 'Mike Johnson', 
    testCenter: 'Center 002', 
    status: 'Flagged', 
    securityScore: 89, 
    violationType: 'Technical Security',
    flagged: true 
  },
  { 
    id: 'C004', 
    name: 'Sarah Wilson', 
    testCenter: 'Center 002', 
    status: 'Normal', 
    securityScore: 15, 
    violationType: 'None',
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
    setShowCandidateModal(true);
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
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-3xl font-bold">{getCurrentTitle()}</h1>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={currentLevel} onValueChange={(value) => handleLevelChange(value as ViewLevel)}>
            <TabsList className="grid grid-cols-3 w-96">
              <TabsTrigger value="test">Test Level</TabsTrigger>
              <TabsTrigger value="location">Location Level</TabsTrigger>
              <TabsTrigger value="testCenter">Test Center Level</TabsTrigger>
            </TabsList>

            <TabsContent value={currentLevel} className="space-y-6">
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
                        dataKey="alerts" 
                        fill="#8b5cf6" 
                        name="Alerts"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="violations" 
                        fill="#f59e0b" 
                        name="Violations"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="resolved" 
                        fill="#10b981" 
                        name="Resolved"
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
                          <TableHead>Violation Type</TableHead>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateChartsModal
          isOpen={showCandidateModal}
          onClose={() => {
            setShowCandidateModal(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
}