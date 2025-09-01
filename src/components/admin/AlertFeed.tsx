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
  ExternalLink,
  User,
  X,
  Minimize2,
  Maximize2,
  Settings
} from "lucide-react";

interface Alert {
  id: string;
  candidateId: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  confidence: number;
  candidates?: number;
  actionable: boolean;
  section?: string;
}

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'C-37435',
      candidateId: 'A002',
      time: '15:36',
      severity: 'high',
      title: 'Response time variation in section 3',
      confidence: 83,
      actionable: true,
      section: 'Section 3'
    },
    {
      id: 'C-85986',
      candidateId: 'A005',
      time: '15:36',
      severity: 'medium',
      title: 'Response time variation in section 3',
      confidence: 61,
      actionable: true,
      section: 'Section 3'
    },
    {
      id: 'C-6464',
      candidateId: 'A003',
      time: '15:35',
      severity: 'medium',
      title: 'Response time variation in section 3',
      confidence: 51,
      actionable: false,
      section: 'Section 3'
    },
    {
      id: 'C-29201',
      candidateId: 'A007',
      time: '15:35',
      severity: 'medium',
      title: 'Response time variation in section 3',
      confidence: 73,
      actionable: true,
      section: 'Section 3'
    },
    {
      id: 'C-36398',
      candidateId: 'A009',
      time: '15:35',
      severity: 'high',
      title: 'Response time variation in section 3',
      confidence: 79,
      actionable: true,
      section: 'Section 3'
    },
  ]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 8 seconds
        const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
        const alertTypes = [
          'Response time variation',
          'Similarity threshold exceeded', 
          'Unusual answer pattern',
          'Device access anomaly',
          'Multiple revision pattern'
        ];
        
        const newAlert: Alert = {
          id: `C-${Math.floor(Math.random() * 90000) + 10000}`,
          candidateId: `A${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: `${alertTypes[Math.floor(Math.random() * alertTypes.length)]} detected`,
          confidence: Math.floor(Math.random() * 40) + 60,
          actionable: Math.random() > 0.3,
          section: `Section ${Math.floor(Math.random() * 5) + 1}`
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep latest 10
        setUnreadCount(prev => prev + 1);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-admin-critical-alert border-admin-critical-alert text-white';
      case 'high': return 'bg-admin-answer-revision border-admin-answer-revision text-white';
      case 'medium': return 'bg-admin-warning border-admin-warning text-black';
      case 'low': return 'bg-admin-info border-admin-info text-black';
      default: return 'bg-muted border-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return Bell;
      default: return Bell;
    }
  };

  const getAlertBgColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-admin-critical-alert/5 border-l-admin-critical-alert';
      case 'high': return 'bg-admin-answer-revision/5 border-l-admin-answer-revision';
      case 'medium': return 'bg-admin-warning/5 border-l-admin-warning';
      case 'low': return 'bg-admin-info/5 border-l-admin-info';
      default: return 'bg-muted/5 border-l-muted';
    }
  };

  const handleAlertClick = (alert: Alert) => {
    // TODO: Open detailed investigation view
    console.log('Opening alert details:', alert);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Card className="w-16 shadow-lg border-2 border-admin-critical-alert/20">
          <CardContent className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="w-full h-12 flex flex-col items-center justify-center space-y-1"
            >
              <Bell className="h-4 w-4 text-admin-critical-alert" />
              {unreadCount > 0 && (
                <Badge className="text-xs h-4 w-4 p-0 bg-admin-critical-alert text-white rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 bottom-4 w-80 z-40">
      <Card className="h-full shadow-xl border-2 border-admin-critical-alert/10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Bell className="h-5 w-5 text-admin-critical-alert" />
              <span>Alert Feed</span>
              <div className="flex space-x-1">
                {criticalCount > 0 && (
                  <Badge className="bg-admin-critical-alert text-white text-xs">
                    {criticalCount} Critical
                  </Badge>
                )}
                {highCount > 0 && (
                  <Badge className="bg-admin-answer-revision text-white text-xs">
                    {highCount} High
                  </Badge>
                )}
              </div>
            </CardTitle>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setUnreadCount(0)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Live monitoring</span>
            <Badge variant="outline" className="text-admin-normal-safe border-admin-normal-safe">
              Live
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full px-4 py-2">
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                return (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${getAlertBgColor(alert.severity)}`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    {/* Alert Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${getSeverityColor(alert.severity)} flex items-center justify-center`}>
                          <SeverityIcon className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{alert.id}</span>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                      
                      {index < 2 && (
                        <div className="flex items-center space-x-1 opacity-80">
                          <div className="w-2 h-2 bg-admin-critical-alert rounded-full animate-pulse" />
                          <span className="text-xs text-admin-critical-alert font-medium">NEW</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Alert Content */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        Pattern detected: {alert.title}
                      </p>
                      
                      {alert.section && (
                        <p className="text-xs text-muted-foreground">
                          Location: {alert.section}
                        </p>
                      )}
                      
                      {/* Alert Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground font-medium">
                            Confidence: {alert.confidence}%
                          </span>
                          
                          <div className="w-16 h-1 bg-muted rounded-full">
                            <div 
                              className={`h-1 rounded-full ${
                                alert.confidence > 80 ? 'bg-admin-critical-alert' :
                                alert.confidence > 60 ? 'bg-admin-warning' : 'bg-admin-info'
                              }`}
                              style={{ width: `${alert.confidence}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
                            <User className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}