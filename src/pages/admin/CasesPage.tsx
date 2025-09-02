import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertFeed } from "@/components/admin/AlertFeed";
import { Search, Download, Calendar, Users, Flag, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const mockCases = [
  {
    id: "CASE-001",
    testName: "Mathematics Final Exam",
    date: "2024-01-15",
    duration: "2h 30m",
    totalStudents: 45,
    flaggedStudents: 3,
    status: "Completed",
    flags: ["Suspicious Activity", "Device Switch"],
    testCenter: "Main Campus",
    proctor: "Dr. Sarah Johnson"
  },
  {
    id: "CASE-002", 
    testName: "Physics Midterm",
    date: "2024-01-10",
    duration: "1h 45m",
    totalStudents: 32,
    flaggedStudents: 1,
    status: "Under Review",
    flags: ["Audio Anomaly"],
    testCenter: "Science Building",
    proctor: "Prof. Michael Chen"
  },
  {
    id: "CASE-003",
    testName: "Chemistry Lab Assessment",
    date: "2024-01-08",
    duration: "3h 00m", 
    totalStudents: 28,
    flaggedStudents: 5,
    status: "Resolved",
    flags: ["Multiple Faces", "Screen Share", "Background Noise"],
    testCenter: "Chemistry Lab",
    proctor: "Dr. Emily Davis"
  }
];

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testCenterFilter, setTestCenterFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredCases = mockCases.filter(testCase => {
    const matchesSearch = testCase.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || testCase.status.toLowerCase() === statusFilter;
    const matchesCenter = testCenterFilter === "all" || testCase.testCenter === testCenterFilter;
    
    return matchesSearch && matchesStatus && matchesCenter;
  });

  const handleExport = () => {
    toast.success("Cases data exported successfully");
  };

  const handleViewDetails = (caseId: string) => {
    toast.info(`Opening detailed view for ${caseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <CasesPageContent 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          testCenterFilter={testCenterFilter}
          setTestCenterFilter={setTestCenterFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          filteredCases={filteredCases}
          onExport={handleExport}
          onViewDetails={handleViewDetails}
        />
      </SidebarProvider>
    </div>
  );
};

const CasesPageContent = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  testCenterFilter,
  setTestCenterFilter,
  dateFilter,
  setDateFilter,
  filteredCases,
  onExport,
  onViewDetails
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  testCenterFilter: string;
  setTestCenterFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  filteredCases: any[];
  onExport: () => void;
  onViewDetails: (caseId: string) => void;
}) => {
  return (
    <div className="flex min-h-screen w-full relative">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-56 mr-72 min-w-0">
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Test Cases</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive view of all conducted tests and their forensic data
              </p>
            </div>
            <Button onClick={onExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Cases
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="under review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Center</label>
                  <Select value={testCenterFilter} onValueChange={setTestCenterFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Centers</SelectItem>
                      <SelectItem value="Main Campus">Main Campus</SelectItem>
                      <SelectItem value="Science Building">Science Building</SelectItem>
                      <SelectItem value="Chemistry Lab">Chemistry Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                    <p className="text-2xl font-bold">{filteredCases.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">
                      {filteredCases.reduce((sum, c) => sum + c.totalStudents, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Flagged Students</p>
                    <p className="text-2xl font-bold">
                      {filteredCases.reduce((sum, c) => sum + c.flaggedStudents, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                    <p className="text-2xl font-bold">
                      {filteredCases.filter(c => c.status === "Under Review").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cases Table */}
          <Card>
            <CardHeader>
              <CardTitle>Test Cases Overview</CardTitle>
              <CardDescription>
                Detailed information about all conducted tests and their forensic analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-medium">{testCase.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{testCase.testName}</p>
                          <p className="text-sm text-muted-foreground">{testCase.testCenter}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {testCase.date}
                        </div>
                      </TableCell>
                      <TableCell>{testCase.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{testCase.totalStudents}</span>
                          {testCase.flaggedStudents > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {testCase.flaggedStudents} flagged
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {testCase.flags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            testCase.status === "Completed" ? "default" :
                            testCase.status === "Under Review" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {testCase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewDetails(testCase.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Alert Feed - Fixed right column */}
      <div className="fixed right-0 top-0 w-72 h-full border-l bg-card z-30">
        <AlertFeed />
      </div>
    </div>
  );
};

export default CasesPage;