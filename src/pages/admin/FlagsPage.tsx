import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Flag, 
  Search, 
  Filter, 
  Download,
  Eye,
  AlertTriangle,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface FlaggedItem {
  id: string;
  candidateId: string;
  candidateName: string;
  flagType: 'similarity' | 'timing' | 'pattern' | 'revision' | 'device';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  confidence: number;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  description: string;
}

const mockFlags: FlaggedItem[] = [
  { id: 'F001', candidateId: 'A002', candidateName: 'Emma Johnson', flagType: 'similarity', severity: 'critical', timestamp: '10:42', confidence: 94, status: 'open', description: 'High similarity with 3 other candidates' },
  { id: 'F002', candidateId: 'A005', candidateName: 'David Brown', flagType: 'timing', severity: 'high', timestamp: '10:38', confidence: 87, status: 'investigating', description: 'Consistently fast responses across difficult questions' },
  { id: 'F003', candidateId: 'A003', candidateName: 'Michael Davis', flagType: 'revision', severity: 'medium', timestamp: '10:35', confidence: 73, status: 'resolved', description: 'Multiple wrong-to-right answer changes' },
  { id: 'F004', candidateId: 'A007', candidateName: 'Lisa Garcia', flagType: 'pattern', severity: 'high', timestamp: '10:31', confidence: 91, status: 'open', description: 'Unusual response sequence pattern detected' },
  { id: 'F005', candidateId: 'A009', candidateName: 'James Wilson', flagType: 'device', severity: 'critical', timestamp: '10:28', confidence: 98, status: 'investigating', description: 'Secondary device access detected' },
];

const flagTimelineData = [
  { time: '09:00', flags: 2 },
  { time: '09:30', flags: 5 },
  { time: '10:00', flags: 12 },
  { time: '10:30', flags: 23 },
  { time: '11:00', flags: 18 },
  { time: '11:30', flags: 15 },
];

const flagTypeData = [
  { name: 'Similarity', value: 8, color: '#ef4444' },
  { name: 'Timing', value: 6, color: '#f97316' },
  { name: 'Revision', value: 4, color: '#eab308' },
  { name: 'Pattern', value: 3, color: '#3b82f6' },
  { name: 'Device', value: 2, color: '#8b5cf6' },
];

const severityData = [
  { severity: 'Critical', count: 5, color: '#ef4444' },
  { severity: 'High', count: 8, color: '#f97316' },
  { severity: 'Medium', count: 7, color: '#eab308' },
  { severity: 'Low', count: 3, color: '#22c55e' },
];

export default function FlagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [totalFlags, setTotalFlags] = useState(23);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTotalFlags(prev => prev + 1);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredFlags = mockFlags.filter(flag => {
    const matchesSearch = flag.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || flag.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "all" || flag.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-admin-critical-alert text-white';
      case 'high': return 'bg-admin-answer-revision text-white';
      case 'medium': return 'bg-admin-warning text-black';
      case 'low': return 'bg-admin-normal-safe text-white';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-admin-critical-alert text-white';
      case 'investigating': return 'bg-admin-warning text-black';
      case 'resolved': return 'bg-admin-normal-safe text-white';
      case 'dismissed': return 'bg-muted text-black';
      default: return 'bg-muted';
    }
  };

  const getFlagTypeIcon = (type: string) => {
    switch (type) {
      case 'similarity': return AlertTriangle;
      case 'timing': return Clock;
      case 'revision': return Flag;
      default: return Flag;
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Flag className="h-6 w-6 text-admin-critical-alert" />
              <h1 className="text-2xl font-bold">Security Flags</h1>
              <Badge className="bg-admin-critical-alert text-white">
                {totalFlags} Active
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-critical-alert">{mockFlags.filter(f => f.status === 'open').length}</div>
                <div className="text-sm text-muted-foreground">Open Flags</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-warning">{mockFlags.filter(f => f.status === 'investigating').length}</div>
                <div className="text-sm text-muted-foreground">Investigating</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-normal-safe">{mockFlags.filter(f => f.status === 'resolved').length}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-sequential-pattern">
                  {(mockFlags.reduce((acc, f) => acc + f.confidence, 0) / mockFlags.length).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Flag Timeline (Last 3 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={flagTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="flags" stroke="hsl(var(--admin-critical-alert))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flag Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={flagTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {flagTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Flag List */}
        <Card>
          <CardHeader>
            <CardTitle>Flag Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search flags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select 
                value={selectedSeverity} 
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredFlags.map((flag) => {
                  const IconComponent = getFlagTypeIcon(flag.flagType);
                  return (
                    <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-admin-critical-alert/10">
                          <IconComponent className="h-4 w-4 text-admin-critical-alert" />
                        </div>
                        <div>
                          <p className="font-medium">{flag.candidateName}</p>
                          <p className="text-sm text-muted-foreground">
                            {flag.candidateId} • {flag.flagType} • {flag.timestamp}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-mono">Confidence: {flag.confidence}%</p>
                        </div>
                        
                        <Badge className={getSeverityColor(flag.severity)}>
                          {flag.severity}
                        </Badge>
                        
                        <Badge className={getStatusColor(flag.status)}>
                          {flag.status}
                        </Badge>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {flag.status === 'open' && (
                            <>
                              <Button size="sm" variant="ghost" className="text-admin-normal-safe">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-admin-critical-alert">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}