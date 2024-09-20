import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';

const ChartPanel = ({ title, xName, yName, resultData }) => {

    let sampleColumns = ['cost', 'carbon_footprint', 'carbon_footprint_limit', 'isocyanate_index', 'TD80', 'MD28-02', 'MD30-02', 'DeOA', 'Water', 'CO2', 'MeCl2', 'Glycerol', 'theoretical_diluent_hr'];
    let sampleData = [{ "cost": "219", "carbon_footprint": "3250", "carbon_footprint_limit": "3250", "isocyanate_index": "116.72", "TD80": "100.00", "TD65": "0.00", "SC48-02": "0.00", "SC48-03": "0.00", "SC48-06": "0.00", "SC52-05": "0.00", "SC54-01": "0.00", "SC54-02": "0.00", "SC56-01": "0.00", "SC56-02": "0.00", "SC56-15": "0.00", "SC56-16": "0.00", "SC56-17": "0.00", "SC56-20": "0.00", "MD28-02": "0.00", "MD36-13": "0.00", "SP33-03": "0.00", "SP37-25": "0.00", "SP37-25F": "0.00", "SP38-04": "0.00", "SP42-02": "0.00", "SP42-15": "0.00", "SP43-03": "0.00", "SP44-10": "0.00", "SP44-10F": "0.00", "MD30-45": "0.00", "MD30-45F": "0.00", "SP32-01": "0.00", "SP37-01": "0.00", "SP39-01": "0.00", "SP41-01": "0.00", "MD22-40": "0.00", "MD30-02": "100.00", "SP30-15": "0.00", "SP50-04": "0.00", "SA36-02": "0.00", "MD145-02": "0.00", "MD56-18": "0.00", "DeOA": "1.29", "TeOA": "0.00", "Water": "3.08", "pureUrea": "0.00", "TDCP": "0.00", "CaCO3": "0.00", "Melamine": "0.00", "CO2": "2.26", "MeCl2": "0.00", "Acetone": "0.00", "NiaxA1": "0.00", "33LV": "0.00", "Tegostab B4900": "0.00", "Glycerol": "0.00", "Pentaerythritol": "0.00", "theoretical_base_conv": "0.00", "theoretical_diluent_hr": "0.00", "theoretical_polymer_conv": "0.00", "theoretical_polymer_hr": "0.00", "theoretical_soft_polyol": "0.00", "theoretical_hard_polyol_conv": "0.00" }, { "cost": "172", "carbon_footprint": "5739", "carbon_footprint_limit": "5739", "isocyanate_index": "109.48", "TD80": "100.00", "TD65": "0.00", "SC48-02": "0.00", "SC48-03": "0.00", "SC48-06": "0.00", "SC52-05": "0.00", "SC54-01": "0.00", "SC54-02": "0.00", "SC56-01": "0.00", "SC56-02": "0.00", "SC56-15": "0.00", "SC56-16": "0.00", "SC56-17": "0.00", "SC56-20": "0.00", "MD28-02": "29.31", "MD36-13": "0.00", "SP33-03": "0.00", "SP37-25": "0.00", "SP37-25F": "0.00", "SP38-04": "0.00", "SP42-02": "0.00", "SP42-15": "0.00", "SP43-03": "0.00", "SP44-10": "0.00", "SP44-10F": "0.00", "MD30-45": "0.00", "MD30-45F": "0.00", "SP32-01": "0.00", "SP37-01": "0.00", "SP39-01": "0.00", "SP41-01": "0.00", "MD22-40": "0.00", "MD30-02": "70.69", "SP30-15": "0.00", "SP50-04": "0.00", "SA36-02": "0.00", "MD145-02": "0.00", "MD56-18": "0.00", "DeOA": "1.80", "TeOA": "0.00", "Water": "4.07", "pureUrea": "0.00", "TDCP": "0.00", "CaCO3": "0.00", "Melamine": "0.00", "CO2": "0.00", "MeCl2": "0.38", "Acetone": "0.00", "NiaxA1": "0.00", "33LV": "0.00", "Tegostab B4900": "0.00", "Glycerol": "1.45", "Pentaerythritol": "0.00", "theoretical_base_conv": "0.00", "theoretical_diluent_hr": "0.00", "theoretical_polymer_conv": "0.00", "theoretical_polymer_hr": "0.00", "theoretical_soft_polyol": "0.00", "theoretical_hard_polyol_conv": "0.00" }, { "cost": "136", "carbon_footprint": "8228", "carbon_footprint_limit": "8228", "isocyanate_index": "116.58", "TD80": "100.00", "TD65": "0.00", "SC48-02": "0.00", "SC48-03": "0.00", "SC48-06": "0.00", "SC52-05": "0.00", "SC54-01": "0.00", "SC54-02": "0.00", "SC56-01": "0.00", "SC56-02": "0.00", "SC56-15": "0.00", "SC56-16": "0.00", "SC56-17": "0.00", "SC56-20": "0.00", "MD28-02": "62.73", "MD36-13": "0.00", "SP33-03": "0.00", "SP37-25": "0.00", "SP37-25F": "0.00", "SP38-04": "0.00", "SP42-02": "0.00", "SP42-15": "0.00", "SP43-03": "0.00", "SP44-10": "0.00", "SP44-10F": "0.00", "MD30-45": "0.00", "MD30-45F": "0.00", "SP32-01": "0.00", "SP37-01": "0.00", "SP39-01": "0.00", "SP41-01": "0.00", "MD22-40": "0.00", "MD30-02": "37.27", "SP30-15": "0.00", "SP50-04": "0.00", "SA36-02": "0.00", "MD145-02": "0.00", "MD56-18": "0.00", "DeOA": "1.80", "TeOA": "0.00", "Water": "4.05", "pureUrea": "0.00", "TDCP": "0.00", "CaCO3": "0.00", "Melamine": "0.00", "CO2": "0.00", "MeCl2": "0.00", "Acetone": "0.00", "NiaxA1": "0.00", "33LV": "0.00", "Tegostab B4900": "0.00", "Glycerol": "0.26", "Pentaerythritol": "0.00", "theoretical_base_conv": "0.00", "theoretical_diluent_hr": "0.00", "theoretical_polymer_conv": "0.00", "theoretical_polymer_hr": "0.00", "theoretical_soft_polyol": "0.00", "theoretical_hard_polyol_conv": "0.00" }, { "cost": "118", "carbon_footprint": "9552", "carbon_footprint_limit": "10716", "isocyanate_index": "119.68", "TD80": "100.00", "TD65": "0.00", "SC48-02": "0.00", "SC48-03": "0.00", "SC48-06": "0.00", "SC52-05": "0.00", "SC54-01": "0.00", "SC54-02": "0.00", "SC56-01": "0.00", "SC56-02": "0.00", "SC56-15": "0.00", "SC56-16": "0.00", "SC56-17": "0.00", "SC56-20": "0.00", "MD28-02": "80.00", "MD36-13": "0.00", "SP33-03": "0.00", "SP37-25": "0.00", "SP37-25F": "0.00", "SP38-04": "0.00", "SP42-02": "0.00", "SP42-15": "0.00", "SP43-03": "0.00", "SP44-10": "0.00", "SP44-10F": "0.00", "MD30-45": "0.00", "MD30-45F": "0.00", "SP32-01": "0.00", "SP37-01": "0.00", "SP39-01": "0.00", "SP41-01": "0.00", "MD22-40": "0.00", "MD30-02": "20.00", "SP30-15": "0.00", "SP50-04": "0.00", "SA36-02": "0.00", "MD145-02": "0.00", "MD56-18": "0.00", "DeOA": "1.57", "TeOA": "0.00", "Water": "4.05", "pureUrea": "0.00", "TDCP": "0.00", "CaCO3": "0.00", "Melamine": "0.00", "CO2": "0.00", "MeCl2": "0.00", "Acetone": "0.00", "NiaxA1": "0.00", "33LV": "0.00", "Tegostab B4900": "0.00", "Glycerol": "0.00", "Pentaerythritol": "0.00", "theoretical_base_conv": "0.00", "theoretical_diluent_hr": "0.00", "theoretical_polymer_conv": "0.00", "theoretical_polymer_hr": "0.00", "theoretical_soft_polyol": "0.00", "theoretical_hard_polyol_conv": "0.00" }, { "cost": "97", "carbon_footprint": "12505", "carbon_footprint_limit": "13205", "isocyanate_index": "122.32", "TD80": "100.00", "TD65": "0.00", "SC48-02": "0.00", "SC48-03": "0.00", "SC48-06": "0.00", "SC52-05": "0.00", "SC54-01": "0.00", "SC54-02": "0.00", "SC56-01": "0.00", "SC56-02": "0.00", "SC56-15": "0.00", "SC56-16": "0.00", "SC56-17": "0.00", "SC56-20": "0.00", "MD28-02": "66.67", "MD36-13": "0.00", "SP33-03": "0.00", "SP37-25": "0.00", "SP37-25F": "0.00", "SP38-04": "0.00", "SP42-02": "0.00", "SP42-15": "0.00", "SP43-03": "0.00", "SP44-10": "0.00", "SP44-10F": "0.00", "MD30-45": "0.00", "MD30-45F": "0.00", "SP32-01": "0.00", "SP37-01": "0.00", "SP39-01": "0.00", "SP41-01": "0.00", "MD22-40": "0.00", "MD30-02": "0.00", "SP30-15": "0.00", "SP50-04": "0.00", "SA36-02": "0.00", "MD145-02": "0.00", "MD56-18": "0.00", "DeOA": "1.13", "TeOA": "0.00", "Water": "4.06", "pureUrea": "0.00", "TDCP": "0.00", "CaCO3": "0.00", "Melamine": "0.00", "CO2": "0.00", "MeCl2": "0.00", "Acetone": "0.00", "NiaxA1": "0.00", "33LV": "0.00", "Tegostab B4900": "0.00", "Glycerol": "0.00", "Pentaerythritol": "0.00", "theoretical_base_conv": "0.00", "theoretical_diluent_hr": "33.33", "theoretical_polymer_conv": "0.00", "theoretical_polymer_hr": "0.00", "theoretical_soft_polyol": "0.00", "theoretical_hard_polyol_conv": "0.00" }];

    const plotData = resultData?.data || sampleData;
    const tooltipColumns = resultData?.columns || sampleColumns;

    plotData.sort((a, b) => a.cost - b.cost);

    const maxCost = Math.max(...plotData.map(item => item.cost));
    const maxCarbon = Math.max(...plotData.map(item => item.carbon_footprint));

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    {tooltipColumns.map((item, index) => (
                        <p className="label">{`${item}: ${payload[0].payload[item]}`}</p>
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
