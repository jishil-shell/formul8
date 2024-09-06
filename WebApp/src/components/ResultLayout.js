import React, { useState, useMemo, useEffect } from 'react';

import DownloadPanel from './DownloadPanel';
import KeyValueLayout from './KeyValueLayout';
import SeparatorLine from './SeparatorLine';
import CollapsibleGrid from './grids/CollapsibleGrid';
import ChartPanel from './ChartPanel';

const ResultLayout = ({ filterValues, inputData, resultData }) => {

    const [costValue, setCostValue] = useState('');
    const [carbonFootprintValue, setCarbonFootprintValue] = useState('');
    const [ingredientsResults, setIngredientsResults] = useState([]);
    const [responseResults, setResponseResults] = useState([]);
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

    useEffect(() => {
        console.log(resultData)
        let ingredientsData = inputData?.ingredients || {};
        let responsesData = inputData?.responses || {};
        let ingredientsResultsList = [];
        let responseResultsList = [];
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
        }
        setPolyolValue(polyol);
        setNonPolyolValue(nonPolyol);
        setIngredientsResults(ingredientsResultsList);

        for (let r in responsesData) {
            let response = responsesData[r]?.latex_label || '';
            let key = 'responses_expression[' + r + ']';
            let value = resultData?.expressions && resultData?.expressions[key] && resultData?.expressions[key]?.value ? resultData?.expressions[key]?.value.toFixed(2) : '0.00';
            responseResultsList.push({
                response: response,
                value: value
            })
        }
        setResponseResults(responseResultsList);

    }, [inputData, resultData]);

    return (
        (resultData && resultData.expressions) ? (
            filterValues?.action === 'generate_cost_vs_carbon_plot' ? (
                <>
                    <h3 style={{ textAlign: 'left' }}>Cost Versus Carbon Plot</h3>
                    <ChartPanel />
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

                        <CollapsibleGrid title={'Tabular View of Quantities of All Ingredients'} columnDefs={ingredientsResultsColumnDefs} rowData={ingredientsResults} />
                    </>

                    <SeparatorLine />

                    <>
                        <h3 style={{ textAlign: 'left' }}>Foam Properties</h3>



                        <CollapsibleGrid title={'Tabular View of Response Results'} columnDefs={responseResultsColumnDefs} rowData={responseResults} />
                    </>

                    <SeparatorLine />

                    {
                        (filterValues?.run_type === 'optimization' && filterValues.theoretical_property === "variable") &&
                        <>
                            <h3 style={{ textAlign: 'left' }}>Theoretical Polyol Property Results</h3>

                            <CollapsibleGrid title={'Theoretical Polyol Property Results'} columnDefs={responseResultsColumnDefs} rowData={responseResults} gridOpen={true} />
                        </>
                    }

                    <SeparatorLine />
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