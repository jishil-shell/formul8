import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { useData } from '../../context/DataContext';

const ConditionsGrid = ({ onGridUpdate }) => {
    
    const [rowData, setRowData] = useState([]);
    const { jsonData, setJsonData } = useData();

    useEffect(() => {
        let conditionsData = jsonData?.conditions || {};
        let initialConditions = ['TCELCIUS', 'TPOLCELCIUS', 'TTDICELCIUS', 'HUMIDITY', 'PMBAR'];
        let data = [];
        for (var c in conditionsData) {
            if (initialConditions.includes(c)) {
                let description = conditionsData[c].description || '';
                if(conditionsData[c].units) {
                    description += ' (' + conditionsData[c].units + ')';
                }
                data.push({
                    key: c,
                    condition: description,
                    value: conditionsData[c].value || ""
                })
            }
        }
        setRowData(data);        
    }, [jsonData]);

    const columnDefs = useMemo(() => [
        { field: 'condition', editable: false, headerName: 'Conditions', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
        { field: 'value', editable: true, headerName: 'Value', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align'}
    ], []);

    const onCellValueChanged = (params) => {
        onGridUpdate(rowData, 'update');
        if(jsonData?.conditions && jsonData.conditions[params.data.key] &&  jsonData.conditions[params.data.key].value !== params.value) {
            jsonData.conditions[params.data.key].value = params.value;
            setJsonData(jsonData);
        }
    };

    const onGridReady = () => {
        onGridUpdate(rowData, 'init');
    };

    return (
        <>
            <h3 style={{ textAlign: 'left' }}>Conditions Inputs</h3>
            <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressRowClickSelection={true}
                    rowSelection="single"
                    onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                    defaultColDef={{ filter: true, sortable: true }}
                    onCellValueChanged={onCellValueChanged}
                    onGridReady={onGridReady}
                />
            </div>
        </>

    );
};

export default ConditionsGrid;
