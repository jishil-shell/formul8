import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [userName, setUserName] = useState(''); //INJKP0 , INSATD
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [jsonData, setJsonData] = useState([]);
    const [resultData, setResultData] = useState([]);

    return (
        <DataContext.Provider value={{ jsonData, setJsonData, resultData, setResultData, userName, setUserName, selectedTemplate, setSelectedTemplate}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
