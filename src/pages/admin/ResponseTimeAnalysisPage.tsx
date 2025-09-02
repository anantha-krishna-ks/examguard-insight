import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Eye, BarChart3, TrendingUp, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  ReferenceLine
} from "recharts";

// Mock data for bubble chart (organizational data)
const bubbleData = [
  { name: "Excel Soft Technologies Pvt.Ltd", value: 406, x: 50, y: 50, z: 80, fill: "hsl(var(--chart-1))" },
  { name: "Tech Solutions Inc", value: 120, x: 30, y: 70, z: 40, fill: "hsl(var(--chart-2))" },
  { name: "Digital Innovations", value: 250, x: 70, y: 30, z: 60, fill: "hsl(var(--chart-3))" },
  { name: "Software Dynamics", value: 85, x: 25, y: 40, z: 25, fill: "hsl(var(--chart-4))" }
];

// Mock data for organization table
const organizationData = [
  { 
    slNo: 1, 
    organizationName: "Excel Soft Technologies Pvt.Ltd", 
    anomalyStudents: 406 
  }
];

// Mock data for student details table
const studentData = [
  { slNo: 38, studentId: "Student-3713", totalItems: 15, totalAnomalyItems: 1, totalScore: 14 },
  { slNo: 39, studentId: "Student-3715", totalItems: 15, totalAnomalyItems: 7, totalScore: 12 },
  { slNo: 40, studentId: "Student-3718", totalItems: 15, totalAnomalyItems: 3, totalScore: 12 },
  { slNo: 41, studentId: "Student-3719", totalItems: 15, totalAnomalyItems: 2, totalScore: 14 },
  { slNo: 42, studentId: "Student-3720", totalItems: 15, totalAnomalyItems: 8, totalScore: 14 },
  { slNo: 43, studentId: "Student-3721", totalItems: 15, totalAnomalyItems: 1, totalScore: 12 },
  { slNo: 44, studentId: "Student-3729", totalItems: 15, totalAnomalyItems: 2, totalScore: 13 },
];

// Mock data for anomaly items overview (Z-Score scatter plot)
const anomalyOverviewData = [
  { item: 1, zScore: 0.5, actualOutliers: 0, isOutlier: false },
  { item: 2, zScore: 0.7, actualOutliers: 0, isOutlier: false },
  { item: 3, zScore: 0.9, actualOutliers: 0, isOutlier: false },
  { item: 4, zScore: 1.2, actualOutliers: 0, isOutlier: false },
  { item: 5, zScore: 0.8, actualOutliers: 0, isOutlier: false },
  { item: 6, zScore: 2.1, actualOutliers: 1, isOutlier: true }, // Red star - outlier
  { item: 7, zScore: 0.6, actualOutliers: 0, isOutlier: false },
];

// Mock data for item response frequency
const responseFrequencyData = [
  { range: "1-44", frequency: 42 },
  { range: "45-88", frequency: 35 },
  { range: "89-132", frequency: 28 },
  { range: "133-176", frequency: 20 },
  { range: "177-220", frequency: 12 },
  { range: "221-264", frequency: 8 },
  { range: "265-308", frequency: 5 },
  { range: "309-352", frequency: 3 },
  { range: "353-396", frequency: 2 },
  { range: "397-440", frequency: 1 },
];

