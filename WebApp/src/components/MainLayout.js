import React, { useState } from 'react';
import FilterPanel from './FilterPanel';
import ConditionsGrid from './grids/ConditionsGrid';
import IngredientGrid from './grids/IngredientGrid';
import TheoreticalPropertyGrid from './grids/TheoreticalPropertyGrid';
import Header from './Header';
import TabsComponent from './TabsComponent';
import SeparatorLine from './SeparatorLine';
import TextInput from './TextInput';
import './css/MainLayout.css';
import { Typography } from '@mui/material';
import { solverOptimalFormulation } from '../api/api';
import ResultLayout from './ResultLayout';
import { useLoader } from '../context/LoaderContext';
import { toast, Toaster } from 'react-hot-toast';
import ResponseConstraintGrid from './grids/ResponseConstraintGrid';
import LoginPopup from './LoginPopup';
import { saveTemplateApi, deleteTemplateApi } from '../api/api';
import TemplateNamePopup from './TemplateNamePopup';
import { useModal } from '../context/ModalContext';
import { useUserContext } from '../context/UserContext';
import { useDataContext } from '../context/DataContext';
import TemplateSharePopup from './TemplateSharePopup';


const MainLayout = () => {
    const { jsonData, setJsonData } = useDataContext();
    const { resultData, setResultData } = useDataContext();
    const { selectedTemplate } = useDataContext();
    const { setLoading } = useLoader();
    const { openModal } = useModal();
    const { user, loginUser } = useUserContext();

    const tabs = ['Inputs', 'Results'];
    const [activeTab, setActiveTab] = useState(0);
    const [filterValues, setFilterValues] = useState({});
    const [reloadTemplates, setReloadTemplates] = useState(true);
    const [isocyanateValues, setIsocyanateValues] = useState({});
    const [conditionsInputs, setConditionsInputs] = useState([]);
    const [ingredientInputs, setIngredientInputs] = useState({});
    const [theoreticalPropertyInputs, setTheoreticalPropertyInputs] = useState({});
    const [responseConstraint, setResponseConstraint] = useState({});
    const [showTemplateNamePopup, setShowTemplateNamePopup] = useState(false);
    const [showTemplateSharePopup, setShowTemplateSharePopup] = useState(false);

    const loadData = (jsonData) => {
        setJsonData(jsonData);
        let updatedIsocyanateValues = {
            price: jsonData?.conditions?.isocyanate_price?.value || "",
            index: parseFloat(jsonData?.conditions?.isocyanate_index?.value) || 0,
            description: parseFloat(jsonData?.conditions?.isocyanate_index?.description) || 'Isocyanate Index',
            min: jsonData?.conditions?.isoindex_bound_low?.value ? parseFloat(jsonData?.conditions?.isoindex_bound_low?.value) : 0,
            max: jsonData?.conditions?.isoindex_bound_high?.value ? parseFloat(jsonData?.conditions?.isoindex_bound_high?.value) : 0,
        };
        setIsocyanateValues(updatedIsocyanateValues)
        setReloadTemplates(false)
    };

    const handleFilterChange = (filterType, filterValue) => {
        let updatedFilterValues = filterValues;
        updatedFilterValues[filterType] = filterValue;
        setFilterValues(updatedFilterValues);
    };

    const handleIsocyanatePriceChange = (event) => {
        let updatedObj = { ...isocyanateValues, price: event.target.value };
        setIsocyanateValues(updatedObj);
    };

    const handleIsocyanateIndexChange = (event) => {
        let updatedObj = { ...isocyanateValues, index: event.target.value };
        setIsocyanateValues(updatedObj);
    };

    const handleIsocyanateIndexBlur = () => {
        if (isocyanateValues.index < isocyanateValues.min || isocyanateValues.index > isocyanateValues.max) {
            let msg = "Value should be between " + isocyanateValues.min + " and " + isocyanateValues.max;
            let updatedObj = { ...isocyanateValues, index: jsonData?.conditions?.isocyanate_index?.value };
            setIsocyanateValues(updatedObj);
            return toast(msg, {
                style: {
                    background: '#333',
                    color: '#fff',
                },
            });
        } else {
            jsonData.conditions.isocyanate_index.value = isocyanateValues.index;
            setJsonData(jsonData);
        }
    };

    const handleConditionsInputsChange = (data, action) => {
        setConditionsInputs(data)
    }

    const handleIngredientInputsChange = (data) => {
        setIngredientInputs(data)
    }

    const handleResponseConstraintGridChange = (data, action) => {
        setResponseConstraint(data)
    }

    const handleTheoreticalPropertyInputsChange = (data) => {
        setTheoreticalPropertyInputs(data)
    }

    const formatRequestData = async (action) => {
        let requestData = {
            objective_type: filterValues.objective_type || "cost",
            objective_sense: filterValues.objective_sense || "min",
            carbon_footprint_limit: filterValues.pareto_points ? filterValues.pareto_points : null
        };
        let totalPolyolQuantity = 0;

        let updatedInputData = JSON.parse(JSON.stringify(jsonData));

        updatedInputData["conditions"]["isocyanate_price"]["value"] = isocyanateValues.price.toString();
        updatedInputData["conditions"]["isocyanate_index"]["value"] = isocyanateValues.index.toString();

        conditionsInputs.forEach((item) => {
            if (updatedInputData["conditions"] && updatedInputData["conditions"][item.key]) {
                updatedInputData["conditions"][item.key].value = item.value
            }
        })

        updatedInputData["conditions"]['FOAM_TYPE'].value = filterValues.foam_type;

        if (filterValues.run_type === "optimization") {
            updatedInputData["conditions"]['optimization_run'].value = true;
            updatedInputData["conditions"]['single_polyol_per_type'].value = filterValues.polyol_type === "single" ? true : false;
            updatedInputData["conditions"]['variable_theoretical_properties'].value = filterValues.theoretical_property === "variable" ? true : false;
        } else {
            updatedInputData["conditions"]['optimization_run'].value = false;
            requestData.objective_type = "cost";
            requestData.objective_sense = "min";
        }

        ingredientInputs.forEach((item) => {
            if (item.selected) {
                updatedInputData["ingredients"][item.ingredient].available = true;
                updatedInputData["ingredients"][item.ingredient].price = parseFloat(item.price);
                updatedInputData["ingredients"][item.ingredient].carbon_footprint = parseFloat(item.carbon_footprint);
                if (filterValues?.run_type === 'static') {
                    updatedInputData["ingredients"][item.ingredient].quantity = parseFloat(item.quantity);
                }
                if(item.type === 'polyol' && item.quantity > 0) {
                    totalPolyolQuantity += parseFloat(item.quantity)
                }
            } else {
                updatedInputData["ingredients"][item.ingredient].available = false;
            }

        });

        if (filterValues.theoretical_property === "fixed") {
            theoreticalPropertyInputs.forEach((item) => {
                if (updatedInputData["ingredients"][item.ingredient]) {
                    for (let i in item) {
                        if (updatedInputData["ingredients"][item.ingredient][i]) {
                            updatedInputData["ingredients"][item.ingredient][i] = item[i];
                        }
                    }
                }
            });
        }
        requestData.input_json = updatedInputData;
        if(action === 'calculate_properties') {
            requestData.total_polyol_quantity = totalPolyolQuantity;
        }        
        return requestData;
    }

    function removeEmptyColumns(data, columns) {
        let validColumns = [];
        data.forEach(obj => {
            Object.keys(obj).forEach(key => {
                if (obj[key] && obj[key] !== "0.00") {
                    if (!validColumns.includes(key)) {
                        validColumns.push(key)
                    }
                }
            });
        });
        return columns.filter(item => validColumns.includes(item));;
    }

    const plotPareto = async (callback) => {

        try {
            const minCarbonParams = await formatRequestData();
            minCarbonParams.objective_type = "carbon";
            minCarbonParams.objective_sense = "min";
            minCarbonParams.carbon_footprint_limit = null;
            let minCarbonFootprintResults = await solverOptimalFormulation(minCarbonParams);
            let minCarbonFootprintValue = minCarbonFootprintResults?.expressions?.carbon_footprint_exp?.value;

            const minCostParams = await formatRequestData();
            minCostParams.objective_type = "cost";
            minCostParams.objective_sense = "min";
            minCostParams.carbon_footprint_limit = null;
            let minCostResults = await solverOptimalFormulation(minCostParams);
            let minCostValue = minCostResults?.expressions?.carbon_footprint_exp?.value;

            let ingredientNames = minCarbonFootprintResults?.inputs?.ingredients ? Object.keys(minCarbonFootprintResults?.inputs?.ingredients) : [];
            let columnNames = ["cost", "carbon_footprint", "carbon_footprint_limit", "isocyanate_index"];

            let quantityResults = {};

            ingredientNames.forEach((inc) => {
                quantityResults[inc] = minCarbonFootprintResults?.inputs?.ingredients[inc]?.quantity || '0.00'
            })
            let carbonFootprintLimit, results, row;
            let finalList = []
            for (let i = 0; i < filterValues.pareto_points; i++) {
                if (i === 0) {
                    carbonFootprintLimit = minCarbonFootprintValue;
                    results = minCarbonFootprintResults;
                } else {
                    carbonFootprintLimit = minCarbonFootprintValue + i * (minCostValue - minCarbonFootprintValue
                    ) / (filterValues.pareto_points - 1);
                    const minCostParams = await formatRequestData();
                    minCostParams.objective_type = "cost";
                    minCostParams.objective_sense = "min";
                    minCostParams.carbon_footprint_limit = carbonFootprintLimit;
                    results = await solverOptimalFormulation(minCostParams);
                }

                if (results?.expressions?.cost_exp?.value) {
                    row = {
                        "cost": results?.expressions?.cost_exp?.value.toFixed(0),
                        "carbon_footprint": results?.expressions?.carbon_footprint_exp?.value.toFixed(0),
                        "carbon_footprint_limit": carbonFootprintLimit.toFixed(0),
                        "isocyanate_index": results?.variables?.isocyanate_index?.value.toFixed(2)
                    }

                    // eslint-disable-next-line no-loop-func
                    ingredientNames.forEach((inc) => {
                        let value = results?.variables?.['ingredient_quantities[' + inc + ']']?.value;
                        if (value && value > 0) {
                            if (!columnNames.includes(inc)) {
                                columnNames.push(inc);
                            }
                            row[inc] = value.toFixed(2)
                        } else {
                            row[inc] = '0.00';
                        }
                    })
                    finalList.push(row);
                }

            }

            columnNames = removeEmptyColumns(finalList, columnNames)

            let response = {
                data: finalList,
                columns: columnNames
            }

            callback(response);

        } catch (error) {
            console.error('Request failed:', error);
        }
    }

    const onAction = async (option) => {
        switch (option) {
            case 'optimal_formulation':
                try {
                    setLoading(true);
                    const newData = await formatRequestData(option);
                    const result = await solverOptimalFormulation(newData);
                    setLoading(false);
                    if (result && result.expressions) {
                        setActiveTab(1);
                        setResultData(result);
                        toast('Optimum solution found!', { style: { background: '#008000', color: '#fff' } });
                    } else {
                        setResultData({});
                        openModal({
                            title: 'Oops!',
                            message: 'No optimal solution found!'
                        });
                    }
                } catch (error) {
                    console.error('Request failed:', error);
                }
                break;
            case 'calculate_properties':
                
                try {
                    setLoading(true);
                    const newData = await formatRequestData(option);
                    if(newData.total_polyol_quantity !== 100) {
                        setLoading(false);
                        openModal({
                            title: 'Incorrect Quantity!',
                            message: 'Total Polyol quantity of selected ingredients should be 100'
                        });
                    } else {
                        delete newData['total_polyol_quantity'];
                        const result = await solverOptimalFormulation(newData);
                        setLoading(false);
                        if (result && result.expressions) {
                            setActiveTab(1);
                            setResultData(result);
                            toast('Optimum solution found!', { style: { background: '#008000', color: '#fff' } });
                        } else {
                            setResultData({});
                            openModal({
                                title: 'Oops!',
                                message: 'No optimal solution found!'
                            });
                        }
                    }
                } catch (error) {
                    console.error('Request failed:', error);
                }
                break;
            case 'generate_cost_vs_carbon_plot':
                setLoading(true);
                plotPareto(function (result) {
                    if (result) {
                        setActiveTab(1);
                        setResultData(result);
                        toast('Optimum solution found!', { style: { background: '#008000', color: '#fff' } });
                    } else {
                        setResultData({});
                    }
                    setLoading(false);
                });
                break;

            default:
                break;
        }
    }

    const newTemplate = async () => {
        setShowTemplateNamePopup(true)
    };

    const shareTemplate = async () => {
        setShowTemplateSharePopup(true);
    };

    const exportTemplate = async () => {
        const fileName = selectedTemplate.name+".json";
        const json = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const updateTemplate = async () => {
        if (selectedTemplate.shared) {
            toast('Shared template cannot be updated, please coordinate with the template owner ' + selectedTemplate?.ownerName, { style: { background: '#000', color: '#fff', minWidth: '400px' } });
        } else {
            openModal({
                title: 'Default Template',
                message: 'Do want to make this template as default template?',
                positiveButtonText: 'Yes',
                negativeButtonText: 'No',
                onAction: async (status) => {
                    setLoading(true);
                    let requestInfo = {
                        TemplateName: selectedTemplate.name,
                        TemplateJson: await formatRequestData(),
                        ISDEFULT: status || false,
                        CreatedBY: user?.username || '',
                        IsActive: true
                    }
                    let response = await saveTemplateApi(requestInfo);
                    setLoading(false);
                    if (response) {
                        setReloadTemplates(true);
                    }
                }
            });
        }

    };

    const deleteTemplate = async () => {
        if (selectedTemplate.shared) {
            toast('Shared template cannot be deleted, please coordinate with the template owner ' + selectedTemplate?.ownerName, { style: { background: '#000', color: '#fff' } });
        } else {
            openModal({
                title: 'Delete Template',
                message: 'Are you sure you want to delete this template?',
                positiveButtonText: 'Yes',
                negativeButtonText: 'No',
                onAction: async () => {
                    setLoading(true);
                    let requestInfo = {
                        "Template_Name": selectedTemplate.name,
                        "appArea": "Formul8"
                    }
                    let response = await deleteTemplateApi(requestInfo);
                    setLoading(false);
                    if (response) {
                        setReloadTemplates(true);
                    }
                }
            });
        }
    };

    const handleLoginSuccess = (activeUser) => {
        loginUser(activeUser)
    };

    const templateNamePopupResponse = async (templateName, isDefault) => {
        setShowTemplateNamePopup(false)
        if (templateName) {
            setLoading(true);
            let requestInfo = {
                TemplateName: templateName,
                TemplateJson: await formatRequestData(),
                ISDEFULT: isDefault,
                CreatedBY: user?.username || '',
                IsActive: true
            }
            let response = await saveTemplateApi(requestInfo);
            setLoading(false);
            if (response) {
                setReloadTemplates(true);
            }
        }
    };

    const templateSharePopupResponse = async (templateName, isDefault) => {
        setShowTemplateSharePopup(false)
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div className="main-layout">
            <Header />
            {!user.username ? <LoginPopup onClose={handleLoginSuccess} /> :
                (
                    <div className="content">
                        <div className="left-panel">
                            <FilterPanel onDataLoad={loadData} onFilterChange={handleFilterChange} onAction={onAction} reload={reloadTemplates} />
                        </div>
                        <div className="report-panel">
                            <TemplateNamePopup
                                show={showTemplateNamePopup}
                                onClose={templateNamePopupResponse}
                            />
                            <TemplateSharePopup
                                show={showTemplateSharePopup}
                                onClose={templateSharePopupResponse}
                            />
                            {/* <SeparatorLine /> */}
                            {(!jsonData || jsonData.length === 0) ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    fontSize: '24px',
                                    color: '#888'
                                }}>
                                    No data available. Please select a template!
                                </div>
                            ) : (
                                <>
                                    <TabsComponent tabs={tabs} preferredTab={activeTab} onTabChange={handleTabChange}>
                                        <>
                                            <div className="download-panel">
                                                <button onClick={newTemplate} title="Create new template from the current grid data with a unique name.">Save As New Template</button>
                                                {
                                                    !selectedTemplate.generic && (
                                                        <>
                                                            <button onClick={updateTemplate} title="Update the selected template with current grid data.">Save Template</button>
                                                            <button onClick={deleteTemplate} title="Delete the selected template, it cannot be reverted back.">Delete Template</button>
                                                        </>
                                                    )
                                                }
                                                <button onClick={shareTemplate} title="Share the selected template with team mates">Share Template</button>

                                                <button onClick={exportTemplate} title="Export the selected template in the JSON format">Export Template As JSON</button>

                                                <Toaster position="bottom-center" />
                                            </div>
                                            <div>
                                                <ConditionsGrid onGridUpdate={handleConditionsInputsChange} />

                                                <SeparatorLine />

                                                <>
                                                    <h3 style={{ textAlign: 'left' }}>Isocyanate Inputs</h3>
                                                    <TextInput
                                                        label="Isocyanate Price ($/kg)"
                                                        value={isocyanateValues.price}
                                                        onChange={handleIsocyanatePriceChange}
                                                    />
                                                    {
                                                        filterValues?.run_type === 'static' &&
                                                        <>
                                                            <TextInput
                                                                label="Isocyanate Index"
                                                                value={isocyanateValues.index}
                                                                onChange={handleIsocyanateIndexChange}
                                                                onBlur={handleIsocyanateIndexBlur}
                                                            />
                                                            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Min: {isocyanateValues.min}</span>
                                                                <span>Max: {isocyanateValues.max}</span>
                                                            </Typography>

                                                            <SeparatorLine />
                                                        </>
                                                    }

                                                </>

                                                <IngredientGrid runType={filterValues?.run_type} foamType={filterValues?.foam_type} onGridUpdate={handleIngredientInputsChange} />

                                                <SeparatorLine />

                                                {
                                                    jsonData.responses && filterValues?.run_type === 'optimization' &&
                                                    <>
                                                        <ResponseConstraintGrid foamType={filterValues?.foam_type} onGridUpdate={handleResponseConstraintGridChange} />
                                                        <SeparatorLine />
                                                    </>
                                                }

                                                {
                                                    filterValues?.theoretical_property === "fixed" &&
                                                    <>
                                                        <TheoreticalPropertyGrid foamType={filterValues?.foam_type} onGridUpdate={handleTheoreticalPropertyInputsChange} />
                                                        <SeparatorLine />
                                                    </>
                                                }

                                            </div>
                                        </>
                                        <div>
                                            <ResultLayout filterValues={filterValues} inputData={jsonData} resultData={resultData} />
                                        </div>
                                    </TabsComponent>
                                </>
                            )}

                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default MainLayout;
