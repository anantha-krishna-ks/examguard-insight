import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArrowLeft, BarChart3, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

type ViewLevel = 'test' | 'location' | 'testCenter';

interface BehavioralPatternAnalysisPageProps {}

// Mock data for different levels
const testLevelData = [
  { name: 'Test 1', sequentialPattern: 152, answerRevision: 26 },
  { name: 'Test 2', sequentialPattern: 206, answerRevision: 51 },
  { name: 'Test 3', sequentialPattern: 97, answerRevision: 5 },
  { name: 'Test 4', sequentialPattern: 134, answerRevision: 33 },
  { name: 'Test 5', sequentialPattern: 178, answerRevision: 42 },
];

const locationLevelData = [
  { name: 'North Region', sequentialPattern: 324, answerRevision: 67 },
  { name: 'South Region', sequentialPattern: 289, answerRevision: 54 },
  { name: 'East Region', sequentialPattern: 198, answerRevision: 43 },
  { name: 'West Region', sequentialPattern: 245, answerRevision: 38 },
  { name: 'Central Region', sequentialPattern: 312, answerRevision: 71 },
];

const testCenterLevelData = [
  { name: 'TC-001', sequentialPattern: 89, answerRevision: 21 },
  { name: 'TC-002', sequentialPattern: 76, answerRevision: 18 },
  { name: 'TC-003', sequentialPattern: 103, answerRevision: 28 },
  { name: 'TC-004', sequentialPattern: 94, answerRevision: 15 },
  { name: 'TC-005', sequentialPattern: 87, answerRevision: 23 },
  { name: 'TC-006', sequentialPattern: 112, answerRevision: 31 },
];

export function BehavioralPatternAnalysisPage({}: BehavioralPatternAnalysisPageProps) {
  const navigate = useNavigate();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('test');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState([0]); // 0: Test, 1: Location, 2: Test Center

  const getCurrentData = useCallback(() => {
    switch (viewLevel) {
      case 'test':
        return testLevelData;
      case 'location':
        return locationLevelData;
      case 'testCenter':
        return testCenterLevelData;
      default:
        return testLevelData;
    }
  }, [viewLevel]);

  const getViewLevelFromSlider = (value: number): ViewLevel => {
    switch (value) {
      case 0: return 'test';
      case 1: return 'location';
      case 2: return 'testCenter';
      default: return 'test';
    }
  };

  const getSliderValueFromLevel = (level: ViewLevel): number => {
    switch (level) {
      case 'test': return 0;
      case 'location': return 1;
      case 'testCenter': return 2;
      default: return 0;
    }
  };

  const handleSliderChange = useCallback((value: number[]) => {
    const newLevel = getViewLevelFromSlider(value[0]);
    setSliderValue(value);
    setViewLevel(newLevel);
    setSelectedLocation(null);
  }, []);

  const handleBarClick = useCallback((data: any) => {
    if (viewLevel === 'location') {
      // When clicking a location bar, switch to test center level
      setSelectedLocation(data.name);
      setViewLevel('testCenter');
      setSliderValue([2]);
    }
  }, [viewLevel]);

  const getBarColor = useCallback((entry: any, index: number) => {
    if (viewLevel === 'testCenter' && selectedLocation) {
      return "hsl(var(--admin-sequential-pattern))";
    }
    
    // Color coding based on anomaly levels
    const total = entry.sequentialPattern + entry.answerRevision;
    if (total > 250) return "#ef4444"; // High anomaly
    if (total > 150) return "#f97316"; // Medium anomaly
    return "hsl(var(--admin-sequential-pattern))"; // Normal
  }, [viewLevel, selectedLocation]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Sequential Pattern: {payload[0]?.value || 0}
          </p>
          <p className="text-sm text-orange-600">
            Answer Revision: {payload[1]?.value || 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total Anomalies: {(payload[0]?.value || 0) + (payload[1]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (viewLevel === 'testCenter' && selectedLocation) {
      return `Behavioral Pattern Anomaly - ${selectedLocation} Test Centers`;
    }
    
    switch (viewLevel) {
      case 'test': return 'Behavioral Pattern Anomaly - Test Level';
      case 'location': return 'Behavioral Pattern Anomaly - Location Level';
      case 'testCenter': return 'Behavioral Pattern Anomaly - Test Center Level';
      default: return 'Behavioral Pattern Anomaly';
    }
  };

  const getSliderLabels = () => {
    return ['Test', 'Location', 'Test Center'];
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-admin-answer-revision" />
              <h1 className="text-2xl font-bold">{getTitle()}</h1>
            </div>
          </div>
          
          <Badge variant="outline" className="text-admin-answer-revision border-admin-answer-revision">
            Behavioral Analysis
          </Badge>
        </div>

        {/* Level Slider */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Analysis Level</CardTitle>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Current: {getSliderLabels()[sliderValue[0]]}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  max={2}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground px-4">
                {getSliderLabels().map((label, index) => (
                  <span 
                    key={label}
                    className={sliderValue[0] === index ? "font-medium text-primary" : ""}
                  >
                    {label}
                  </span>
                ))}
              </div>
              {selectedLocation && viewLevel === 'testCenter' && (
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="mt-2">
                    Filtered by: {selectedLocation}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Behavioral Pattern Anomaly Distribution</CardTitle>
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Sequential Patterns
                </Badge>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Answer Revisions
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={getCurrentData()} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="sequentialPattern" 
                    fill="#2563eb" 
                    name="Sequential Pattern Numbers"
                    onClick={handleBarClick}
                    cursor="pointer"
                  >
                    {getCurrentData().map((entry, index) => (
                      <Cell key={`cell-sequential-${index}`} fill="#2563eb" />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="answerRevision" 
                    fill="#ea580c" 
                    name="Answer Revision Numbers"
                    onClick={handleBarClick}
                    cursor="pointer"
                  >
                    {getCurrentData().map((entry, index) => (
                      <Cell key={`cell-revision-${index}`} fill="#ea580c" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Legend and Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getCurrentData().reduce((sum, item) => sum + item.sequentialPattern, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Sequential Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {getCurrentData().reduce((sum, item) => sum + item.answerRevision, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Answer Revisions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getCurrentData().length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {viewLevel === 'test' ? 'Tests' : viewLevel === 'location' ? 'Locations' : 'Test Centers'} Analyzed
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Instructions:</strong> Use the slider above to switch between analysis levels. 
                {viewLevel === 'location' && " Click on a location bar to drill down to its test centers."}
                {viewLevel === 'testCenter' && selectedLocation && " Showing test centers for the selected location."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}