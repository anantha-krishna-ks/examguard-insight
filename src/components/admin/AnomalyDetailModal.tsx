import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  if (!candidate) return null;

  const isAIPowered = candidate.patternType === "AI-Powered Behaviour Detection";
  const currentMetrics = isAIPowered ? aiPoweredMetrics : biometricMetrics;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Anomaly Details - {candidate.name}</span>
            <Badge variant={candidate.flagged ? "destructive" : "default"}>
              {candidate.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Candidate ID</p>
                <p className="font-medium">{candidate.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Center</p>
                <p className="font-medium">{candidate.testCenter}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Behavioral Score</p>
                <p className="font-medium">{candidate.behavioralScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anomaly Type</p>
                <p className="font-medium">{candidate.patternType}</p>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isAIPowered ? "AI-Powered Behaviour Detection" : "Biometric Continuity Verification"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAIPowered ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gaze Pattern Analysis:</span>
                      <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.gazePatternAnalysis)}`}>
                        {aiPoweredMetrics.gazePatternAnalysis}%
                      </span>
                    </div>
                    <Progress value={aiPoweredMetrics.gazePatternAnalysis} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Micro-Expression Detection:</span>
                      <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.microExpressionDetection)}`}>
                        {aiPoweredMetrics.microExpressionDetection}%
                      </span>
                    </div>
                    <Progress value={aiPoweredMetrics.microExpressionDetection} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Posture and Movement Analysis:</span>
                      <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.postureAndMovementAnalysis)}`}>
                        {aiPoweredMetrics.postureAndMovementAnalysis}%
                      </span>
                    </div>
                    <Progress value={aiPoweredMetrics.postureAndMovementAnalysis} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Environmental Anomaly Detection:</span>
                      <span className={`text-sm font-bold ${getScoreColor(aiPoweredMetrics.environmentalAnomalyDetection)}`}>
                        {aiPoweredMetrics.environmentalAnomalyDetection}%
                      </span>
                    </div>
                    <Progress value={aiPoweredMetrics.environmentalAnomalyDetection} className="h-2" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Continuous Facial Recognition:</span>
                      <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.continuousFacialRecognition)}`}>
                        {biometricMetrics.continuousFacialRecognition}%
                      </span>
                    </div>
                    <Progress value={biometricMetrics.continuousFacialRecognition} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Behavioural Biometric Monitoring:</span>
                      <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.behaviouralBiometricMonitoring)}`}>
                        {biometricMetrics.behaviouralBiometricMonitoring}%
                      </span>
                    </div>
                    <Progress value={biometricMetrics.behaviouralBiometricMonitoring} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Voice Pattern Verification:</span>
                      <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.voicePatternVerification)}`}>
                        {biometricMetrics.voicePatternVerification}%
                      </span>
                    </div>
                    <Progress value={biometricMetrics.voicePatternVerification} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Liveness Detection:</span>
                      <span className={`text-sm font-bold ${getScoreColor(biometricMetrics.livenessDetection)}`}>
                        {biometricMetrics.livenessDetection}%
                      </span>
                    </div>
                    <Progress value={biometricMetrics.livenessDetection} className="h-2" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}