import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { useData } from '../../context/DataContext';
import { toast, Toaster } from 'react-hot-toast';

const ResponseConstraintGrid = ({ foamType, onGridUpdate }) => {
    const gridRef = useRef();
    let [rowData, setRowData] = useState([]);
    const { jsonData, setJsonData } = useData();

    useEffect(() => {
        let responsesData = jsonData?.responses || {};
        let data = [];
        let id = 0;
        let selectedRowIds = [];
        for (var i in responsesData) {
            ++id;
            data.push({
                id: id,
                response: i,
                description: responsesData[i].description,
                label: responsesData[i].latex_label,
                units: responsesData[i].units,
                min: foamType === 'HRSlab' ? responsesData[i].low_bound_hr.toFixed(2) : responsesData[i].low_bound_conv.toFixed(2),
                max: foamType === 'HRSlab' ? responsesData[i].high_bound_hr.toFixed(2) : responsesData[i].high_bound_conv.toFixed(2),
                low_bound_user : responsesData[i].low_bound_user.toFixed(2),
                high_bound_user : responsesData[i].high_bound_user.toFixed(2),
                selected: responsesData[i].active_constraint,
            })
            if (responsesData[i].active_constraint) {
                selectedRowIds.push(id)
            }
        }
        setRowData(data);
        setTimeout(() => {
            if (gridRef.current) {
                gridRef.current.api.forEachNode((node) => {
                    node.setSelected(selectedRowIds.includes(node.data.id));
                });
            }
        }, 0);
    }, [jsonData]);


    // Get row ID (useful for handling selection state)
    const getRowNodeId = (data) => data.id; // Assuming each item has a unique `id` field

    const columnDefs = useMemo(() => {
        const columns = [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                field: 'select',
                headerName: '',
                width: 50,
                headerCheckboxSelectionFilteredOnly: true,
                cellStyle: { textAlign: 'center', backgroundColor: '#FFF' }
            },
            { field: 'response', editable: false, headerName: 'Response', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'min', editable: false, headerName: 'Min', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'max', editable: false, headerName: 'Max', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'low_bound_user', editable: true, headerName: 'Low Bound', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#FFF'}) },
            { field: 'high_bound_user', editable: true, headerName: 'High Bound', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#FFF'})}
        ];

        return columns;
    }, []);

    const onCellValueChanged = (params) => {
        let columnKey = params?.colDef?.field;
        let minValue = parseFloat(params?.data?.min);
        let maxValue = parseFloat(params?.data?.max);
        let msg = "";
        if(params.value < minValue || params.value > maxValue) {
            msg = "Value should be between "+ minValue.toFixed(2) + " and "+ maxValue.toFixed(2);
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
            if(jsonData.responses[params?.data?.response][columnKey] !== parseFloat(params.value)) {
                jsonData.responses[params?.data?.response][columnKey] = parseFloat(params.value);
                setJsonData(jsonData);
            }
            onGridUpdate(rowData);
        }
    };

    const onSelectionChanged = (event) => {
        if (event?.source === 'uiSelectAllFiltered') {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            const selectedRowIds = selectedNodes.map(node => node.data.id);
            const updatedData = rowData.map(item => {
                jsonData.responses[item?.response].active_constraint = (selectedRowIds.includes(item.id) ? true : false);
                return { ...item, selected: (selectedRowIds.includes(item.id) ? true : false) };
            });
            if (JSON.stringify(rowData) !== JSON.stringify(updatedData)) {
                setRowData(updatedData);
                setJsonData(jsonData);
                onGridUpdate(updatedData, 'update');
                setTimeout(() => {
                    gridRef.current.api.forEachNode((node) => {
                        node.setSelected(selectedRowIds.includes(node.data.id));
                    });
                }, 0);;
            }
        }
    };

    const onRowSelected = (event) => {
        if(event?.source === 'checkboxSelected') {
            const activeResponseIndex = rowData.findIndex(p => p.response === event?.data?.response);
            if(activeResponseIndex >= 0 && rowData[activeResponseIndex]?.selected !==   event.node.selected) {
                rowData[activeResponseIndex].selected = event.node.selected;
                setRowData(rowData);
                jsonData.responses[rowData[activeResponseIndex]?.response].active_constraint = event.node.selected;
                setJsonData(jsonData);
            }
        }
    };

    const onGridReady = () => {
        onGridUpdate(rowData, 'init');
    };

    return (
        <>
            <h3 style={{ textAlign: 'left' }}>Response Constraints</h3>
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressRowClickSelection={true}
                    suppressRowDeselection={true}
                    rowSelection="multiple"
                    onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                    defaultColDef={{ filter: true, sortable: true }}
                    onCellValueChanged={onCellValueChanged}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                    onRowSelected={onRowSelected}
                    getRowNodeId={getRowNodeId}
                />
            </div>
            <Toaster position="bottom-center" />
        </>
    );
};

export default ResponseConstraintGrid;
