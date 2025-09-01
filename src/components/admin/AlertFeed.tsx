import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Bell,
  Clock,
  Eye,
  ExternalLink
} from "lucide-react";

interface Alert {
  id: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  confidence: number;
  candidates?: number;
  actionable: boolean;
}

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      time: '10:42',
      severity: 'critical',
      title: 'Similarity threshold exceeded',
      confidence: 94,
      candidates: 8,
      actionable: true
    },
    {
      id: '2',
      time: '10:40',
      severity: 'high',
      title: 'Rapid answer changes detected',
      confidence: 87,
      candidates: 5,
      actionable: true
    },
    {
      id: '3',
      time: '10:38',
      severity: 'medium',
      title: 'Unusual response pattern',
      confidence: 73,
      candidates: 1,
      actionable: false
    },
    {
      id: '4',
      time: '10:35',
      severity: 'high',
      title: 'Person-fit model violation',
      confidence: 91,
      candidates: 3,
      actionable: true
    },
    {
      id: '5',
      time: '10:33',
      severity: 'low',
      title: 'Minor timing irregularity',
      confidence: 65,
      candidates: 1,
      actionable: false
    },
    {
      id: '6',
      time: '10:30',
      severity: 'critical',
      title: 'Multiple access attempt',
      confidence: 98,
      candidates: 1,
      actionable: true
    },
  ]);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 8 seconds
        const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
        const newAlert: Alert = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: 'New anomaly detected',
          confidence: Math.floor(Math.random() * 40) + 60,
          candidates: Math.floor(Math.random() * 5) + 1,
          actionable: Math.random() > 0.3
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 7)]); // Keep latest 8
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-admin-critical-alert text-white';
      case 'high': return 'bg-admin-answer-revision text-white';
      case 'medium': return 'bg-admin-warning text-black';
      default: return 'bg-admin-info text-black';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-admin-critical-alert';
      case 'high': return 'border-l-admin-answer-revision';
      case 'medium': return 'border-l-admin-warning';
      default: return 'border-l-admin-info';
    }
  };

  const handleAlertClick = (alert: Alert) => {
    // TODO: Open detailed investigation view
    console.log('Opening alert details:', alert);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Alert Feed</span>
          <Badge variant="outline" className="ml-auto text-admin-critical-alert">
            {alerts.filter(a => a.severity === 'critical').length} Critical
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${getSeverityBorder(alert.severity)} bg-card hover:bg-muted/50 transition-colors cursor-pointer`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)} variant="outline">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mb-1">
                      {alert.title}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {alert.confidence}%
                        </span>
                        {alert.candidates && (
                          <span className="text-xs text-muted-foreground">
                            {alert.candidates} candidate{alert.candidates > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      {alert.actionable && (
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}