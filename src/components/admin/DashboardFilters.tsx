import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";

interface FilterState {
  timeWindow: string;
  assessment: string;
  testCenter: string;
  accommodations: string;
}

export function DashboardFilters() {
  const [filters, setFilters] = useState<FilterState>({
    timeWindow: "last-hour",
    assessment: "all",
    testCenter: "all",
    accommodations: "include-all"
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      timeWindow: "last-hour",
      assessment: "all",
      testCenter: "all",
      accommodations: "include-all"
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.timeWindow !== "last-hour") count++;
    if (filters.assessment !== "all") count++;
    if (filters.testCenter !== "all") count++;
    if (filters.accommodations !== "include-all") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {activeFiltersCount} applied
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Window */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Time Window
            </label>
            <Select
              value={filters.timeWindow}
              onValueChange={(value) => handleFilterChange('timeWindow', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-hour">Last hour</SelectItem>
                <SelectItem value="last-4-hours">Last 4 hours</SelectItem>
                <SelectItem value="last-12-hours">Last 12 hours</SelectItem>
                <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
                <SelectItem value="last-week">Last week</SelectItem>
                <SelectItem value="last-month">Last month</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assessment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Assessment
            </label>
            <Select
              value={filters.assessment}
              onValueChange={(value) => handleFilterChange('assessment', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test Center */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Test Center
            </label>
            <Select
              value={filters.testCenter}
              onValueChange={(value) => handleFilterChange('testCenter', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="center-001">Test Center 001 - Downtown</SelectItem>
                <SelectItem value="center-002">Test Center 002 - North Campus</SelectItem>
                <SelectItem value="center-003">Test Center 003 - South Branch</SelectItem>
                <SelectItem value="center-004">Test Center 004 - East Wing</SelectItem>
                <SelectItem value="remote">Remote Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accommodations */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Accommodations
            </label>
            <Select
              value={filters.accommodations}
              onValueChange={(value) => handleFilterChange('accommodations', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="include-all">Include All</SelectItem>
                <SelectItem value="extended-time">Extended Time Only</SelectItem>
                <SelectItem value="screen-reader">Screen Reader Only</SelectItem>
                <SelectItem value="large-print">Large Print Only</SelectItem>
                <SelectItem value="multiple">Multiple Accommodations</SelectItem>
                <SelectItem value="none">No Accommodations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {filters.timeWindow !== "last-hour" && (
                <Badge variant="outline" className="text-xs">
                  Time: {filters.timeWindow.replace('-', ' ')}
                </Badge>
              )}
              {filters.assessment !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Assessment: {filters.assessment}
                </Badge>
              )}
              {filters.testCenter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Center: {filters.testCenter}
                </Badge>
              )}
              {filters.accommodations !== "include-all" && (
                <Badge variant="outline" className="text-xs">
                  Accommodations: {filters.accommodations.replace('-', ' ')}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}