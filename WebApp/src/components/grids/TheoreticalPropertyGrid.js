import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { toast, Toaster } from 'react-hot-toast';
import { useDataContext } from '../../context/DataContext';

const TheoreticalPropertyGrid = ({ onGridUpdate, foamType }) => {
    const [rowData, setRowData] = useState([]);
    const { jsonData, setJsonData } = useDataContext();

    let columns = [];
    useEffect(() => {
        const propertyNames = ['POS', 'SAN', 'SANNEST', 'PIPA', 'HSPIPA', 'PHD', 'SOLIDS', 'Ohbase', 'Ohadj', 'EO', 'Totalweight', 'CFn', 'Cphc', 'Unsat', 'BlowEq', 'GelEq', 'BlowFactor'];
        let ingredientsData = jsonData?.ingredients || {};
        let data = [];
        for (let i in ingredientsData) {
            if (ingredientsData[i]?.theoretical) {
                let item = {
                    ingredient: i
                };
                for (let o in ingredientsData[i]) {
                    if (propertyNames.includes(o)) {
                        let cName = o.toLocaleLowerCase();
                        item[cName] = ingredientsData[i][o]
                    }
                }
                data.push(item)
            }
        }
        setRowData(data);
        columns.push({
            field: 'ingredient', editable: false, headerName: 'Ingredient', resizable: true, minWidth: 250, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'})
        })
    
        propertyNames.forEach((item) => {
            columns.push({
                field: item.toLocaleLowerCase(), editable: true, headerName: item, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align'
            })
        })
    }, [jsonData]);
    

    const columnDefs = useMemo(() => columns, []);

    const onCellValueChanged = (params) => {
        if(jsonData?.ingredients && jsonData?.ingredients[params.data.ingredient]) {
            let minValue, maxValue;
            let columnKey = params.column.colId;
            columnKey = params.colDef.headerName;
            minValue = jsonData?.property_bounds_low?.[params.data.ingredient]?.[columnKey] || '';
            maxValue = jsonData?.property_bounds_high?.[params.data.ingredient]?.[columnKey] || '';
            let msg = "";
            if(minValue && maxValue) {
                if(params.value < minValue || params.value > maxValue) {
                    msg = "Value should be between "+ minValue + " and "+ maxValue;
                }
            } else if(minValue) {
                if(params.value < minValue) {
                    msg = "Value should be greater than "+ minValue;
                }
            } else if(maxValue) {
                if(params.value > maxValue) {
                    msg = "Value should be less than "+ maxValue;
                }
            }
            if(msg) {
                params.node.setDataValue(params.column.colId, params.oldValue);                
                return toast(msg, {
                    style: {
                        background: '#333',
                        color: '#fff',  
                    },
                });
            } else {
                if(jsonData?.ingredients[params.data.ingredient] && jsonData?.ingredients[params.data.ingredient][columnKey] !== params.value) {
                    jsonData.ingredients[params.data.ingredient][columnKey] = parseFloat(params.value);
                    setJsonData(jsonData);
                }
            }
        }
        const updatedData = [...rowData];
        updatedData[params.node.rowIndex][params.colDef.field] = parseFloat(params.value);
        setRowData(updatedData);
        onGridUpdate(updatedData, 'update');
        
    };

    const onGridReady = () => {
        onGridUpdate(rowData, 'init');
    };

    return (
        <>
            <h3 style={{ textAlign: 'left' }}>Theoretical Polyol Property Inputs</h3>
            <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressRowClickSelection={true}
                    rowSelection="single"
                    onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                    defaultColDef={{ filter: true, sortable: true, minWidth: 100 }}
                    onCellValueChanged={onCellValueChanged}
                    onGridReady={onGridReady}
                />
            </div>
            <Toaster position="bottom-center" />
        </>

    );
};

export default TheoreticalPropertyGrid;
