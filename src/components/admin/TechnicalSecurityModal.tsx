import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Maximize2, FileText, Image, FileSpreadsheet, Shield, Monitor, Lock, Eye } from "lucide-react";

interface TechnicalSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
}

// Mock data for System Integrity Monitoring
const systemIntegrityMetrics = {
  processLevelForensics: 82,
  networkTrafficAnalysis: 75,
  resourceUtilizationMonitoring: 91,
  virtualizationAndSandboxingDetection: 68
};

// Mock data for Content Security and Anti-Harvesting
const contentSecurityMetrics = {
  screenRecordingPrevention: 87,
  watermarkingAndTracking: 73,
  dynamicContentDelivery: 95,
  clipboardAndInputMonitoring: 79
};

export function TechnicalSecurityModal({ isOpen, onClose, candidate }: TechnicalSecurityModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!candidate) return null;

  // Check if it's a System Integrity type
  const systemIntegrityTypes = [
    'Process-Level Forensics',
    'Network Traffic Analysis', 
    'Resource Utilization Monitoring',
    'Virtualization and Sandboxing Detection'
  ];
  
  const isSystemIntegrity = systemIntegrityTypes.includes(candidate.violationType);
  const currentMetrics = isSystemIntegrity ? systemIntegrityMetrics : contentSecurityMetrics;

  const handleExport = (format: string) => {
    const candidateName = candidate?.name?.replace(/\s+/g, '_') || 'candidate';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${candidateName}_security_analysis_${timestamp}`;
    
    switch (format) {
      case 'pdf':
        console.log(`Exporting ${filename}.pdf`);
        break;
      case 'png':
        console.log(`Exporting ${filename}.png`);
        break;
      case 'csv':
        console.log(`Exporting ${filename}.csv`);
        break;
      case 'print':
        window.print();
        break;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-5xl max-h-[90vh]'} overflow-y-auto transition-all duration-300`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Security Analytics
              </DialogTitle>
              <Badge variant="outline" className="text-primary border-primary font-medium">
                {candidate?.name}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {candidate?.id}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('png')}>
                    <Image className="h-4 w-4 mr-2" />
                    Export as Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Data (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('print')}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-2"
              >
                <Maximize2 className="h-4 w-4" />
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </Button>
            </div>
          </div>
          <Separator className="mt-4" />
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{candidate.securityScore}</div>
                <p className="text-xs text-muted-foreground">Security Score</p>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-r ${candidate.flagged ? 'from-red-500/5 to-red-500/10 border-red-500/20' : 'from-green-500/5 to-green-500/10 border-green-500/20'}`}>
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${candidate.flagged ? 'text-red-600' : 'text-green-600'}`}>
                  {candidate.status}
                </div>
                <p className="text-xs text-muted-foreground">Status</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{candidate.testCenter}</div>
                <p className="text-xs text-muted-foreground">Test Center</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{isSystemIntegrity ? 'SIM' : 'CSH'}</div>
                <p className="text-xs text-muted-foreground">Security Type</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Security Analysis */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${isSystemIntegrity ? 'bg-purple-500/10' : 'bg-orange-500/10'}`}>
                    {isSystemIntegrity ? <Monitor className="h-5 w-5 text-purple-500" /> : <Lock className="h-5 w-5 text-orange-500" />}
                  </div>
                  <CardTitle className="text-lg">
                    {isSystemIntegrity ? "System Integrity Monitoring" : "Content Security and Anti-Harvesting"}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {isSystemIntegrity ? "System Monitoring" : "Content Protection"}
                </Badge>
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-semibold mb-1">Security Pattern: {candidate.violationType}</p>
                <p>Security Score: {candidate.securityScore} | Risk Level: {candidate.securityScore >= 80 ? 'High' : candidate.securityScore >= 60 ? 'Medium' : 'Low'}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSystemIntegrity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Monitor className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-sm">System Analysis</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Process-Level Forensics</span>
                          <span className={`text-sm font-bold ${getScoreColor(systemIntegrityMetrics.processLevelForensics)}`}>
                            {systemIntegrityMetrics.processLevelForensics}%
                          </span>
                        </div>
                        <Progress value={systemIntegrityMetrics.processLevelForensics} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Network Traffic Analysis</span>
                          <span className={`text-sm font-bold ${getScoreColor(systemIntegrityMetrics.networkTrafficAnalysis)}`}>
                            {systemIntegrityMetrics.networkTrafficAnalysis}%
                          </span>
                        </div>
                        <Progress value={systemIntegrityMetrics.networkTrafficAnalysis} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Resource Monitoring</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Resource Utilization Monitoring</span>
                          <span className={`text-sm font-bold ${getScoreColor(systemIntegrityMetrics.resourceUtilizationMonitoring)}`}>
                            {systemIntegrityMetrics.resourceUtilizationMonitoring}%
                          </span>
                        </div>
                        <Progress value={systemIntegrityMetrics.resourceUtilizationMonitoring} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 rounded-lg border border-violet-200 dark:border-violet-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Virtualization and Sandboxing Detection</span>
                          <span className={`text-sm font-bold ${getScoreColor(systemIntegrityMetrics.virtualizationAndSandboxingDetection)}`}>
                            {systemIntegrityMetrics.virtualizationAndSandboxingDetection}%
                          </span>
                        </div>
                        <Progress value={systemIntegrityMetrics.virtualizationAndSandboxingDetection} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Eye className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-sm">Content Protection</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Screen Recording Prevention</span>
                          <span className={`text-sm font-bold ${getScoreColor(contentSecurityMetrics.screenRecordingPrevention)}`}>
                            {contentSecurityMetrics.screenRecordingPrevention}%
                          </span>
                        </div>
                        <Progress value={contentSecurityMetrics.screenRecordingPrevention} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Watermarking and Tracking</span>
                          <span className={`text-sm font-bold ${getScoreColor(contentSecurityMetrics.watermarkingAndTracking)}`}>
                            {contentSecurityMetrics.watermarkingAndTracking}%
                          </span>
                        </div>
                        <Progress value={contentSecurityMetrics.watermarkingAndTracking} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lock className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Anti-Harvesting</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Dynamic Content Delivery</span>
                          <span className={`text-sm font-bold ${getScoreColor(contentSecurityMetrics.dynamicContentDelivery)}`}>
                            {contentSecurityMetrics.dynamicContentDelivery}%
                          </span>
                        </div>
                        <Progress value={contentSecurityMetrics.dynamicContentDelivery} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Clipboard and Input Monitoring</span>
                          <span className={`text-sm font-bold ${getScoreColor(contentSecurityMetrics.clipboardAndInputMonitoring)}`}>
                            {contentSecurityMetrics.clipboardAndInputMonitoring}%
                          </span>
                        </div>
                        <Progress value={contentSecurityMetrics.clipboardAndInputMonitoring} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}