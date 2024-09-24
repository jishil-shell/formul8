import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { useData } from '../../context/DataContext';
import { colors } from '@mui/material';

const IngredientGrid = ({ runType, onGridUpdate }) => {
    const gridRef = useRef();
    let [rowData, setRowData] = useState([]);
    const { jsonData, setJsonData } = useData();

    useEffect(() => {
        let ingredientsData = jsonData?.ingredients || {};
        let data = [];
        let id = 0;
        let selectedRowIds = [];
        for (var i in ingredientsData) {
            ++id;
            data.push({
                id: id,
                ingredient: i,
                type: ingredientsData[i].type,
                category: ingredientsData[i].category,
                quantity: ingredientsData[i].quantity,
                price: ingredientsData[i].price,
                carbon_footprint: ingredientsData[i].carbon_footprint,
                selected: ingredientsData[i].available
            })
            if (ingredientsData[i].available) {
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
                cellStyle: { textAlign: 'center', backgroundColor: '#FFF'}                
            },
            { field: 'ingredient', editable: false, headerName: 'Ingredient', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'type', editable: false, headerName: 'Type', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'category', editable: false, headerName: 'Category', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'}) },
            { field: 'price', editable: true, headerName: 'Price ($/kg)', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#FFF'}) },
            { field: 'carbon_footprint', editable: true, headerName: 'Carbon Footprint (kgCO2e/kg)', resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#FFF'})}
        ];

        // Conditionally add the "Quantity" column
        if (runType === 'static') {
            columns.splice(4, 0, {
                field: 'quantity',
                editable: true,
                headerName: 'Quantity (part by weight)',
                resizable: true,
                flex: 1,
                headerClass: 'header-left-align',
                cellClass: 'cell-left-align',
                cellStyle: params => ({backgroundColor: '#FFF'})
            });
        }
        return columns;
    }, [runType]);

    const onCellValueChanged = (params) => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedRowIds = selectedNodes.map(node => node.data.id);
        const updatedData = [...rowData];
        updatedData[params.node.rowIndex][params.colDef.field] = parseFloat(params.value);

        if(jsonData.ingredients[params?.data?.ingredient][params?.colDef?.field] !== parseFloat(params.value)) {
            jsonData.ingredients[params?.data?.ingredient][params?.colDef?.field] = parseFloat(params.value);
            setJsonData(jsonData);
        }

        if (JSON.stringify(rowData) !== JSON.stringify(updatedData)) {
            setRowData(updatedData);
            onGridUpdate(updatedData);
            setTimeout(() => {
                gridRef.current.api.forEachNode((node) => {
                    node.setSelected(selectedRowIds.includes(node.data.id));
                });
            }, 0);;
        }

    };

    const onSelectionChanged = (event) => {
        if (event?.source === 'uiSelectAllFiltered') {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            const selectedRowIds = selectedNodes.map(node => node.data.id);
            const updatedData = rowData.map(item => {
                jsonData.ingredients[item?.ingredient].available = (selectedRowIds.includes(item.id) ? true : false);
                return { ...item, selected: (selectedRowIds.includes(item.id) ? true : false) };
            });
            if (JSON.stringify(rowData) !== JSON.stringify(updatedData)) {
                setRowData(updatedData);
                setJsonData(jsonData);
                onGridUpdate(updatedData, 'update');
            }
        }
    };

    const onRowSelected = (event) => {
        if(event?.source === 'checkboxSelected') {
            const activeIngredientIndex = rowData.findIndex(p => p.ingredient === event?.data?.ingredient);
            if(activeIngredientIndex >= 0 && rowData[activeIngredientIndex]?.selected !==   event.node.selected) {
                rowData[activeIngredientIndex].selected = event.node.selected;
                setRowData(rowData);
                jsonData.ingredients[rowData[activeIngredientIndex]?.ingredient].available = event.node.selected;
                setJsonData(jsonData);
            }
        }
    };

    const onGridReady = () => {
        onGridUpdate(rowData, 'init');
    };

    return (
        <>
            <h3 style={{ textAlign: 'left' }}>Ingredient Inputs</h3>
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
        </>
    );
};

export default IngredientGrid;
