import React, { useState, useEffect } from 'react';

import DownloadPanel from './DownloadPanel';
import KeyValueLayout from './KeyValueLayout';
import SeparatorLine from './SeparatorLine';
import CollapsibleGrid from './grids/CollapsibleGrid';
import ChartPanel from './ChartPanel';
import HorizontalBarChart from './HorizontalBarChart';


const ResultLayout = ({ filterValues, inputData, resultData }) => {

    const [costValue, setCostValue] = useState('');
    const [carbonFootprintValue, setCarbonFootprintValue] = useState('');
    const [ingredientsResults, setIngredientsResults] = useState([]);
    const [responseResults, setResponseResults] = useState([]);
    const [responseResultsPlot, setResponseResultsPlot] = useState([]);
    const [theoreticalPropertiesResults, setTheoreticalPropertiesResults] = useState([]);
    const [polyolValue, setPolyolValue] = useState({});
    const [nonPolyolValue, setNonPolyolValue] = useState({});
    const [isocyanateValue, setIsocyanateValue] = useState({});

    const propertyNames = ['POS', 'SAN', 'SANNEST', 'PIPA', 'HSPIPA', 'PHD', 'SOLIDS', 'Ohbase', 'Ohadj', 'EO', 'Totalweight', 'CFn', 'Cphc', 'Unsat', 'BlowEq', 'GelEq', 'BlowFactor'];

    const ingredientsResultsColumnDefs = [
        { headerName: 'Ingredient', field: 'ingredient', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { headerName: 'Type', field: 'type', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { headerName: 'Category', field: 'category', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { headerName: 'Quantity (part by weight)', field: 'quantity_result', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
    ];

    const responseResultsColumnDefs = [
        { headerName: 'Response', field: 'response', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { headerName: 'Value', field: 'value', editable: false, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
    ]

    const theoreticalPropertiesResultsColumnDefs = [
        { headerName: 'Ingredient', field: 'ingredient', editable: false, resizable: true, minWidth: 250, headerClass: 'header-left-align', cellClass: 'cell-left-align' }
    ]

    if (filterValues?.run_type === 'optimization' && filterValues.theoretical_property === "variable") {
        propertyNames.forEach((item) => {
            theoreticalPropertiesResultsColumnDefs.push({ headerName: item, field: item, editable: false, resizable: true, minWidth: 100, headerClass: 'header-left-align', cellClass: 'cell-left-align' });
        })
    }

    let costVsCarbonPlotColumnDefs = [];
    if (filterValues?.action === 'generate_cost_vs_carbon_plot' && resultData.columns) {
        resultData.columns.forEach((item) => {
            costVsCarbonPlotColumnDefs.push({ headerName: item, field: item, editable: false, resizable: true, minWidth: 100, headerClass: 'header-left-align', cellClass: 'cell-left-align' });
        })
    }

    useEffect(() => {
        let ingredientsData = inputData?.ingredients || {};
        let responsesData = inputData?.responses || {};
        let ingredientsResultsList = [];
        let responseResultsList = [];
        let responseResultsPlotData = [];
        let theoreticalPropertiesResultsList = [];
        let polyol = {};
        let nonPolyol = {};
        let isocyanate = {};
        let id = 0;
        let quantityResult = '';
        let cost = (resultData.expressions?.cost_exp?.value) ? (resultData.expressions?.cost_exp?.value).toFixed(0) : '';
        if (cost) {
            cost += ' /kgfoam';
        }
        setCostValue(cost);
        let carbonExp = (resultData.expressions?.carbon_footprint_exp?.value) ? (resultData.expressions?.carbon_footprint_exp?.value).toFixed(0) : '';
        if (carbonExp) {
            carbonExp += ' /kgCO2e/kgfeed';
        }
        setCarbonFootprintValue(carbonExp);

        isocyanate = {
            'Isocyanate': resultData?.expressions && resultData?.expressions['intermediate_variables[isopbw]'] && resultData?.expressions['intermediate_variables[isopbw]'].value ? resultData?.expressions['intermediate_variables[isopbw]'].value.toFixed(2) + ' part by weight' : '',
            // isopbwW : resultData?.expressions['intermediate_variables[isopbwW]'].value + ' part by weight',
            // isopbwD : resultData?.expressions['intermediate_variables[isopbwD]'].value + ' part by weight',
            // isopbwP : resultData?.expressions['intermediate_variables[isopbwP]'].value + ' part by weight',
            'Solids': resultData?.expressions && resultData?.expressions['blend_properties[SOLIDS]'] && resultData?.expressions['blend_properties[SOLIDS]'].value ? resultData?.expressions['blend_properties[SOLIDS]'].value.toFixed(2) + ' %' : ''
        }
        setIsocyanateValue(isocyanate);

        for (let i in ingredientsData) {
            ++id;
            if (resultData?.variables && resultData?.variables['ingredient_quantities[' + i + ']'] && resultData?.variables['ingredient_quantities[' + i + ']'].value > 0) {
                quantityResult = resultData?.variables['ingredient_quantities[' + i + ']'].value;
            } else {
                quantityResult = 0;
            }
            ingredientsResultsList.push({
                id: id,
                ingredient: i,
                type: ingredientsData[i].type,
                category: ingredientsData[i].category,
                quantity: ingredientsData[i].quantity,
                quantity_result: quantityResult,
                price: ingredientsData[i].price,
                carbonFootprint: ingredientsData[i].carbon_footprint,
            })

            if (quantityResult > 0) {
                if (ingredientsData[i].type === "polyol") {
                    polyol[i] = quantityResult.toFixed(2) + ' part by weight';
                } else if (!["TD80", "TD65"].includes(i)) {
                    nonPolyol[i] = quantityResult.toFixed(2) + ' part by weight';
                }
            }

            if (filterValues?.run_type === 'optimization' && filterValues.theoretical_property === "variable") {
                if (resultData?.inputs?.ingredients && resultData?.inputs?.ingredients[i]) {
                    if (resultData?.inputs?.ingredients[i]?.theoretical && resultData?.inputs?.ingredients[i]?.available) {
                        let row = {
                            ingredient: i
                        }
                        let key = '';
                        propertyNames.forEach((item) => {
                            key = 'ingredient_properties[' + item + ',' + i + ']';
                            row[item] = resultData?.variables[key] && resultData?.variables[key].value ? resultData?.variables[key] && resultData?.variables[key].value.toFixed(4) : '0.0000'
                        })
                        theoreticalPropertiesResultsList.push(row);
                    }
                }
            }
        }
        setPolyolValue(polyol);
        setNonPolyolValue(nonPolyol);
        setIngredientsResults(ingredientsResultsList);
        setTheoreticalPropertiesResults(theoreticalPropertiesResultsList);

        for (let r in responsesData) {
            let response = responsesData[r]?.latex_label || '';
            let key = 'responses_expression[' + r + ']';
            let value = resultData?.expressions && resultData?.expressions[key] && resultData?.expressions[key]?.value ? resultData?.expressions[key]?.value.toFixed(2) : '0.00';
            responseResultsList.push({
                response: response,
                value: value
            })

            responseResultsPlotData.push({
                "response": r,
                "label": inputData?.responses[r]?.latex_label,
                "low_user": inputData?.responses[r]?.low_bound_user,
                "high_user": inputData?.responses[r]?.high_bound_user,
                "active_constraint": inputData?.responses[r]?.active_constraint,
                "low_absolute": filterValues?.foam_type === 'HRSlab' ? inputData?.responses[r]?.low_bound_hr : inputData?.responses[r]?.low_bound_conv,
                "high_absolute": filterValues?.foam_type === 'HRSlab' ? inputData?.responses[r]?.high_bound_hr : inputData?.responses[r]?.high_bound_conv,
                "result": resultData?.expressions && resultData?.expressions[key] && resultData?.expressions[key]?.value ? resultData?.expressions[key]?.value.toFixed(2) : '0.00',
            })
        }
        setResponseResults(responseResultsList);
        setResponseResultsPlot(responseResultsPlotData);

    }, [inputData, resultData, filterValues]);

    return (
        (resultData && (resultData.expressions || resultData.data)) ? (
            filterValues?.action === 'generate_cost_vs_carbon_plot' ? (
                <>
                    <DownloadPanel />
                    <>
                        <h3 style={{ textAlign: 'left' }}>Cost Versus Carbon Plot</h3>

                        <ChartPanel title={'Cost vs. Carbon Footprint'} xName={'CARBON FOOTPRINT (kgCO2e/Kgfeed)'} yName={'COST ($/Kgfoam)'} resultData={resultData} />

                        <CollapsibleGrid title={'Tabular View of Cost Versus Carbon Plot Data'} columnDefs={costVsCarbonPlotColumnDefs} rowData={resultData.data} gridOpen={true} />
                    </>
                </>

            ) : (
                <>
                    <DownloadPanel />
                    <>
                        <h3 style={{ textAlign: 'left' }}>Key Metrics</h3>

                        <KeyValueLayout data={
                            {
                                'Cost': costValue,
                                'Carbon Footprint': carbonFootprintValue
                            }
                        } />

                        <p style={{ color: 'red', textAlign: 'left' }}>Please note: The results and units displayed here are not fully validated and should be used with caution. They are subject to change upon further review.</p>
                    </>

                    <SeparatorLine />

                    <>
                        <h3 style={{ textAlign: 'left' }}>Ingredient Quantities</h3>

                        <div style={{ textAlign: 'left' }}>
                            <p><b>Polyols</b></p>
                            <KeyValueLayout data={polyolValue} />
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <p><b>Others</b></p>
                            <KeyValueLayout data={nonPolyolValue} />
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <p><b>Isocyanate</b></p>
                            <KeyValueLayout data={isocyanateValue} />
                        </div>

                        <CollapsibleGrid title={'Tabular View of Quantities of All Ingredients'} columnDefs={ingredientsResultsColumnDefs} rowData={ingredientsResults} gridOpen={true} />
                    </>

                    <SeparatorLine />

                    <>
                        <h3 style={{ textAlign: 'left' }}>Foam Properties</h3>

                        {
                            filterValues?.run_type === 'optimization' &&
                            <div style={{ textAlign: 'left', fontSize : 20, marginBottom : 25 }}>Note : The shaded area represent the user set bounds for the constraint</div>
                        }

                        <HorizontalBarChart runType = {filterValues.run_type} data = {responseResultsPlot}/>

                        <CollapsibleGrid title={'Tabular View of Response Results'} columnDefs={responseResultsColumnDefs} rowData={responseResults} gridOpen={true} />
                    </>

                    <SeparatorLine />

                    {
                        (filterValues?.run_type === 'optimization' && filterValues.theoretical_property === "variable") &&
                        <>
                            <h3 style={{ textAlign: 'left' }}>Theoretical Polyol Property Results</h3>

                            <CollapsibleGrid title={'Theoretical Polyol Property Results'} columnDefs={theoreticalPropertiesResultsColumnDefs} rowData={theoreticalPropertiesResults} gridOpen={true} />
                        </>
                    }
                </>
            )
        ) : (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: '24px',
                color: '#888'
            }}>
                Results not available yet, do the Action and check!
            </div>
        )
    );
};

export default ResultLayout;