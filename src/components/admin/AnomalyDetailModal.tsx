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
import { Download, Printer, Maximize2, FileText, Image, FileSpreadsheet, Eye, Brain, Shield } from "lucide-react";

interface AnomalyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
}

// Mock data for AI-Powered Behaviour Detection
const aiPoweredMetrics = {
  gazePatternAnalysis: 78,
  microExpressionDetection: 65,
  postureAndMovementAnalysis: 82,
  environmentalAnomalyDetection: 71
};

// Mock data for Biometric Continuity Verification
const biometricMetrics = {
  continuousFacialRecognition: 89,
  behaviouralBiometricMonitoring: 76,
  voicePatternVerification: 83,
  livenessDetection: 91
};

export function AnomalyDetailModal({ isOpen, onClose, candidate }: AnomalyDetailModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  if (!candidate) return null;

  const isAIPowered = candidate.patternType === "AI-Powered Behaviour Detection";
  const currentMetrics = isAIPowered ? aiPoweredMetrics : biometricMetrics;

  const handleExport = (format: string) => {
    const candidateName = candidate?.name?.replace(/\s+/g, '_') || 'candidate';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${candidateName}_anomaly_analysis_${timestamp}`;
    
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

  const getProgressVariant = (score: number) => {
    if (score >= 80) return "destructive";
    if (score >= 60) return "default";
    return "default";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-5xl max-h-[90vh]'} overflow-y-auto transition-all duration-300`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Anomaly Analytics
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
                <div className="text-2xl font-bold text-primary">{candidate.behavioralScore}</div>
                <p className="text-xs text-muted-foreground">Behavioral Score</p>
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
                <div className="text-2xl font-bold text-purple-600">{isAIPowered ? 'AI' : 'Bio'}</div>
                <p className="text-xs text-muted-foreground">Detection Type</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Anomaly Analysis */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${isAIPowered ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                    {isAIPowered ? <Brain className="h-5 w-5 text-blue-500" /> : <Shield className="h-5 w-5 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">
                    {isAIPowered ? "AI-Powered Behaviour Detection" : "Biometric Continuity Verification"}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {isAIPowered ? "AI Analysis" : "Biometric Verification"}
                </Badge>
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-semibold mb-1">Anomaly Pattern: {candidate.patternType}</p>
                <p>Behavioral Score: {candidate.behavioralScore} | Risk Level: {candidate.behavioralScore >= 80 ? 'High' : candidate.behavioralScore >= 60 ? 'Medium' : 'Low'}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAIPowered ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Visual Analysis</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Gaze Pattern Analysis</span>
                          <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.gazePatternAnalysis)}`}>
                            {aiPoweredMetrics.gazePatternAnalysis}%
                          </span>
                        </div>
                        <Progress value={aiPoweredMetrics.gazePatternAnalysis} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Micro-Expression Detection</span>
                          <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.microExpressionDetection)}`}>
                            {aiPoweredMetrics.microExpressionDetection}%
                          </span>
                        </div>
                        <Progress value={aiPoweredMetrics.microExpressionDetection} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-sm">Behavioral Analysis</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Posture and Movement Analysis</span>
                          <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.postureAndMovementAnalysis)}`}>
                            {aiPoweredMetrics.postureAndMovementAnalysis}%
                          </span>
                        </div>
                        <Progress value={aiPoweredMetrics.postureAndMovementAnalysis} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Environmental Anomaly Detection</span>
                          <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.environmentalAnomalyDetection)}`}>
                            {aiPoweredMetrics.environmentalAnomalyDetection}%
                          </span>
                        </div>
                        <Progress value={aiPoweredMetrics.environmentalAnomalyDetection} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Identity Verification</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Continuous Facial Recognition</span>
                          <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.continuousFacialRecognition)}`}>
                            {biometricMetrics.continuousFacialRecognition}%
                          </span>
                        </div>
                        <Progress value={biometricMetrics.continuousFacialRecognition} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Behavioural Biometric Monitoring</span>
                          <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.behaviouralBiometricMonitoring)}`}>
                            {biometricMetrics.behaviouralBiometricMonitoring}%
                          </span>
                        </div>
                        <Progress value={biometricMetrics.behaviouralBiometricMonitoring} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Audio & Visual Checks</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 rounded-lg border border-cyan-200 dark:border-cyan-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Voice Pattern Verification</span>
                          <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.voicePatternVerification)}`}>
                            {biometricMetrics.voicePatternVerification}%
                          </span>
                        </div>
                        <Progress value={biometricMetrics.voicePatternVerification} className="h-2" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Liveness Detection</span>
                          <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.livenessDetection)}`}>
                            {biometricMetrics.livenessDetection}%
                          </span>
                        </div>
                        <Progress value={biometricMetrics.livenessDetection} className="h-2" />
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