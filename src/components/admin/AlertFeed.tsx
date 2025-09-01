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

  const [isMinimized, setIsMinimized] = useState(true); // Start minimized by default
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
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
        
        // Auto-expand for critical alerts
        if (newAlert.severity === 'critical' && !isPinned) {
          setIsExpanded(true);
          setTimeout(() => {
            if (!isPinned) setIsExpanded(false);
          }, 10000); // Auto-close after 10 seconds
        }
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
    console.log('Opening alert details:', alert);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setUnreadCount(0); // Clear unread when opening
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsExpanded(true); // Expand when pinning
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  // Floating notification indicator (always visible)
  const NotificationIndicator = () => (
    <div className="fixed top-24 right-4 z-50">
      <Button
        onClick={toggleExpanded}
        className={`relative rounded-full w-12 h-12 shadow-lg transition-all duration-300 ${
          criticalCount > 0 
            ? 'bg-admin-critical-alert hover:bg-admin-critical-alert/90 animate-pulse' 
            : unreadCount > 0
            ? 'bg-admin-answer-revision hover:bg-admin-answer-revision/90'
            : 'bg-admin-sequential-pattern hover:bg-admin-sequential-pattern/90'
        }`}
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-admin-critical-alert text-white rounded-full flex items-center justify-center text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {criticalCount > 0 && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <AlertTriangle className="h-2.5 w-2.5 text-admin-critical-alert" />
          </div>
        )}
      </Button>
    </div>
  );

  return (
    <>
      <NotificationIndicator />
      
      {/* Slide-out Alert Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 z-40 transform transition-transform duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full bg-admin-bg/95 backdrop-blur-md border-l border-border shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b bg-card/90">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-admin-critical-alert" />
                <h3 className="font-semibold text-lg">Alert Feed</h3>
                {criticalCount > 0 && (
                  <Badge className="bg-admin-critical-alert text-white animate-pulse">
                    {criticalCount} Critical
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePin}
                  className={isPinned ? 'bg-admin-sequential-pattern/20' : ''}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4">
                <span className="text-muted-foreground">
                  Total: {alerts.length}
                </span>
                {highCount > 0 && (
                  <span className="text-admin-answer-revision">
                    High: {highCount}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-admin-normal-safe border-admin-normal-safe">
                Live
              </Badge>
            </div>
          </div>
          
          {/* Alert List */}
          <ScrollArea className="h-full pb-20">
            <div className="p-4 space-y-3">
              {alerts.map((alert, index) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                return (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${getAlertBgColor(alert.severity)}`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    {/* Alert Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} flex items-center justify-center`}>
                          <SeverityIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">{alert.id}</span>
                            {index < 2 && (
                              <Badge className="bg-admin-critical-alert text-white text-xs animate-pulse">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Alert Content */}
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground leading-tight mb-1">
                          Pattern detected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {alert.title}
                        </p>
                        {alert.section && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {alert.section}
                          </p>
                        )}
                      </div>
                      
                      {/* Confidence and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            {alert.confidence}%
                          </span>
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                alert.confidence > 80 ? 'bg-admin-critical-alert' :
                                alert.confidence > 60 ? 'bg-admin-warning' : 'bg-admin-info'
                              }`}
                              style={{ width: `${alert.confidence}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <User className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No alerts at the moment</p>
                  <p className="text-sm">System monitoring active</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-card/90 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View All
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}