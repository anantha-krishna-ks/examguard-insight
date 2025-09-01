import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  AlertTriangle,
  Clock,
  ArrowLeft
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
  Line
} from "recharts";

interface Candidate {
  id: string;
  name: string;
  examRoom: string;
  startTime: string;
  progress: number;
  status: 'active' | 'flagged' | 'completed' | 'suspended';
  alerts: number;
  responseTime: number;
}

const mockCandidates: Candidate[] = [
  { id: 'A001', name: 'John Smith', examRoom: 'Room 101', startTime: '09:00', progress: 75, status: 'active', alerts: 0, responseTime: 45 },
  { id: 'A002', name: 'Emma Johnson', examRoom: 'Room 102', startTime: '09:00', progress: 68, status: 'flagged', alerts: 3, responseTime: 32 },
  { id: 'A003', name: 'Michael Davis', examRoom: 'Room 101', startTime: '09:15', progress: 82, status: 'active', alerts: 1, responseTime: 52 },
  { id: 'A004', name: 'Sarah Wilson', examRoom: 'Room 103', startTime: '09:00', progress: 91, status: 'active', alerts: 0, responseTime: 38 },
  { id: 'A005', name: 'David Brown', examRoom: 'Room 102', startTime: '09:30', progress: 45, status: 'flagged', alerts: 2, responseTime: 25 },
];

const activityData = [
  { time: '09:00', active: 1200 },
  { time: '09:30', active: 1247 },
  { time: '10:00', active: 1251 },
  { time: '10:30', active: 1245 },
  { time: '11:00', active: 1240 },
  { time: '11:30', active: 1235 },
];

const roomData = [
  { room: 'Room 101', count: 45, capacity: 50 },
  { room: 'Room 102', count: 48, capacity: 50 },
  { room: 'Room 103', count: 42, capacity: 50 },
  { room: 'Room 104', count: 50, capacity: 50 },
  { room: 'Room 105', count: 38, capacity: 50 },
];

export default function ActiveCandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeCandidates, setActiveCandidates] = useState(1247);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setActiveCandidates(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-admin-normal-safe';
      case 'flagged': return 'bg-admin-critical-alert';
      case 'completed': return 'bg-admin-sequential-pattern';
      case 'suspended': return 'bg-admin-warning';
      default: return 'bg-muted';
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
              <Users className="h-6 w-6 text-admin-sequential-pattern" />
              <h1 className="text-2xl font-bold">Active Candidates</h1>
              <Badge className="bg-admin-sequential-pattern text-white">
                {activeCandidates.toLocaleString()} Live
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
                <div className="text-2xl font-bold text-admin-sequential-pattern">{activeCandidates.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Active</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-critical-alert">{mockCandidates.filter(c => c.status === 'flagged').length}</div>
                <div className="text-sm text-muted-foreground">Flagged</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-normal-safe">{mockCandidates.filter(c => c.status === 'completed').length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-admin-warning">{mockCandidates.filter(c => c.status === 'suspended').length}</div>
                <div className="text-sm text-muted-foreground">Suspended</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="hsl(var(--admin-sequential-pattern))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roomData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="room" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--admin-sequential-pattern))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="flagged">Flagged</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {candidate.id} • {candidate.examRoom}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">Progress: {candidate.progress}%</p>
                        <p className="text-xs text-muted-foreground">Response: {candidate.responseTime}s avg</p>
                      </div>
                      
                      <Badge className={getStatusColor(candidate.status) + " text-white"}>
                        {candidate.status}
                      </Badge>
                      
                      {candidate.alerts > 0 && (
                        <Badge variant="destructive">
                          {candidate.alerts} alerts
                        </Badge>
                      )}
                      
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}