
import React from 'react';

interface RadarChartProps {
  scores: Record<string, number>;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const radius = 100;

  const points = [
    { label: 'Processing', value: scores.processing, x: center, y: center - radius * ((scores.processing + 5) / 10) },
    { label: 'Perception', value: scores.perception, x: center + radius * ((scores.perception + 5) / 10), y: center },
    { label: 'Input', value: scores.input, x: center, y: center + radius * ((scores.input + 5) / 10) },
    { label: 'Understanding', value: scores.understanding, x: center - radius * ((scores.understanding + 5) / 10), y: center },
  ];

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid Circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="currentColor"
            className="text-orange-500/10"
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="currentColor" className="text-orange-500/20" />
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="currentColor" className="text-orange-500/20" />

        {/* Labels */}
        <text x={center} y={center - radius - 15} textAnchor="middle" fontSize="10" className="fill-orange-500 font-bold uppercase tracking-widest">Active / Reflective</text>
        <text x={center + radius + 10} y={center + 4} fontSize="10" className="fill-orange-500 font-bold uppercase tracking-widest">Sensing / Intuitive</text>
        <text x={center} y={center + radius + 25} textAnchor="middle" fontSize="10" className="fill-orange-500 font-bold uppercase tracking-widest">Visual / Verbal</text>
        <text x={center - radius - 10} y={center + 4} textAnchor="end" fontSize="10" className="fill-orange-500 font-bold uppercase tracking-widest">Sequential / Global</text>

        {/* Data Shape */}
        <polygon
          points={polygonPath}
          fill="rgba(255, 126, 6, 0.3)"
          stroke="#FF7E06"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FF7E06" />
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;
