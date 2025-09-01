import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { type Candidate } from "@/data/candidateData";

interface CandidateDetailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateDetailModal = ({ candidate, isOpen, onClose }: CandidateDetailModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-admin-normal-safe';
      case 'completed': return 'bg-blue-500';
      case 'flagged': return 'bg-admin-warning';
      case 'suspended': return 'bg-admin-critical-alert';
      default: return 'bg-gray-500';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'incomplete': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{candidate.name}</span>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(candidate.status)}`} />
                <span className="text-sm font-normal text-muted-foreground">
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test History</TabsTrigger>
            <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{candidate.email}</p>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{candidate.phone}</p>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{formatDate(candidate.joinDate)}</p>
                      <p className="text-xs text-muted-foreground">Join Date</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Professional Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{candidate.organization}</p>
                    <p className="text-xs text-muted-foreground">Organization</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{candidate.department}</p>
                    <p className="text-xs text-muted-foreground">Department</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{candidate.position}</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{candidate.location}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Center Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Test Center</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm font-medium">{candidate.testCenter}</p>
                    <p className="text-xs text-muted-foreground">Current Test Center</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tests Completed:</span>
                    <span className="text-sm font-medium">{candidate.testsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Score:</span>
                    <span className="text-sm font-medium">{candidate.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Time:</span>
                    <span className="text-sm font-medium">{candidate.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Suspicious Activities:</span>
                    <Badge variant={candidate.suspiciousActivity > 0 ? "destructive" : "default"}>
                      {candidate.suspiciousActivity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Activity:</span>
                    <span className="text-sm font-medium">{formatDate(candidate.lastActivity)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-3">
              {candidate.testHistory.map(test => (
                <Card key={test.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTestStatusIcon(test.status)}
                        <div>
                          <h4 className="font-medium">{test.testName}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(test.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{test.score}%</div>
                        <div className="text-sm text-muted-foreground">{test.duration}</div>
                      </div>
                    </div>
                    {test.flags.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Flags:</p>
                        <div className="flex flex-wrap gap-1">
                          {test.flags.map((flag, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-admin-normal-safe rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Last Login</p>
                      <p className="text-xs text-muted-foreground">{formatDate(candidate.lastActivity)}</p>
                    </div>
                  </div>
                  {candidate.testHistory.slice(0, 3).map(test => (
                    <div key={test.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        test.status === 'completed' ? 'bg-admin-normal-safe' : 'bg-admin-warning'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium">Completed {test.testName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(test.date)} • Score: {test.score}%</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-xs text-muted-foreground">{formatDate(candidate.joinDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};