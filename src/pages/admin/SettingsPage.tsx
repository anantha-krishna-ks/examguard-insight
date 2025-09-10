import { useState } from "react";
import { ArrowLeft, Save, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface AnomalySettings {
  rapidGuessingThreshold: number;
  itemPreKnowledgeThreshold: number;
  itemHarvestingThreshold: number;
  anomalySuccessiveCount: number;
  anomalyTimeInterval: number;
}

interface BehavioralPatternSettings {
  patternLength: number;
  deviationFromMean: number;
  wrTeRatio: number;
  probabilityOfCorrectness: number;
  answerChangePercentage: number;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AnomalySettings>({
    rapidGuessingThreshold: 5,
    itemPreKnowledgeThreshold: 10,
    itemHarvestingThreshold: 10,
    anomalySuccessiveCount: 5,
    anomalyTimeInterval: 60
  });

  const [behavioralSettings, setBehavioralSettings] = useState<BehavioralPatternSettings>({
    patternLength: 6,
    deviationFromMean: 4,
    wrTeRatio: 0.8,
    probabilityOfCorrectness: 0.9,
    answerChangePercentage: 15
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Anomaly detection settings have been updated successfully.",
    });
  };

  const handleInputChange = (field: keyof AnomalySettings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setSettings(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleBehavioralInputChange = (field: keyof BehavioralPatternSettings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBehavioralSettings(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
          
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <span>Admin Dashboard</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Settings</span>
        </div>

        {/* Response Time-Based Anomalies Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Response Time-Based Anomalies</span>
            </CardTitle>
            <CardDescription>
              Configure thresholds for detecting anomalous behavior patterns in candidate responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rapid Guessing Detection */}
            <div className="space-y-2">
              <Label htmlFor="rapidGuessing" className="text-base font-medium">
                Rapid Guessing Detection
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates who respond in less than the specified time threshold.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="rapidGuessingInput" className="min-w-0 text-sm">
                  Flag responses less than
                </Label>
                <Input
                  id="rapidGuessingInput"
                  type="number"
                  min="1"
                  value={settings.rapidGuessingThreshold}
                  onChange={(e) => handleInputChange('rapidGuessingThreshold', e.target.value)}
                  className="w-20"
                />
                <Label className="text-sm">seconds</Label>
              </div>
            </div>

            <Separator />

            {/* Item Pre-Knowledge */}
            <div className="space-y-2">
              <Label htmlFor="preKnowledge" className="text-base font-medium">
                Item Pre-Knowledge (OS Threshold)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates with OS threshold values below the specified limit.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="preKnowledgeInput" className="min-w-0 text-sm">
                  Flag OS threshold less than
                </Label>
                <Input
                  id="preKnowledgeInput"
                  type="number"
                  min="1"
                  value={settings.itemPreKnowledgeThreshold}
                  onChange={(e) => handleInputChange('itemPreKnowledgeThreshold', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <Separator />

            {/* Item Harvesting */}
            <div className="space-y-2">
              <Label htmlFor="harvesting" className="text-base font-medium">
                Item Harvesting (OS Threshold)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates with OS threshold values above the specified limit.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="harvestingInput" className="min-w-0 text-sm">
                  Flag OS threshold greater than
                </Label>
                <Input
                  id="harvestingInput"
                  type="number"
                  min="1"
                  value={settings.itemHarvestingThreshold}
                  onChange={(e) => handleInputChange('itemHarvestingThreshold', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <Separator />

            {/* Response Time Statistics */}
            <div className="space-y-2">
              <Label htmlFor="responseStats" className="text-base font-medium">
                Response Time Statistics
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates based on anomalous responses within a time interval.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Label htmlFor="successiveCount" className="min-w-0 text-sm">
                    Anomaly response count
                  </Label>
                  <Input
                    id="successiveCount"
                    type="number"
                    min="1"
                    value={settings.anomalySuccessiveCount}
                    onChange={(e) => handleInputChange('anomalySuccessiveCount', e.target.value)}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label htmlFor="timeInterval" className="min-w-0 text-sm">
                    Anomaly time interval (seconds)
                  </Label>
                  <Input
                    id="timeInterval"
                    type="number"
                    min="1"
                    value={settings.anomalyTimeInterval}
                    onChange={(e) => handleInputChange('anomalyTimeInterval', e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Flag candidates when they have {settings.anomalySuccessiveCount} or more anomalous responses within {settings.anomalyTimeInterval} seconds.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Behavioural Pattern Anomaly Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Behavioural Pattern Anomaly</span>
            </CardTitle>
            <CardDescription>
              Configure thresholds for detecting behavioral pattern anomalies in candidate responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sequential Pattern Detection */}
            <div className="space-y-2">
              <Label htmlFor="patternDetection" className="text-base font-medium">
                Sequential Pattern Detection
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Pattern Length - 6 or more consecutive identical answers like A, A, A, A, A OR 6+ cycles of repeating pattern (like A, B, C, D, A, B, C, D)
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="patternLengthInput" className="min-w-0 text-sm">
                  Pattern Length
                </Label>
                <Input
                  id="patternLengthInput"
                  type="number"
                  min="1"
                  value={behavioralSettings.patternLength}
                  onChange={(e) => handleBehavioralInputChange('patternLength', e.target.value)}
                  className="w-20"
                />
                <Label className="text-sm">or more consecutive/cycles</Label>
              </div>
            </div>

            <Separator />

            {/* Deviation from the Mean */}
            <div className="space-y-2">
              <Label htmlFor="deviationMean" className="text-base font-medium">
                Deviation from the Mean
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates whose response patterns deviate significantly from the group mean.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="deviationInput" className="min-w-0 text-sm">
                  Deviation threshold
                </Label>
                <Input
                  id="deviationInput"
                  type="number"
                  min="0"
                  step="0.1"
                  value={behavioralSettings.deviationFromMean}
                  onChange={(e) => handleBehavioralInputChange('deviationFromMean', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <Separator />

            {/* WR/TE Ratio */}
            <div className="space-y-2">
              <Label htmlFor="wrTeRatio" className="text-base font-medium">
                WR/TE Ratio
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Wrong-Right to Time-Extension ratio threshold for detecting anomalous behavior.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="wrTeRatioInput" className="min-w-0 text-sm">
                  WR/TE Ratio threshold
                </Label>
                <Input
                  id="wrTeRatioInput"
                  type="number"
                  min="0"
                  step="0.1"
                  value={behavioralSettings.wrTeRatio}
                  onChange={(e) => handleBehavioralInputChange('wrTeRatio', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <Separator />

            {/* Probability of Correctness */}
            <div className="space-y-2">
              <Label htmlFor="probabilityCorrectness" className="text-base font-medium">
                Probability of Correctness
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates with probability of correctness above the specified threshold.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="probabilityInput" className="min-w-0 text-sm">
                  Probability threshold
                </Label>
                <Input
                  id="probabilityInput"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={behavioralSettings.probabilityOfCorrectness}
                  onChange={(e) => handleBehavioralInputChange('probabilityOfCorrectness', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <Separator />

            {/* Answer Change Percentage */}
            <div className="space-y-2">
              <Label htmlFor="answerChangePercentage" className="text-base font-medium">
                Answer Change Percentage (At the candidate level)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Flag candidates with answer change percentage greater than the specified threshold of attended items.
              </p>
              <div className="flex items-center space-x-3">
                <Label htmlFor="answerChangeInput" className="min-w-0 text-sm">
                  Change percentage greater than
                </Label>
                <Input
                  id="answerChangeInput"
                  type="number"
                  min="0"
                  max="100"
                  value={behavioralSettings.answerChangePercentage}
                  onChange={(e) => handleBehavioralInputChange('answerChangePercentage', e.target.value)}
                  className="w-20"
                />
                <Label className="text-sm">% of attended items</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}