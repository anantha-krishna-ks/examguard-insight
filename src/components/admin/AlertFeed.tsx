import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Bell,
  Clock,
  Eye,
  ExternalLink,
  User,
  Settings,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Pin,
  PinOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  candidateId: string;
  candidateName: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  confidence: number;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  actionable: boolean;
  section?: string;
  description: string;
}

export function AlertFeed() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'C-37435',
      candidateId: 'A002',
      candidateName: 'Emma Johnson',
      time: '15:36',
      severity: 'critical',
      title: 'Similarity threshold exceeded',
      confidence: 94,
      status: 'open',
      actionable: true,
      section: 'Section 3',
      description: 'High similarity detected with 3 other candidates in mathematical reasoning section'
    },
    {
      id: 'C-85986',
      candidateId: 'A005',
      candidateName: 'David Brown',
      time: '15:35',
      severity: 'high',
      title: 'Response time anomaly',
      confidence: 87,
      status: 'open',
      actionable: true,
      section: 'Section 2',
      description: 'Consistently fast responses across difficult questions'
    },
    {
      id: 'C-6464',
      candidateId: 'A003',
      candidateName: 'Michael Davis',
      time: '15:34',
      severity: 'medium',
      title: 'Pattern irregularity',
      confidence: 73,
      status: 'investigating',
      actionable: true,
      section: 'Section 1',
      description: 'Unusual answer revision pattern detected'
    },
    {
      id: 'C-29201',
      candidateId: 'A007',
      candidateName: 'Lisa Garcia',
      time: '15:33',
      severity: 'high',
      title: 'Device access violation',
      confidence: 91,
      status: 'open',
      actionable: true,
      section: 'Section 4',
      description: 'Secondary device access attempt detected'
    },
    {
      id: 'C-36398',
      candidateId: 'A009',
      candidateName: 'James Wilson',
      time: '15:32',
      severity: 'medium',
      title: 'Person-fit model alert',
      confidence: 79,
      status: 'resolved',
      actionable: false,
      section: 'Section 3',
      description: 'Response pattern inconsistent with ability estimate'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPinned, setIsPinned] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const severities: Alert['severity'][] = ['medium', 'high', 'critical'];
        const alertTypes = [
          'Similarity threshold exceeded',
          'Response time anomaly', 
          'Device access violation',
          'Pattern irregularity',
          'Person-fit model alert'
        ];
        const candidates = ['Emma Johnson', 'David Brown', 'Michael Davis', 'Lisa Garcia', 'James Wilson'];
        
        const newAlert: Alert = {
          id: `C-${Math.floor(Math.random() * 90000) + 10000}`,
          candidateId: `A${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          candidateName: candidates[Math.floor(Math.random() * candidates.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          confidence: Math.floor(Math.random() * 30) + 70,
          status: 'open',
          actionable: true,
          section: `Section ${Math.floor(Math.random() * 5) + 1}`,
          description: 'Automated detection system flagged this behavior for review'
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 14)]);
        
        // Show toast for critical alerts
        if (newAlert.severity === 'critical') {
          toast({
            title: "Critical Alert",
            description: `${newAlert.candidateName} - ${newAlert.title}`,
            variant: "destructive",
          });
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [toast]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-admin-critical-alert text-white';
      case 'high': return 'bg-admin-answer-revision text-white';
      case 'medium': return 'bg-admin-warning text-black';
      case 'low': return 'bg-admin-info text-black';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-admin-critical-alert text-white';
      case 'investigating': return 'bg-admin-warning text-black';
      case 'resolved': return 'bg-admin-normal-safe text-white';
      case 'dismissed': return 'bg-muted text-black';
      default: return 'bg-muted';
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

  const handleAlertAction = (alertId: string, action: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action as Alert['status'] }
        : alert
    ));
    
    toast({
      title: "Alert Updated",
      description: `Alert ${alertId} marked as ${action}`,
    });
  };

  const handleInvestigate = (alert: Alert) => {
    console.log('Investigating alert:', alert);
    toast({
      title: "Investigation Started",
      description: `Opening detailed view for ${alert.candidateName}`,
    });
  };

  const handleCreateCase = (alert: Alert) => {
    console.log('Creating case for alert:', alert);
    toast({
      title: "Case Created",
      description: `New investigation case created for alert ${alert.id}`,
    });
  };

  const handleMessageProctor = (alert: Alert) => {
    console.log('Messaging proctor about alert:', alert);
    toast({
      title: "Proctor Notified",
      description: `Alert sent to proctor monitoring ${alert.candidateName}`,
    });
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const openCount = alerts.filter(a => a.status === 'open').length;

  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-admin-critical-alert hover:bg-admin-critical-alert/90 shadow-lg animate-pulse"
        >
          <Bell className="h-5 w-5 text-white" />
          {openCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white text-admin-critical-alert rounded-full flex items-center justify-center text-xs font-bold">
              {openCount > 99 ? '99+' : openCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-admin-critical-alert" />
            <h3 className="font-semibold text-lg">Alert Feed</h3>
            <Badge className="bg-admin-critical-alert text-white animate-pulse">
              Live
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPinned(!isPinned)}
              className={isPinned ? 'bg-admin-sequential-pattern/20' : ''}
            >
              {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMinimized(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-admin-critical-alert">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-admin-answer-revision">{highCount}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-admin-warning">{openCount}</div>
            <div className="text-xs text-muted-foreground">Open</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          
          <div className="flex space-x-2">
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredAlerts.map((alert, index) => {
            const SeverityIcon = getSeverityIcon(alert.severity);
            const isNew = index < 2; // Mark first 2 as new
            
            return (
              <Card 
                key={alert.id} 
                className={`hover:shadow-md transition-all duration-200 hover-scale cursor-pointer ${
                  isNew ? 'ring-2 ring-admin-critical-alert/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} flex items-center justify-center`}>
                        <SeverityIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{alert.id}</span>
                          {isNew && (
                            <Badge className="bg-admin-critical-alert text-white text-xs animate-pulse">
                              NEW
                            </Badge>
                          )}
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleInvestigate(alert)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Investigate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCreateCase(alert)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Case
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMessageProctor(alert)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Proctor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'resolved')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'dismissed')}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Alert Content */}
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm mb-1">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      {alert.section && (
                        <p className="text-xs text-muted-foreground mt-1">📍 {alert.section}</p>
                      )}
                    </div>
                    
                    {/* Confidence Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium">{alert.confidence}%</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            alert.confidence > 85 ? 'bg-admin-critical-alert' :
                            alert.confidence > 70 ? 'bg-admin-warning' : 'bg-admin-info'
                          }`}
                          style={{ width: `${alert.confidence}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {alert.actionable && alert.status === 'open' && (
                      <div className="flex space-x-2 pt-2 border-t border-border/30">
                        <Button 
                          size="sm" 
                          className="flex-1 h-7 text-xs"
                          onClick={() => handleInvestigate(alert)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 h-7 text-xs"
                          onClick={() => handleAlertAction(alert.id, 'investigating')}
                        >
                          Start Investigation
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No alerts match your filters</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t bg-card">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}