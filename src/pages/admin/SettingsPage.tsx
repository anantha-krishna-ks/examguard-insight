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
        <Card>
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
                Flag candidates based on successive anomalous responses within a time interval.
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
      </div>
    </div>
  );
}