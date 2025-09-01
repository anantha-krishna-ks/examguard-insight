import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Flag, 
  Users, 
  Clock,
  Shield,
  Eye
} from "lucide-react";

interface Activity {
  id: string;
  time: string;
  type: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  count?: number;
  icon: any;
}

export function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      time: '10:42',
      type: 'critical',
      title: 'High Similarity Cluster',
      description: 'Detected 8 candidates with >90% answer similarity',
      count: 8,
      icon: Users
    },
    {
      id: '2',
      time: '10:38',
      type: 'warning',
      title: 'Wrong→Right Pattern',
      description: 'Unusual answer revision pattern detected',
      count: 5,
      icon: Flag
    },
    {
      id: '3',
      time: '10:35',
      type: 'info',
      title: 'Response Time Anomaly',
      description: 'Candidate A1247 showing consistently fast responses',
      icon: Clock
    },
    {
      id: '4',
      time: '10:31',
      type: 'warning',
      title: 'Person-Fit Alert',
      description: 'Low probability score for candidate responses',
      count: 3,
      icon: AlertTriangle
    },
    {
      id: '5',
      time: '10:28',
      type: 'info',
      title: 'Proctor Alert Resolved',
      description: 'Camera angle issue resolved for exam room 204',
      icon: Eye
    },
    {
      id: '6',
      time: '10:25',
      type: 'critical',
      title: 'Multiple Device Access',
      description: 'Candidate detected using secondary device',
      icon: Shield
    },
  ]);

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newActivity: Activity = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'warning' : 'info',
          title: 'New Alert Detected',
          description: 'Real-time monitoring detected an anomaly',
          icon: AlertTriangle
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep latest 10
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-admin-critical-alert border-admin-critical-alert';
      case 'warning': return 'text-admin-warning border-admin-warning';
      default: return 'text-admin-info border-admin-info';
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-admin-critical-alert/10';
      case 'warning': return 'bg-admin-warning/10';
      default: return 'bg-admin-info/10';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity Timeline</span>
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityBg(activity.type)}`}>
                    <IconComponent className={`h-4 w-4 ${getActivityColor(activity.type).split(' ')[0]}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                        {activity.count && (
                          <Badge variant="outline" className="ml-2">
                            {activity.count}
                          </Badge>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  </div>
                  
                  {index < activities.length - 1 && (
                    <div className="absolute left-4 mt-8 w-px h-4 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}