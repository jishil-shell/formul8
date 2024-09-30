import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [jsonData, setJsonData] = useState([]);
    const [resultData, setResultData] = useState([]);

    return (
        <DataContext.Provider value={{ jsonData, setJsonData, resultData, setResultData, selectedTemplate, setSelectedTemplate}}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);
