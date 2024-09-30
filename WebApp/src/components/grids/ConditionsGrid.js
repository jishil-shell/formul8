import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { useDataContext } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';

const ConditionsGrid = ({ onGridUpdate }) => {

    const [rowData, setRowData] = useState([]);
    const [referenceRowData, setReferenceRowData] = useState([]);
    const { jsonData, setJsonData } = useDataContext();
    const { openModal } = useModal();
    useEffect(() => {
        let conditionsData = jsonData?.conditions || {};
        let initialConditions = ['TCELCIUS', 'TPOLCELCIUS', 'TTDICELCIUS', 'HUMIDITY', 'PMBAR'];
        let data = [];
        let refData = [];
        for (var c in conditionsData) {
            if (initialConditions.includes(c)) {
                let description = conditionsData[c].description || '';
                if (conditionsData[c].units) {
                    description += ' (' + conditionsData[c].units + ')';
                }
                data.push({
                    key: c,
                    condition: description,
                    value: conditionsData[c].value || ""
                })
            }
            refData.push({
                name : c,
                description : conditionsData[c].description,
                unit : conditionsData[c].units,
                value : conditionsData[c].value
            })
        }
        setRowData(data);
        setReferenceRowData(refData);
    }, [jsonData]);

    const columnDefs = useMemo(() => [
        { field: 'condition', editable: false, headerName: 'Conditions', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({ backgroundColor: '#E5E4E2' }) },
        { field: 'value', editable: true, headerName: 'Value', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' }
    ], []);

    const referenceColumnDefs = useMemo(() => [
        { field: 'name', editable: false, headerName: 'Name', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { field: 'description', editable: false, headerName: 'Description', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { field: 'unit', editable: false, headerName: 'Unit', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
        { field: 'value', editable: false, headerName: 'Value', resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align' },
    ], []);

    const onCellValueChanged = (params) => {
        onGridUpdate(rowData, 'update');
        if (jsonData?.conditions && jsonData.conditions[params.data.key] && jsonData.conditions[params.data.key].value !== params.value) {
            jsonData.conditions[params.data.key].value = params.value;
            setJsonData(jsonData);
        }
    };

    const onGridReady = () => {
        onGridUpdate(rowData, 'init');
    };

    const referenceInfoClick = () => {
        openModal({
            title: 'Conditions Info',
            grid: true,
            showClose: true,
            columnDefs: referenceColumnDefs,
            rowData: referenceRowData
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px' }}>
                <h3 style={{ textAlign: 'left' }}>Conditions Inputs</h3>
                <button className="reference-info-button" onClick={referenceInfoClick}>
                    Reference Info
                </button>
            </div>

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
