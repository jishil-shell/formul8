import React, { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/Grid.css';
import { toast, Toaster } from 'react-hot-toast';
import { useDataContext } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';

const TheoreticalPropertyGrid = ({ onGridUpdate, foamType }) => {
    
    const { openModal } = useModal();
    const { jsonData, setJsonData } = useDataContext();

    const [rowData, setRowData] = useState([]);
    const [referenceBooleanData, setReferenceBooleanData] = useState([]);
    const [referenceLowBoundData, setReferenceLowBoundData] = useState([]);
    const [referenceHighBoundData, setReferenceHighBoundData] = useState([]);

    let columns = [];
    let refColumns = [];
    useEffect(() => {
        const propertyNames = ['POS', 'SAN', 'SANNEST', 'PIPA', 'HSPIPA', 'PHD', 'SOLIDS', 'Ohbase', 'Ohadj', 'EO', 'Totalweight', 'CFn', 'Cphc', 'Unsat', 'BlowEq', 'GelEq', 'BlowFactor'];
        let ingredientsData = jsonData?.ingredients || {};
        let data = [];
        let booleanData = [];
        let lowData = [];
        let highData = [];
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
                lowData.push({name : i, ...jsonData?.property_bounds_low?.[i]})
                highData.push({name : i, ...jsonData?.property_bounds_high?.[i]})
            }
        }
        for (let i in jsonData?.property_booleans) {
            booleanData.push({name : i, ...jsonData?.property_booleans?.[i]})
        }
        
        setRowData(data);
        setReferenceLowBoundData(lowData);
        setReferenceHighBoundData(highData);
        setReferenceBooleanData(booleanData);
        columns.push({
            field: 'ingredient', editable: false, headerName: 'Ingredient', resizable: true, minWidth: 250, headerClass: 'header-left-align', cellClass: 'cell-left-align', cellStyle: params => ({backgroundColor: '#E5E4E2'})
        })
        refColumns.push({
            field: 'name', editable: false, headerName: 'Name', resizable: true, minWidth: 250, headerClass: 'header-left-align', cellClass: 'cell-left-align'
        })
    
        propertyNames.forEach((item) => {
            columns.push({
                field: item.toLocaleLowerCase(), editable: true, headerName: item, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align'
            })
            refColumns.push({
                field: item, editable: false, headerName: item, resizable: true, headerClass: 'header-left-align', cellClass: 'cell-left-align', minWidth: 100
            })
        })
    }, [jsonData]);
    

    const columnDefs = useMemo(() => columns, []);
    const referenceColumnDefs = useMemo(() => refColumns, []);

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

    const propertyBoundsLowClick = (action) => {
        openModal({
            title: 'Property Bounds Low',
            grid: true,
            showClose: true,
            columnDefs: referenceColumnDefs,
            rowData: referenceLowBoundData
        });
    };

    const propertyBoundsHighClick = (action) => {
        openModal({
            title: 'Property Bounds High',
            grid: true,
            showClose: true,
            columnDefs: referenceColumnDefs,
            rowData: referenceHighBoundData
        });
    };
    const BooleanInfoClick = (action) => {
        openModal({
            title: 'Boolean Info',
            grid: true,
            showClose: true,
            columnDefs: referenceColumnDefs,
            rowData: referenceBooleanData
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px' }}>
                <h3 style={{ textAlign: 'left' }}>Theoretical Polyol Property Inputs</h3>
                <div>
                <button className="reference-info-button" onClick={propertyBoundsLowClick}>
                    Property Bounds Low
                </button>
                <button className="reference-info-button" onClick={propertyBoundsHighClick}>
                    Property Bounds High
                </button>
                <button className="reference-info-button" onClick={BooleanInfoClick}>
                    Boolean Info
                </button>
                </div>
                
            </div>
            <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressRowClickSelection={true}
                    rowSelection="single"
                    onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                    defaultColDef={{ filter: true, floatingFilter: true, sortable: true, minWidth: 100 }}
                    onCellValueChanged={onCellValueChanged}
                    onGridReady={onGridReady}
                />
            </div>
            <Toaster position="bottom-center" />
        </>

    );
};

export default TheoreticalPropertyGrid;
