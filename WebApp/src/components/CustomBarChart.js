import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

// Sample data
const data = [
  {
    "response": "Blocktemp",
    "label": "Block Temperature (°C)",
    "low_user": 150,
    "high_user": 168,
    "active_constraint": true,
    "low_absolute": 40,
    "high_absolute": 170,
    "result": "164.13"
  },
  {
    "response": "Risetime",
    "label": "Rise Time (s)",
    "low_user": 10,
    "high_user": 180,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 600,
    "result": "0.00"
  },
  {
    "response": "Viscosity",
    "label": "Viscosity (cps)",
    "low_user": 0.5,
    "high_user": 2,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 6000,
    "result": "1.00"
  },
  {
    "response": "YDens",
    "label": "Density (kg/m³)",
    "low_user": 15,
    "high_user": 22,
    "active_constraint": true,
    "low_absolute": 8,
    "high_absolute": 70,
    "result": "18.65"
  },
  {
    "response": "YCLD40",
    "label": "Compression Load Deflection 40% (kPa)",
    "low_user": 2,
    "high_user": 2.5,
    "active_constraint": true,
    "low_absolute": 0,
    "high_absolute": 100,
    "result": "2.34"
  },
  {
    "response": "YILD25",
    "label": "Indentation Load Deflection 25% (N)",
    "low_user": 50,
    "high_user": 70,
    "active_constraint": false,
    "low_absolute": 10,
    "high_absolute": 300,
    "result": "57.67"
  },
  {
    "response": "YILD40",
    "label": "Indentation Load Deflection 40% (N)",
    "low_user": 70,
    "high_user": 120,
    "active_constraint": false,
    "low_absolute": 20,
    "high_absolute": 600,
    "result": "91.09"
  },
  {
    "response": "YILD65",
    "label": "Indentation Load Deflection 65% (N)",
    "low_user": 200,
    "high_user": 205,
    "active_constraint": false,
    "low_absolute": 40,
    "high_absolute": 1200,
    "result": "201.63"
  },
  {
    "response": "YTens",
    "label": "Tensile Strength (kPa)",
    "low_user": 70,
    "high_user": 110,
    "active_constraint": false,
    "low_absolute": 50,
    "high_absolute": 1000,
    "result": "93.51"
  },
  {
    "response": "YElong",
    "label": "Elongation at Break (%)",
    "low_user": 90,
    "high_user": 110,
    "active_constraint": false,
    "low_absolute": 80,
    "high_absolute": 1000,
    "result": "97.47"
  },
  {
    "response": "YSAG",
    "label": "Support Adjustment Group Factor",
    "low_user": 2,
    "high_user": 4,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 5,
    "result": "3.40"
  },
  {
    "response": "YResil",
    "label": "Resilience (%)",
    "low_user": 58,
    "high_user": 65,
    "active_constraint": true,
    "low_absolute": 30,
    "high_absolute": 100,
    "result": "57.95"
  },
  {
    "response": "YCSD50",
    "label": "Compression Set Deflection Dry 50% (%)",
    "low_user": 7,
    "high_user": 12,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 50,
    "result": "8.61"
  },
  {
    "response": "YCSD75",
    "label": "Compression Set Deflection Dry 75% (%)",
    "low_user": 7,
    "high_user": 12,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 50,
    "result": "8.92"
  },
  {
    "response": "YCSD90",
    "label": "Compression Set Deflection Dry 90% (%)",
    "low_user": 12,
    "high_user": 20,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 50,
    "result": "14.76"
  },
  {
    "response": "YCSW75",
    "label": "Compression Set Deflection Wet 75% (%)",
    "low_user": 30,
    "high_user": 50,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 50,
    "result": "32.91"
  },
  {
    "response": "YTWL",
    "label": "Crib5",
    "low_user": 150,
    "high_user": 250,
    "active_constraint": false,
    "low_absolute": 0,
    "high_absolute": 1000,
    "result": "209.71"
  }
];

const CustomBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="response" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="low_absolute" fill="#8884d8" name="Low" />
        <Bar dataKey="result" fill="#82ca9d" name="Result">
          <LabelList dataKey="result" position="top" />
        </Bar>
        <Bar dataKey="high_absolute" fill="#ff7f0e" name="High" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
