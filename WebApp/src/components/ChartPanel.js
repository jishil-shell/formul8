import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';
import './css/Common.css';

const ChartPanel = ({ title, xName, yName, resultData }) => {

    const plotData = resultData?.data || [];
    const tooltipColumns = resultData?.columns || [];

    plotData.sort((a, b) => a.carbon_footprint - b.carbon_footprint);

    const maxCost = Math.max(...plotData.map(item => item.cost ? item.cost : 0));
    const maxCarbon = Math.max(...plotData.map(item => item.carbon_footprint ? item.carbon_footprint : 0));


    // Custom tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    {tooltipColumns.map((item) => (
                        <p className="label">
                            <span className="leftAlign">{item.toUpperCase()} : </span>
                            <span className="leftAlign"><b>&nbsp;{payload[0].payload[item]}</b></span>
                            <span className="leftAlign">&nbsp;{item === 'cost' ? '$/Kgfoam' : (item === 'carbon_footprint' ? 'kgCO2e/Kgfeed' : '')}</span>
                            <br></br>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-panel">
            <h2>{title}</h2>
            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={plotData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis type="number" label={{ value: xName, position: 'insideBottom', offset: -15 }} dataKey="carbon_footprint" name="Carbon Footprint" unit="" domain={[0, maxCarbon]} padding={{ right: 30 }} />
                    <YAxis type="number" label={{ value: yName , angle: -90, position: 'insideLeft'}} dataKey="cost" name="Cost" unit="" domain={[0, maxCost]} padding={{ top: 30 }} />
                    <Tooltip content={<CustomTooltip />}/>
                    <Area
                        type="monotone"
                        dataKey="carbonFootprint"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                    />
                    <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#8884d8"
                        strokeWidth={4}
                        dot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartPanel;
