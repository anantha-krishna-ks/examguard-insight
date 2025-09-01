import { useState, useMemo } from "react";
import { Search, Filter, Users, MapPin, Building2, Eye, Clock } from "lucide-react";
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
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50 rounded-xl p-2 shadow-lg min-h-[60px] items-center">
            <TabsTrigger 
              value="candidates" 
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 text-sm h-11"
            >
              <Users className="h-4 w-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="organizations" 
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 text-sm h-11"
            >
              <Building2 className="h-4 w-4" />
              <span>Organizations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 text-sm h-11"
            >
              <MapPin className="h-4 w-4" />
              <span>Locations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="testcenters" 
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 text-sm h-11"
            >
              <Building2 className="h-4 w-4" />
              <span>Test Centers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map(candidate => (
                <Card key={candidate.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  {/* Status indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(candidate.status)}`} />
                  
                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(candidate.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{candidate.email}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              {getStatusText(candidate.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pb-6">
                    {/* Organization & Location */}
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization</span>
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-sm truncate">{candidate.organization}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-md bg-accent/20">
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium text-xs truncate">{candidate.location}</p>
                        </div>
                        <div className="p-2 rounded-md bg-accent/20">
                          <p className="text-xs text-muted-foreground">Test Center</p>
                          <p className="font-medium text-xs truncate">{candidate.testCenter}</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30">
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{candidate.testsCompleted}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tests</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/30">
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">{candidate.averageScore}%</div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">Avg Score</div>
                      </div>
                    </div>

                    {/* Time & Flags */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{candidate.timeSpent}</span>
                      </div>
                      {candidate.suspiciousActivity > 0 && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          {candidate.suspiciousActivity} flags
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Profile
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