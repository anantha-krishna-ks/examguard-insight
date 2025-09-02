import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Users, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for test centres
const mockTestCentres = [
  {
    id: "TC001",
    name: "Downtown Learning Center",
    location: "New York, NY",
    address: "123 Main St, New York, NY 10001",
    capacity: 150,
    activeTests: 3,
    totalTests: 45,
    status: "active",
    lastActivity: "2024-01-15T10:30:00Z",
    coordinator: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@testcenter.com"
  },
  {
    id: "TC002", 
    name: "Westside Testing Hub",
    location: "Los Angeles, CA",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    capacity: 200,
    activeTests: 5,
    totalTests: 78,
    status: "active",
    lastActivity: "2024-01-15T09:15:00Z",
    coordinator: "Michael Chen",
    phone: "+1 (555) 987-6543",
    email: "michael.chen@testcenter.com"
  },
  {
    id: "TC003",
    name: "Central Examination Center",
    location: "Chicago, IL", 
    address: "789 State St, Chicago, IL 60601",
    capacity: 100,
    activeTests: 1,
    totalTests: 23,
    status: "maintenance",
    lastActivity: "2024-01-14T16:45:00Z",
    coordinator: "Emily Rodriguez",
    phone: "+1 (555) 456-7890",
    email: "emily.rodriguez@testcenter.com"
  },
  {
    id: "TC004",
    name: "North Campus Testing",
    location: "Seattle, WA",
    address: "321 Pine St, Seattle, WA 98101", 
    capacity: 75,
    activeTests: 2,
    totalTests: 34,
    status: "active",
    lastActivity: "2024-01-15T11:20:00Z",
    coordinator: "David Kim",
    phone: "+1 (555) 234-5678",
    email: "david.kim@testcenter.com"
  },
  {
    id: "TC005",
    name: "South Bay Assessment Center",
    location: "San Francisco, CA",
    address: "654 Market St, San Francisco, CA 94102",
    capacity: 120,
    activeTests: 0,
    totalTests: 12,
    status: "inactive",
    lastActivity: "2024-01-10T14:30:00Z",
    coordinator: "Lisa Wang",
    phone: "+1 (555) 345-6789", 
    email: "lisa.wang@testcenter.com"
  }
];

export default function TestCentresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const filteredCentres = mockTestCentres.filter(centre => {
    const matchesSearch = centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || centre.status === statusFilter;
    const matchesLocation = locationFilter === "all" || centre.location.includes(locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "inactive": 
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><Activity className="h-3 w-3 mr-1" />Inactive</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertTriangle className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalCentres = mockTestCentres.length;
  const activeCentres = mockTestCentres.filter(c => c.status === "active").length;
  const totalCapacity = mockTestCentres.reduce((sum, c) => sum + c.capacity, 0);
  const totalActiveTests = mockTestCentres.reduce((sum, c) => sum + c.activeTests, 0);

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Test Centres</h1>
              <p className="text-muted-foreground">Manage and monitor all test centres</p>
            </div>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-admin-sequential-pattern" />
                <span className="text-sm text-muted-foreground">Total Centres</span>
              </div>
              <div className="text-2xl font-bold mt-1">{totalCentres}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Active Centres</span>
              </div>
              <div className="text-2xl font-bold mt-1">{activeCentres}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-admin-response-anomaly" />
                <span className="text-sm text-muted-foreground">Total Capacity</span>
              </div>
              <div className="text-2xl font-bold mt-1">{totalCapacity}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-admin-answer-revision" />
                <span className="text-sm text-muted-foreground">Active Tests</span>
              </div>
              <div className="text-2xl font-bold mt-1">{totalActiveTests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search centres, locations, or coordinators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Test Centres Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Test Centres ({filteredCentres.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Active Tests</TableHead>
                    <TableHead>Total Tests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Coordinator</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCentres.map((centre) => (
                    <TableRow key={centre.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{centre.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{centre.name}</div>
                          <div className="text-sm text-muted-foreground">{centre.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{centre.location}</TableCell>
                      <TableCell>{centre.capacity}</TableCell>
                      <TableCell>
                        <span className="font-medium text-admin-answer-revision">{centre.activeTests}</span>
                      </TableCell>
                      <TableCell>{centre.totalTests}</TableCell>
                      <TableCell>{getStatusBadge(centre.status)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{centre.coordinator}</div>
                          <div className="text-sm text-muted-foreground">{centre.email}</div>
                          <div className="text-sm text-muted-foreground">{centre.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(centre.lastActivity).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(centre.lastActivity).toLocaleTimeString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}