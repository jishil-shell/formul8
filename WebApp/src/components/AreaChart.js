import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';

// Sample data
const data = [
  { name: 'Point 1', value: 400 },
  { name: 'Point 2', value: 300 },
  { name: 'Point 3', value: 500 },
  { name: 'Point 4', value: 450 },
  { name: 'Point 5', value: 350 },
];

const CustomAreaChart = () => {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      
      {/* Highlight area between first and last point */}
      <ReferenceArea
        x1={data[0].name} // Start at the first point
        x2={data[data.length - 1].name} // End at the last point
        y1={Math.max(...data.map((d) => d.value))} // Top boundary of the area
        y2={Math.min(...data.map((d) => d.value))} // Bottom boundary of the area
        fill="#8884d8"
        fillOpacity={0.2}
      />

      {/* Line with data points */}
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        dot={{ r: 4 }}
      />
    </LineChart>
  );
};

export default CustomAreaChart;