export default function ResponseTimeAnalysisPage() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState("PoSWHP");
  const [forensicMethod, setForensicMethod] = useState("outlier");
  const [osThreshold, setOsThreshold] = useState("2");
  const [studentGroup, setStudentGroup] = useState("OrganizationName");
  const [selectedStudent, setSelectedStudent] = useState("Student-3611");

  // Button handlers
  const handleExport = () => {
    toast.success("Exporting data to Excel...", {
      description: "Download will begin shortly"
    });
  };

  const handleViewOrganization = (orgName: string) => {
    toast.info(`Viewing details for ${orgName}`, {
      description: "Loading organization analytics..."
    });
  };

  const handleViewStudentGraph = (studentId: string) => {
    setSelectedStudent(studentId);
    toast.info(`Loading graph for ${studentId}`, {
      description: "Analyzing response patterns..."
    });
  };

  // Custom gradient colors for charts
  const gradientId = "colorGradient";
  const barGradientId = "barGradient";
  const scatterGradient1 = "scatterGradient1";
  const scatterGradient2 = "scatterGradient2";
  const bubbleGradient1 = "bubbleGradient1";
  const bubbleGradient2 = "bubbleGradient2";
  const bubbleGradient3 = "bubbleGradient3";
  const bubbleGradient4 = "bubbleGradient4";

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl font-bold">Student Response Latency Analysis</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="flex items-center space-x-2 hover-scale"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Test Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-select" className="text-sm font-medium">Select Test</Label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PoSWHP">PoSWHP</SelectItem>
                  <SelectItem value="Test2">Test 2</SelectItem>
                  <SelectItem value="Test3">Test 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="student-response" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="student-response">Student Response latency</TabsTrigger>
          <TabsTrigger value="response-change">Response Change Statistics</TabsTrigger>
          <TabsTrigger value="answer-similarity">Answer Similarity Analysis</TabsTrigger>
          <TabsTrigger value="person-fit">Person-fit Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="student-response" className="space-y-6">
          {/* Forensic Method and Settings */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Forensic Method:</Label>
                  <RadioGroup value={forensicMethod} onValueChange={setForensicMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outlier" id="outlier" />
                      <Label htmlFor="outlier">Outlier Score</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="response-time" id="response-time" />
                      <Label htmlFor="response-time">Response Time Statistics</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="os-threshold" className="text-sm font-medium">OS Threshold</Label>
                  <Input 
                    id="os-threshold"
                    value={osThreshold} 
                    onChange={(e) => setOsThreshold(e.target.value)}
                    className="w-20"
                  />
                </div>

                <div>
                  <Label htmlFor="student-group" className="text-sm font-medium">Student Group</Label>
                  <Select value={studentGroup} onValueChange={setStudentGroup}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-- Select --">-- Select --</SelectItem>
                      <SelectItem value="OrganizationName">OrganizationName</SelectItem>
                      <SelectItem value="LocationName">LocationName</SelectItem>
                      <SelectItem value="DepartmentName">DepartmentName</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bubble Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Bubble Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={bubbleData}>
                    <defs>
                      <radialGradient id={bubbleGradient1} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#1e40af" stopOpacity={0.5}/>
                      </radialGradient>
                      <radialGradient id={bubbleGradient2} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#10b981" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#047857" stopOpacity={0.5}/>
                      </radialGradient>
                      <radialGradient id={bubbleGradient3} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.5}/>
                      </radialGradient>
                      <radialGradient id={bubbleGradient4} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#f472b6" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#ec4899" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#be185d" stopOpacity={0.5}/>
                      </radialGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--muted))" opacity={0.2} />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      domain={[0, 100]}
                      hide
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      domain={[0, 100]}
                      hide
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-4 border rounded-lg shadow-lg animate-fade-in backdrop-blur-sm">
                              <p className="font-semibold text-sm mb-1">{data.name}</p>
                              <p className="text-muted-foreground text-xs">Anomaly Students: {data.value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="z" className="animate-scale-in">
                      {bubbleData.map((entry, index) => (
                        <Cell 
                          key={`bubble-${index}`} 
                          fill={`url(#bubbleGradient${index + 1})`}
                          stroke={index === 0 ? "#1e40af" : index === 1 ? "#047857" : index === 2 ? "#d97706" : "#be185d"}
                          strokeWidth={2}
                          className="hover:opacity-80 transition-opacity duration-200"
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Organization Table */}
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl No.</TableHead>
                      <TableHead>OrganizationName</TableHead>
                      <TableHead>Anomaly Students</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationData.map((org) => (
                      <TableRow key={org.slNo}>
                        <TableCell>{org.slNo}</TableCell>
                        <TableCell>{org.organizationName}</TableCell>
                        <TableCell>{org.anomalyStudents}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewOrganization(org.organizationName)}
                            className="hover-scale"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Selected Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Selected: Excel Soft Technologies Pvt.Ltd</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl No.</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Total Anomaly Items</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentData.map((student) => (
                    <TableRow key={student.slNo}>
                      <TableCell>{student.slNo}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.totalItems}</TableCell>
                      <TableCell>{student.totalAnomalyItems}</TableCell>
                      <TableCell>{student.totalScore}</TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleViewStudentGraph(student.studentId)}
                          className="text-primary hover-scale story-link"
                        >
                          view graph
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Selected Student Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anomaly Items Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Student: {selectedStudent}</CardTitle>
                <p className="text-sm text-muted-foreground">Anomaly Items Overview</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Z-Score</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <span className="text-sm">Actual Outliers</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={anomalyOverviewData}>
                    <defs>
                      <radialGradient id={scatterGradient1} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      </radialGradient>
                      <radialGradient id={scatterGradient2} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.9}/>
                      </radialGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="item" 
                      type="number"
                      domain={[0, 25]}
                      label={{ value: 'Item', position: 'insideBottom', offset: -5 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      dataKey="zScore"
                      label={{ value: 'Z-Score', angle: -90, position: 'insideLeft' }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded-lg shadow-lg animate-fade-in">
                              <p className="font-medium">Item: {data.item}</p>
                              <p>Z-Score: {data.zScore}</p>
                              <p>Outliers: {data.actualOutliers}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="zScore" className="animate-scale-in">
                      {anomalyOverviewData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isOutlier ? `url(#${scatterGradient2})` : `url(#${scatterGradient1})`} 
                        />
                      ))}
                    </Scatter>
                    <ReferenceLine y={2} stroke="#fbbf24" strokeDasharray="5 5" opacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Item Response Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Item Response Frequency</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Item No.: 6, Item Response Time (Sec): 395, Item Percentile(%): 99.96, Outlier Score: &gt;20.00
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400"></div>
                    <span className="text-sm">Bar Dataset</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-red-500"></div>
                    <span className="text-sm">Marker</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={responseFrequencyData}>
                    <defs>
                      <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="range" 
                      label={{ value: 'Item Response', position: 'insideBottom', offset: -5 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      label={{ value: 'Item Response Frequency', angle: -90, position: 'insideLeft' }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="frequency" 
                      fill={`url(#${barGradientId})`}
                      className="animate-fade-in"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="response-change">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Response Change Statistics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answer-similarity">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Answer Similarity Analysis content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="person-fit">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Person-fit Statistics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}