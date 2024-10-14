import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { useDataContext } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { toast,Toaster } from 'react-hot-toast';

const IngredientGrid = ({ runType, onGridUpdate }) => {
    const gridRef = useRef();
    const { openModal } = useModal();
    let [rowData, setRowData] = useState([]);
    const [referenceRowData, setReferenceRowData] = useState([]);
    const { jsonData, setJsonData } = useDataContext();

    useEffect(() => {
        let ingredientsData = jsonData?.ingredients || {};
        let data = [];
        let refData = [];
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
            refData.push({name : i, ...ingredientsData[i]})
        }
        setRowData(data);
        setReferenceRowData(refData);
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

    const referenceColumnDefs = useMemo(() => {
        let columnNames = ['name',...Object.keys(jsonData.ingredients[Object.keys(jsonData?.ingredients)[0]])];
        let columns = [];
        columnNames.forEach((item) => {
            columns.push({ field: item, editable: false, headerName: item.toUpperCase(), resizable: true, flex: 1, headerClass: 'header-left-align', cellClass: 'cell-left-align', minWidth:150 })
        })
        return columns;
    }, []);

    const onCellValueChanged = (params) => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedRowIds = selectedNodes.map(node => node.data.id);
        const updatedData = [...rowData];
        const columnName = params.colDef.field;
        updatedData[params.node.rowIndex][columnName] = parseFloat(params.value);
        let polyolTotalQuantity = 0;
        if(runType === 'static' && columnName === 'quantity') {
            selectedNodes.forEach((item) => {
                if(item.data.type === 'polyol' && item.data.selected && item.data.quantity > 0) {
                    polyolTotalQuantity += parseFloat(item.data.quantity)
                }
            })
        }

        if(polyolTotalQuantity > 100) {
            params.node.setDataValue(params.column.colId, params.oldValue);
            let msg = 'Total quantity of the Polyol should be 100'
            return toast(msg, {
                style: {
                    background: '#333',
                    color: '#fff',
                    minWidth: '40%'
                },
            });
        }
        

        if(jsonData.ingredients[params?.data?.ingredient][columnName] !== parseFloat(params.value)) {
            jsonData.ingredients[params?.data?.ingredient][columnName] = parseFloat(params.value);
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

    const referenceInfoClick = () => {
        openModal({
            title: 'Ingredients Info',
            grid: true,
            showClose: true,
            columnDefs: referenceColumnDefs,
            rowData: referenceRowData
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px' }}>
                <h3 style={{ textAlign: 'left' }}>Ingredient Inputs</h3>
                <button className="reference-info-button" onClick={referenceInfoClick}>
                    Reference Info
                </button>
            </div>
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

export default IngredientGrid;
