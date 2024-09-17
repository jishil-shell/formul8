import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Book A', value: 400 },
  { name: 'Book B', value: 300 },
  { name: 'Book C', value: 200 },
  { name: 'Book D', value: 100 },
];

const HorizontalBarChart = () => (
  <BarChart
    width={600}
    height={300}
    data={data}
    layout="vertical"
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
);

export default HorizontalBarChart;
