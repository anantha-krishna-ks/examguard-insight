import { useState } from "react";
import { ArrowLeft, Save, Settings, Clock, Brain, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-5xl">
        {/* Header Section */}
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="flex items-center space-x-2 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                  <p className="text-muted-foreground">Configure anomaly detection parameters</p>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSave} className="flex items-center space-x-2 shadow-md">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground">
            <span>Admin Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Settings</span>
          </div>
        </div>

        {/* Settings Accordion */}
        <Card className="shadow-md border-0 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              <span>Anomaly Detection Configuration</span>
            </CardTitle>
            <CardDescription className="text-base">
              Configure detection parameters for identifying suspicious candidate behavior patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={["response-time", "behavioral-pattern"]}>
              
              {/* Response Time-Based Anomalies */}
              <AccordionItem value="response-time" className="border rounded-lg px-6 py-2 bg-background/50">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Response Time-Based Anomalies</h3>
                      <p className="text-sm text-muted-foreground">Configure thresholds for detecting time-based anomalies</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 space-y-6">
                  {/* Rapid Guessing Detection */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="rapidGuessing" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Rapid Guessing Detection</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates who respond in less than the specified time threshold.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="rapidGuessingInput" className="min-w-0 text-sm font-medium">
                        Flag responses less than
                      </Label>
                      <Input
                        id="rapidGuessingInput"
                        type="number"
                        min="1"
                        value={settings.rapidGuessingThreshold}
                        onChange={(e) => handleInputChange('rapidGuessingThreshold', e.target.value)}
                        className="w-20 text-center"
                      />
                      <Label className="text-sm font-medium">seconds</Label>
                    </div>
                  </div>

                  {/* Item Pre-Knowledge */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="preKnowledge" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Item Pre-Knowledge (OS Threshold)</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates with OS threshold values below the specified limit.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="preKnowledgeInput" className="min-w-0 text-sm font-medium">
                        Flag OS threshold less than
                      </Label>
                      <Input
                        id="preKnowledgeInput"
                        type="number"
                        min="1"
                        value={settings.itemPreKnowledgeThreshold}
                        onChange={(e) => handleInputChange('itemPreKnowledgeThreshold', e.target.value)}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* Item Harvesting */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="harvesting" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Item Harvesting (OS Threshold)</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates with OS threshold values above the specified limit.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="harvestingInput" className="min-w-0 text-sm font-medium">
                        Flag OS threshold greater than
                      </Label>
                      <Input
                        id="harvestingInput"
                        type="number"
                        min="1"
                        value={settings.itemHarvestingThreshold}
                        onChange={(e) => handleInputChange('itemHarvestingThreshold', e.target.value)}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* Response Time Statistics */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="responseStats" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Response Time Statistics</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates based on anomalous responses within a time interval.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                        <Label htmlFor="successiveCount" className="min-w-0 text-sm font-medium">
                          Anomaly response count
                        </Label>
                        <Input
                          id="successiveCount"
                          type="number"
                          min="1"
                          value={settings.anomalySuccessiveCount}
                          onChange={(e) => handleInputChange('anomalySuccessiveCount', e.target.value)}
                          className="w-20 text-center"
                        />
                      </div>
                      <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                        <Label htmlFor="timeInterval" className="min-w-0 text-sm font-medium">
                          Time interval (seconds)
                        </Label>
                        <Input
                          id="timeInterval"
                          type="number"
                          min="1"
                          value={settings.anomalyTimeInterval}
                          onChange={(e) => handleInputChange('anomalyTimeInterval', e.target.value)}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-md border-l-4 border-primary/30">
                      <strong>Rule:</strong> Flag candidates when they have {settings.anomalySuccessiveCount} or more anomalous responses within {settings.anomalyTimeInterval} seconds.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Behavioural Pattern Anomaly */}
              <AccordionItem value="behavioral-pattern" className="border rounded-lg px-6 py-2 bg-background/50">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Behavioural Pattern Anomaly</h3>
                      <p className="text-sm text-muted-foreground">Configure thresholds for detecting behavioral patterns</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 space-y-6">
                  {/* Sequential Pattern Detection */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="patternDetection" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Sequential Pattern Detection</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Pattern Length - 6 or more consecutive identical answers like A, A, A, A, A OR 6+ cycles of repeating pattern (like A, B, C, D, A, B, C, D)
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="patternLengthInput" className="min-w-0 text-sm font-medium">
                        Pattern Length
                      </Label>
                      <Input
                        id="patternLengthInput"
                        type="number"
                        min="1"
                        value={behavioralSettings.patternLength}
                        onChange={(e) => handleBehavioralInputChange('patternLength', e.target.value)}
                        className="w-20 text-center"
                      />
                      <Label className="text-sm font-medium">or more consecutive/cycles</Label>
                    </div>
                  </div>

                  {/* Deviation from the Mean */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="deviationMean" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Deviation from the Mean</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates whose response patterns deviate significantly from the group mean.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="deviationInput" className="min-w-0 text-sm font-medium">
                        Deviation threshold
                      </Label>
                      <Input
                        id="deviationInput"
                        type="number"
                        min="0"
                        step="0.1"
                        value={behavioralSettings.deviationFromMean}
                        onChange={(e) => handleBehavioralInputChange('deviationFromMean', e.target.value)}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* WR/TE Ratio */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="wrTeRatio" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>WR/TE Ratio</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Wrong-Right to Time-Extension ratio threshold for detecting anomalous behavior.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="wrTeRatioInput" className="min-w-0 text-sm font-medium">
                        WR/TE Ratio threshold
                      </Label>
                      <Input
                        id="wrTeRatioInput"
                        type="number"
                        min="0"
                        step="0.1"
                        value={behavioralSettings.wrTeRatio}
                        onChange={(e) => handleBehavioralInputChange('wrTeRatio', e.target.value)}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* Probability of Correctness */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="probabilityCorrectness" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Probability of Correctness</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates with probability of correctness above the specified threshold.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="probabilityInput" className="min-w-0 text-sm font-medium">
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
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* Answer Change Percentage */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label htmlFor="answerChangePercentage" className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Answer Change Percentage (At the candidate level)</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Flag candidates with answer change percentage greater than the specified threshold of attended items.
                    </p>
                    <div className="flex items-center space-x-3 bg-background p-3 rounded-md">
                      <Label htmlFor="answerChangeInput" className="min-w-0 text-sm font-medium">
                        Change percentage greater than
                      </Label>
                      <Input
                        id="answerChangeInput"
                        type="number"
                        min="0"
                        max="100"
                        value={behavioralSettings.answerChangePercentage}
                        onChange={(e) => handleBehavioralInputChange('answerChangePercentage', e.target.value)}
                        className="w-20 text-center"
                      />
                      <Label className="text-sm font-medium">% of attended items</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}