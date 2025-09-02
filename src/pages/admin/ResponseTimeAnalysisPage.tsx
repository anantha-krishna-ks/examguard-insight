import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  Pie
} from "recharts";

// Mock data for bubble chart (organizational data)
const bubbleData = [
  { name: "Excel Soft Technologies Pvt.Ltd", value: 406, fill: "hsl(var(--chart-1))" }
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
        <Button variant="outline" className="flex items-center space-x-2">
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
                  <PieChart>
                    <Pie
                      data={bubbleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="hsl(var(--chart-1))"
                      dataKey="value"
                    />
                    <Tooltip formatter={(value) => [`${value} students`, 'Anomaly Students']} />
                  </PieChart>
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
                          <Button variant="ghost" size="sm">
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
                        <Button variant="link" size="sm" className="text-blue-600">
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="item" 
                      type="number"
                      domain={[0, 25]}
                      label={{ value: 'Item', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="zScore"
                      label={{ value: 'Z-Score', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded shadow">
                              <p>Item: {data.item}</p>
                              <p>Z-Score: {data.zScore}</p>
                              <p>Outliers: {data.actualOutliers}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="zScore">
                      {anomalyOverviewData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isOutlier ? "#ef4444" : "#3b82f6"} 
                        />
                      ))}
                    </Scatter>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="range" 
                      label={{ value: 'Item Response', position: 'insideBottom', offset: -5 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      label={{ value: 'Item Response Frequency', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar dataKey="frequency" fill="hsl(var(--chart-1))" />
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