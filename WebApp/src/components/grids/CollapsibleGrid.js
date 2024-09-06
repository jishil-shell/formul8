import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const CollapsibleGrid = ({ title, columnDefs, rowData, gridOpen }) => {
    
    const [isOpen, setIsOpen] = useState(gridOpen || false);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <div
                style={{
                    width: "98%",
                    backgroundColor: "#f0f0f0",
                    padding: "15px",
                    cursor: "pointer",
                    textAlign: "left",
                    marginTop: 20
                }}
                onClick={toggleCollapse}
            >
                <b>{title + ' - ' + (isOpen ? "Collapse" : "Expand")}</b>
            </div>
            {isOpen && (
                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%', flexGrow: 1, marginTop: 2 }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        suppressRowClickSelection={true}
                        rowSelection="single"
                        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                        defaultColDef={{ filter: true, sortable: true }}
                    />
                </div>
            )}
        </div>
    );
};

export default CollapsibleGrid;
