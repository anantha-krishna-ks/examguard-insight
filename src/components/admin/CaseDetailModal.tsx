import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Flag, MapPin, User, FileText, AlertTriangle } from "lucide-react";

interface CaseDetailModalProps {
  testCase: any;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseDetailModal = ({ testCase, isOpen, onClose }: CaseDetailModalProps) => {
  if (!testCase) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "default";
      case "under review": return "secondary";
      case "resolved": return "outline";
      default: return "destructive";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {testCase.testName} - {testCase.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Test Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={getStatusColor(testCase.status)}>
                    {testCase.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm">{testCase.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {testCase.duration}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Staff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Test Center:</span>
                  <span className="text-sm">{testCase.testCenter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Proctor:</span>
                  <span className="text-sm flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {testCase.proctor}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{testCase.totalStudents}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{testCase.flaggedStudents}</div>
                  <div className="text-sm text-muted-foreground">Flagged Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {testCase.totalStudents - testCase.flaggedStudents}
                  </div>
                  <div className="text-sm text-muted-foreground">Clear Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flags and Issues */}
          {testCase.flags && testCase.flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Detected Issues
                </CardTitle>
                <CardDescription>
                  Flagged behaviors and anomalies detected during the test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {testCase.flags.map((flag: string, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {flag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                  <div className="text-sm text-muted-foreground">
                    {testCase.flaggedStudents === 0 ? (
                      <span className="text-green-600">No security concerns detected. All students completed the test without any flagged behaviors.</span>
                    ) : testCase.flaggedStudents <= 2 ? (
                      <span className="text-yellow-600">Low risk level. Minor anomalies detected but within acceptable parameters.</span>
                    ) : (
                      <span className="text-red-600">High risk level. Multiple security concerns require immediate review.</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="text-sm text-muted-foreground">
                    {testCase.status === "Under Review" ? (
                      "Case requires manual review by security team. Investigate flagged students and validate test integrity."
                    ) : testCase.status === "Resolved" ? (
                      "All issues have been investigated and resolved. Test results validated and finalized."
                    ) : (
                      "Standard post-test review completed. No further action required."
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};