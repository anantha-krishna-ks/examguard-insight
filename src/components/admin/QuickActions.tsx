import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  MessageSquare, 
  Download, 
  AlertTriangle,
  Plus,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();

  const handleCreateCase = () => {
    toast({
      title: "Case Created",
      description: "New investigation case has been created successfully.",
    });
  };

  const handleMessageProctor = () => {
    toast({
      title: "Message Sent",
      description: "Notification sent to active proctors.",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will be ready shortly.",
    });
  };

  const handleEscalateIssue = () => {
    toast({
      title: "Issue Escalated",
      description: "Alert has been escalated to senior administration.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={handleCreateCase}
            className="h-16 flex flex-col items-center justify-center space-y-2 bg-admin-sequential-pattern hover:bg-admin-sequential-pattern/90"
          >
            <FileText className="h-5 w-5" />
            <span className="text-sm">Create Case</span>
          </Button>

          <Button 
            onClick={handleMessageProctor}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-2 border-admin-info text-admin-sequential-pattern hover:bg-admin-info/10"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Message Proctor</span>
          </Button>

          <Button 
            onClick={handleExportReport}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-2 border-admin-normal-safe text-admin-normal-safe hover:bg-admin-normal-safe/10"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Export Report</span>
          </Button>

          <Button 
            onClick={handleEscalateIssue}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-2 border-admin-critical-alert text-admin-critical-alert hover:bg-admin-critical-alert/10"
          >
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">Escalate Issue</span>
          </Button>
        </div>

        <div className="mt-4 p-4 bg-admin-info/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Quick Actions Help:</strong> Use these shortcuts to respond rapidly to security incidents. 
            Create cases for detailed investigations, notify proctors of suspicious activity, 
            export reports for compliance, or escalate critical issues to senior staff.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}