import { useState, useMemo } from "react";
import { Search, Filter, Users, MapPin, Building2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  mockCandidates, 
  mockOrganizations, 
  mockLocations, 
  mockTestCenters,
  type Candidate 
} from "@/data/candidateData";
import { CandidateDetailModal } from "@/components/admin/CandidateDetailModal";

const Candidate360Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedTestCenter, setSelectedTestCenter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOrg = selectedOrganization === "all" || candidate.organization === selectedOrganization;
      const matchesLocation = selectedLocation === "all" || candidate.location === selectedLocation;
      const matchesTestCenter = selectedTestCenter === "all" || candidate.testCenter === selectedTestCenter;
      const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus;

      return matchesSearch && matchesOrg && matchesLocation && matchesTestCenter && matchesStatus;
    });
  }, [searchTerm, selectedOrganization, selectedLocation, selectedTestCenter, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-admin-normal-safe';
      case 'completed': return 'bg-blue-500';
      case 'flagged': return 'bg-admin-warning';
      case 'suspended': return 'bg-admin-critical-alert';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-admin-bg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidate 360</h1>
            <p className="text-muted-foreground">Comprehensive candidate management and analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {filteredCandidates.length} Candidates
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger>
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {mockOrganizations.map(org => (
                    <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {mockLocations.map(loc => (
                    <SelectItem key={loc.id} value={`${loc.city}, ${loc.country}`}>
                      {loc.city}, {loc.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTestCenter} onValueChange={setSelectedTestCenter}>
                <SelectTrigger>
                  <SelectValue placeholder="Test Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Test Centers</SelectItem>
                  {mockTestCenters.map(center => (
                    <SelectItem key={center.id} value={center.name}>{center.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="candidates" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Organizations</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Locations</span>
            </TabsTrigger>
            <TabsTrigger value="testcenters" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Test Centers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map(candidate => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(candidate.status)}`} />
                        <span className="text-xs font-medium">{getStatusText(candidate.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organization:</span>
                        <span className="font-medium">{candidate.organization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{candidate.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Test Center:</span>
                        <span className="font-medium">{candidate.testCenter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tests:</span>
                        <span className="font-medium">{candidate.testsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Score:</span>
                        <span className="font-medium">{candidate.averageScore}%</span>
                      </div>
                      {candidate.suspiciousActivity > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Flags:</span>
                          <Badge variant="destructive" className="text-xs">
                            {candidate.suspiciousActivity}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockOrganizations.map(org => (
                <Card key={org.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{org.name}</span>
                      <Badge variant="outline">{org.industry}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Candidates:</span>
                      <span className="font-medium">{org.candidateCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Tests:</span>
                      <span className="font-medium">{org.testsActive}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Score:</span>
                      <span className="font-medium">{org.averageScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Flagged:</span>
                      <Badge variant={org.flaggedCandidates > 0 ? "destructive" : "default"} className="text-xs">
                        {org.flaggedCandidates}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLocations.map(location => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{location.city}, {location.country}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Candidates:</span>
                      <span className="font-medium">{location.candidateCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Test Centers:</span>
                      <span className="font-medium">{location.testCenters}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Score:</span>
                      <span className="font-medium">{location.averageScore}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testcenters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTestCenters.map(center => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle>{center.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{center.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{center.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Tests:</span>
                      <span className="font-medium">{center.activeTests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Candidates:</span>
                      <span className="font-medium">{center.candidateCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Supervisor:</span>
                      <span className="font-medium">{center.supervisor}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {center.equipment.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default Candidate360Page;