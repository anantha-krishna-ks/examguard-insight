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
  XCircle,
  Shield,
  UserCheck,
  Fingerprint,
  FileCheck,
  Eye,
  Mic,
  Lock,
  Database
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

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not-started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not-started': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
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

            {/* Environmental and Technical Security Baseline Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Environmental and Technical Security Baseline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Device and Network Forensics */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold text-sm">Device and Network Forensics</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Hardware Fingerprinting:</h5>
                      <p className="text-xs text-muted-foreground">Unique device identification through hardware characteristics, screen resolution, installed fonts, and system configurations</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Network Environment Analysis:</h5>
                      <p className="text-xs text-muted-foreground">IP geolocation verification, network infrastructure assessment, and unauthorized connection detection</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Browser and Application Forensics:</h5>
                      <p className="text-xs text-muted-foreground">Security plugin verification, extension detection, and browser integrity assessment</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Virtual Machine and Remote Access Detection:</h5>
                      <p className="text-xs text-muted-foreground">Identification of virtualized environments and remote desktop connections</p>
                    </div>
                  </div>
                </div>

                {/* Security Infrastructure Deployment */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Lock className="h-4 w-4 text-purple-500" />
                    <h4 className="font-semibold text-sm">Security Infrastructure Deployment</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Lockdown Browser Installation Verification:</h5>
                      <p className="text-xs text-muted-foreground">Cryptographic verification of security software integrity and proper configuration</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Monitoring Agent Deployment:</h5>
                      <p className="text-xs text-muted-foreground">Installation of forensic data collection tools with tamper-evident capabilities</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <h5 className="font-medium text-sm mb-2">Baseline Security Scanning:</h5>
                      <p className="text-xs text-muted-foreground">Pre-test malware detection, unauthorized software identification, and system vulnerability</p>
                    </div>
                  </div>
                </div>

                {/* Identity Verification and Authentication */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <UserCheck className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold text-sm">Identity Verification and Authentication</h4>
                    <div className="ml-auto">
                      {getVerificationStatusIcon(candidate.verificationStatuses.identityVerification)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${getVerificationStatusColor(candidate.verificationStatuses.identityVerification)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status: {candidate.verificationStatuses.identityVerification.charAt(0).toUpperCase() + candidate.verificationStatuses.identityVerification.slice(1)}</span>
                      <Badge variant={candidate.verificationStatuses.identityVerification === 'passed' ? 'default' : 'destructive'}>
                        {candidate.verificationStatuses.identityVerification}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Biometric Enrollment Systems */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Fingerprint className="h-4 w-4 text-purple-500" />
                    <h4 className="font-semibold text-sm">Biometric Enrollment Systems</h4>
                    <div className="ml-auto">
                      {getVerificationStatusIcon(candidate.verificationStatuses.biometricEnrollment)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${getVerificationStatusColor(candidate.verificationStatuses.biometricEnrollment)}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Overall Status: {candidate.verificationStatuses.biometricEnrollment.charAt(0).toUpperCase() + candidate.verificationStatuses.biometricEnrollment.slice(1)}</span>
                        <Badge variant={candidate.verificationStatuses.biometricEnrollment === 'passed' ? 'default' : 'destructive'}>
                          {candidate.verificationStatuses.biometricEnrollment}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Eye className="h-3 w-3 text-blue-500" />
                          <span className="text-xs">Facial Recognition Baseline</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.biometricEnrollment === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Fingerprint className="h-3 w-3 text-purple-500" />
                          <span className="text-xs">Keystroke Dynamics</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.biometricEnrollment === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Mic className="h-3 w-3 text-green-500" />
                          <span className="text-xs">Voice Print Registration</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.biometricEnrollment === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Lock className="h-3 w-3 text-orange-500" />
                          <span className="text-xs">Multi-factor Biometric Fusion</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.biometricEnrollment === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Verification and Fraud Detection */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <FileCheck className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-sm">Document Verification and Fraud Detection</h4>
                    <div className="ml-auto">
                      {getVerificationStatusIcon(candidate.verificationStatuses.documentVerification)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${getVerificationStatusColor(candidate.verificationStatuses.documentVerification)}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Overall Status: {candidate.verificationStatuses.documentVerification.charAt(0).toUpperCase() + candidate.verificationStatuses.documentVerification.slice(1)}</span>
                        <Badge variant={candidate.verificationStatuses.documentVerification === 'passed' ? 'default' : 'destructive'}>
                          {candidate.verificationStatuses.documentVerification}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <FileCheck className="h-3 w-3 text-blue-500" />
                          <span className="text-xs">Digital Forensic Document Analysis</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.documentVerification === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Shield className="h-3 w-3 text-purple-500" />
                          <span className="text-xs">Government ID Verification</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.documentVerification === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Database className="h-3 w-3 text-green-500" />
                          <span className="text-xs">Cross-Reference Validation</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.documentVerification === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted/30 border border-border/20 rounded">
                          <Lock className="h-3 w-3 text-orange-500" />
                          <span className="text-xs">Blockchain-based Credential Verification</span>
                          <div className={`w-2 h-2 rounded-full ${candidate.verificationStatuses.documentVerification === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-Test Forensics Summary */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Shield className="h-4 w-4 text-red-500" />
                    <h4 className="font-semibold text-sm">Pre-Test Forensics Summary</h4>
                    <div className="ml-auto">
                      {getVerificationStatusIcon(candidate.verificationStatuses.preTestForensics)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${getVerificationStatusColor(candidate.verificationStatuses.preTestForensics)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Forensics Status: {candidate.verificationStatuses.preTestForensics.charAt(0).toUpperCase() + candidate.verificationStatuses.preTestForensics.slice(1)}</span>
                      <Badge variant={candidate.verificationStatuses.preTestForensics === 'passed' ? 'default' : 'destructive'}>
                        {candidate.verificationStatuses.preTestForensics}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Comprehensive security analysis combining biometric verification, document authentication, and identity validation systems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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