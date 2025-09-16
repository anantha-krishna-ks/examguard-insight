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
  { name: 'Test 1', captured: 234, processed: 189, analyzed: 167 },
  { name: 'Test 2', captured: 298, processed: 256, analyzed: 221 },
  { name: 'Test 3', captured: 156, processed: 134, analyzed: 118 },
  { name: 'Test 4', captured: 367, processed: 298, analyzed: 254 },
  { name: 'Test 5', captured: 423, processed: 356, analyzed: 312 },
];

const locationLevelData = [
  { name: 'Location A', captured: 567, processed: 489, analyzed: 423 },
  { name: 'Location B', captured: 734, processed: 623, analyzed: 556 },
  { name: 'Location C', captured: 445, processed: 378, analyzed: 334 },
  { name: 'Location D', captured: 623, processed: 534, analyzed: 467 },
];

const testCenterLevelData = [
  { name: 'Center 001', captured: 134, processed: 112, analyzed: 98 },
  { name: 'Center 002', captured: 189, processed: 156, analyzed: 134 },
  { name: 'Center 003', captured: 223, processed: 189, analyzed: 167 },
  { name: 'Center 004', captured: 167, processed: 143, analyzed: 123 },
];

const candidateData = [
  { 
    id: 'C001', 
    name: 'John Doe', 
    testCenter: 'Center 001', 
    status: 'Flagged', 
    dataQuality: 89, 
    modalitiesUsed: 'Audio, Video, Screen',
    flagged: true 
  },
  { 
    id: 'C002', 
    name: 'Jane Smith', 
    testCenter: 'Center 001', 
    status: 'Normal', 
    dataQuality: 95, 
    modalitiesUsed: 'Audio, Screen',
    flagged: false 
  },
  { 
    id: 'C003', 
    name: 'Mike Johnson', 
    testCenter: 'Center 002', 
    status: 'Flagged', 
    dataQuality: 67, 
    modalitiesUsed: 'Video, Screen',
    flagged: true 
  },
  { 
    id: 'C004', 
    name: 'Sarah Wilson', 
    testCenter: 'Center 002', 
    status: 'Normal', 
    dataQuality: 92, 
    modalitiesUsed: 'Audio, Video, Screen',
    flagged: false 
  },
];

export default function MultiModalDataCapturePage() {
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
        return 'Multi-Modal Data Capture - Test Level';
      case 'location':
        return `Multi-Modal Data Capture - Location Level (${selectedLocation})`;
      case 'testCenter':
        return `Multi-Modal Data Capture - Test Center Level (${selectedTestCenter})`;
      default:
        return 'Multi-Modal Data Capture';
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
            <h1 className="text-3xl font-bold">Multi-Modal Data Capture</h1>
            <p className="text-muted-foreground">
              Hierarchical drill-down analysis at {currentLevel} level
              {selectedLocation && ` - ${selectedLocation}`}
              {selectedTestCenter && ` - ${selectedTestCenter}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-500 border-green-500">
          Data AI
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
                  <CardTitle>Multi-Modal Data Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="captured" 
                        fill="#059669" 
                        name="Captured"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="processed" 
                        fill="#0d9488" 
                        name="Processed"
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="analyzed" 
                        fill="#0891b2" 
                        name="Analyzed"
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
                          <TableHead>Data Quality</TableHead>
                          <TableHead>Modalities Used</TableHead>
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
                            <TableCell>{candidate.dataQuality}%</TableCell>
                            <TableCell>{candidate.modalitiesUsed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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