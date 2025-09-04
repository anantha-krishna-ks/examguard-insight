import React from 'react';

interface ViolinPlotData {
  name: string;
  scores: number[];
  median: number;
  q1: number;
  q3: number;
}

interface ViolinPlotProps {
  data: ViolinPlotData[];
  width?: number;
  height?: number;
}

const colors = [
  '#10b981', // green
  '#6b7280', // gray
  '#ef4444', // red
  '#f59e0b', // yellow
];

export function ViolinPlot({ data, width = 400, height = 300 }: ViolinPlotProps) {
  const margin = { top: 20, right: 20, bottom: 60, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxScore = Math.max(...data.flatMap(d => d.scores));
  const minScore = Math.min(...data.flatMap(d => d.scores));
  const scoreRange = maxScore - minScore;
  
  const violinWidth = chartWidth / data.length * 0.8;
  const violinSpacing = chartWidth / data.length;
  
  // Function to calculate kernel density estimation
  const calculateDensity = (scores: number[], bandwidth = 1) => {
    const points = [];
    const step = scoreRange / 50;
    
    for (let y = minScore; y <= maxScore; y += step) {
      let density = 0;
      scores.forEach(score => {
        const distance = (y - score) / bandwidth;
        density += Math.exp(-0.5 * distance * distance);
      });
      density = density / (scores.length * bandwidth * Math.sqrt(2 * Math.PI));
      points.push({ y, density });
    }
    
    // Normalize density to fit violin width
    const maxDensity = Math.max(...points.map(p => p.density));
    return points.map(p => ({
      y: p.y,
      density: (p.density / maxDensity) * (violinWidth / 2)
    }));
  };
  
  // Scale functions
  const yScale = (value: number) => {
    return margin.top + ((maxScore - value) / scoreRange) * chartHeight;
  };
  
  const xScale = (index: number) => {
    return margin.left + (index + 0.5) * violinSpacing;
  };

  return (
    <div className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
        
        {/* Y-axis labels */}
        {[15, 20, 25, 30, 35].map(value => (
          <g key={value}>
            <line
              x1={margin.left - 5}
              y1={yScale(value)}
              x2={margin.left}
              y2={yScale(value)}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={margin.left - 10}
              y={yScale(value)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              {value}
            </text>
          </g>
        ))}
        
        {/* Grid lines */}
        {[15, 20, 25, 30, 35].map(value => (
          <line
            key={value}
            x1={margin.left}
            y1={yScale(value)}
            x2={width - margin.right}
            y2={yScale(value)}
            stroke="hsl(var(--border))"
            strokeWidth={0.5}
            strokeDasharray="2,2"
            opacity={0.3}
          />
        ))}
        
        {/* Violin plots */}
        {data.map((item, index) => {
          const densityPoints = calculateDensity(item.scores);
          const centerX = xScale(index);
          const color = colors[index % colors.length];
          
          // Create violin path
          const leftPath = densityPoints
            .map(p => `${centerX - p.density},${yScale(p.y)}`)
            .join(' L');
          const rightPath = densityPoints
            .slice()
            .reverse()
            .map(p => `${centerX + p.density},${yScale(p.y)}`)
            .join(' L');
          
          const violinPath = `M${leftPath} L${rightPath} Z`;
          
          return (
            <g key={item.name}>
              {/* Violin shape */}
              <path
                d={violinPath}
                fill={color}
                fillOpacity={0.6}
                stroke={color}
                strokeWidth={1}
              />
              
              {/* Box plot elements */}
              {/* IQR box */}
              <rect
                x={centerX - 4}
                y={yScale(item.q3)}
                width={8}
                height={yScale(item.q1) - yScale(item.q3)}
                fill="white"
                stroke={color}
                strokeWidth={2}
              />
              
              {/* Median line */}
              <line
                x1={centerX - 4}
                y1={yScale(item.median)}
                x2={centerX + 4}
                y2={yScale(item.median)}
                stroke={color}
                strokeWidth={3}
              />
              
              {/* Individual points */}
              {item.scores.map((score, scoreIndex) => (
                <circle
                  key={scoreIndex}
                  cx={centerX + (Math.random() - 0.5) * 8}
                  cy={yScale(score)}
                  r={1.5}
                  fill={color}
                  opacity={0.8}
                />
              ))}
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => (
          <text
            key={item.name}
            x={xScale(index)}
            y={height - margin.bottom + 15}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {item.name}
          </text>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}