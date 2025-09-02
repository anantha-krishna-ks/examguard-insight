import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";
import { 
  Download, 
  Filter, 
  Users, 
  Clock,
  AlertTriangle,
  Eye
} from "lucide-react";

interface DrillDownModalProps {
  chartType: string;
  data: any;
  onClose: () => void;
}

export function DrillDownModal({ chartType, data, onClose }: DrillDownModalProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const getModalTitle = () => {
    switch (chartType) {
      case 'responseTimeAnomaly': return 'Response Time-Based Anomaly Analysis';
      case 'behavioralAnomaly': return 'Behavioural Pattern Anomaly Analysis';
      case 'similarity': return 'Similarity Investigation';
      case 'personFit': return 'Person-Fit Model Results';
      default: return 'Detailed Analysis';
    }
  };

  const getModalDescription = () => {
    switch (chartType) {
      case 'responseTimeAnomaly': return 'Analyze response time anomalies and identify suspicious timing patterns across test sessions';
      case 'behavioralAnomaly': return 'Investigate sequential patterns and answer revision behaviors that indicate potential misconduct';
      case 'similarity': return 'Investigate similarity clusters and potential collusion between candidates';
      case 'personFit': return 'Examine person-fit model violations and probability anomalies';
      default: return 'Detailed view of the selected analytics';
    }
  };

  const renderDetailedChart = () => {
    switch (chartType) {
      case 'responseTimeAnomaly':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                labelFormatter={(label) => `Response Time Analysis: ${label}`}
              />
              <Bar dataKey="notStarted" stackId="stack" fill="#f59e0b" name="Not Started" />
              <Bar dataKey="inProgress" stackId="stack" fill="#10b981" name="In Progress" />
              <Bar dataKey="completed" stackId="stack" fill="hsl(var(--admin-response-anomaly))" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'behavioralAnomaly':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `Behavioral Analysis: ${label}`}
              />
              <Bar dataKey="sequentialPattern" fill="hsl(var(--admin-sequential-pattern))" name="Sequential Pattern Anomalies" />
              <Bar dataKey="answerRevision" fill="hsl(var(--admin-answer-revision))" name="Answer Revision Anomalies" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'similarity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 border rounded shadow">
                        <p><strong>Candidate:</strong> {data.candidate}</p>
                        <p><strong>Similarity:</strong> {(data.similarity * 100).toFixed(1)}%</p>
                        <p><strong>Risk Level:</strong> {data.similarity > 0.9 ? 'Critical' : data.similarity > 0.8 ? 'High' : 'Medium'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="similarity">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.similarity > 0.9 ? "hsl(var(--admin-critical-alert))" :
                    entry.similarity > 0.8 ? "hsl(var(--admin-answer-revision))" :
                    "hsl(var(--admin-sequential-pattern))"
                  } />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="text-center py-8 text-muted-foreground">Chart details will be displayed here</div>;
    }
  };

  const renderCandidateList = () => {
    const mockCandidates = [
      { id: 'A001', name: 'John Smith', risk: 'High', score: 92 },
      { id: 'A002', name: 'Emma Johnson', risk: 'Critical', score: 95 },
      { id: 'A003', name: 'Michael Davis', risk: 'Medium', score: 78 },
      { id: 'A004', name: 'Sarah Wilson', risk: 'High', score: 88 },
      { id: 'A005', name: 'David Brown', risk: 'Low', score: 65 },
    ];

    return (
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {mockCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={
                  candidate.risk === 'Critical' ? 'destructive' :
                  candidate.risk === 'High' ? 'default' :
                  candidate.risk === 'Medium' ? 'secondary' : 'outline'
                }>
                  {candidate.risk}
                </Badge>
                <span className="text-sm font-mono">{candidate.score}%</span>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{getModalTitle()}</span>
            <Badge variant="outline">Drill-Down View</Badge>
          </DialogTitle>
          <DialogDescription>
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="mt-4">
              <div className="border rounded-lg p-4">
                {renderDetailedChart()}
              </div>
            </TabsContent>
            
            <TabsContent value="candidates" className="mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Affected Candidates
                </h3>
                {renderCandidateList()}
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  AI Insights & Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-admin-critical-alert/10 rounded border-l-4 border-admin-critical-alert">
                    <p className="font-medium text-sm">Critical Finding</p>
                    <p className="text-sm text-muted-foreground">Multiple candidates showing identical response patterns suggests possible collusion.</p>
                  </div>
                  <div className="p-3 bg-admin-warning/10 rounded border-l-4 border-admin-warning">
                    <p className="font-medium text-sm">Recommendation</p>
                    <p className="text-sm text-muted-foreground">Implement immediate seat redistribution and enhanced monitoring for flagged candidates.</p>
                  </div>
                  <div className="p-3 bg-admin-info/10 rounded border-l-4 border-admin-sequential-pattern">
                    <p className="font-medium text-sm">Next Steps</p>
                    <p className="text-sm text-muted-foreground">Schedule follow-up interviews and review video recordings for the flagged time period.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}