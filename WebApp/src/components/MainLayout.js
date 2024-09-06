import React, { useState, useEffect, useRef } from 'react';
import FilterPanel from './FilterPanel';
import ConditionsGrid from './grids/ConditionsGrid';
import IngredientGrid from './grids/IngredientGrid';
import TheoreticalPropertyGrid from './grids/TheoreticalPropertyGrid';
import ChartPanel from './ChartPanel';
import Header from './Header';
import FileUploader from './FileUploader';
import { useData } from '../context/DataContext';
import TabsComponent from './TabsComponent';
import SeparatorLine from './SeparatorLine';
import TextInput from './TextInput';
import './css/MainLayout.css';
import SwitchWithRangeSlider from './SwitchWithRangeSlider';
import { Slider, Typography, LinearProgress } from '@mui/material';
import { solverOptimalFormulation } from '../api/api';
import AlertDialog from './AlertDialog';
import ResultLayout from './ResultLayout';


const MainLayout = () => {
   
    const { jsonData, setJsonData } = useData();
    const { resultData, setResultData } = useData();
    const [loading, setLoading] = useState(false);
    const tabs = ['Inputs', 'Results'];
    const [activeTab, setActiveTab] = useState(0);
    const [filterValues, setFilterValues] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);
    const [isocyanateValues, setIsocyanateValues] = useState({});
    const [conditionsInputs, setConditionsInputs] = useState([]);
    const [ingredientInputs, setIngredientInputs] = useState({});
    const [theoreticalPropertyInputs, setTheoreticalPropertyInputs] = useState({});
    const [responseConstraint, setResponseConstraint] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
    }, [refreshKey, activeTab]);

    const handleFileUpload = (jsonData) => {
        setJsonData(jsonData);
        let updatedIsocyanateValues = {
            price: jsonData?.conditions?.isocyanate_price?.value || "",
            index: parseFloat(jsonData?.conditions?.isocyanate_index?.value) || 0,
            min: jsonData?.conditions?.isoindex_bound_low?.value ? parseFloat(jsonData?.conditions?.isoindex_bound_low?.value) : 0,
            max: jsonData?.conditions?.isoindex_bound_high?.value ? parseFloat(jsonData?.conditions?.isoindex_bound_high?.value) : 0,
        };
        setIsocyanateValues(updatedIsocyanateValues)
    };

    const handleFilterChange = (filterType, filterValue) => {
        let updatedFilterValues = filterValues;
        updatedFilterValues[filterType] = filterValue;
        setFilterValues(updatedFilterValues);

        if (filterType === "run_type" || filterType === "theoretical_property" || filterType === "foam_type") {
            setRefreshKey(prevKey => prevKey + 1);
        }
    };

    const handleIsocyanatePriceChange = (event) => {
        let updatedObj = { ...isocyanateValues, price: event.target.value };
        setIsocyanateValues(updatedObj);
    };

    const handleIsocyanateSlideChange = (event, newValue) => {
        let updatedObj = { ...isocyanateValues, index: newValue };
        setIsocyanateValues(updatedObj);
    };

    const handleConditionsInputsChange = (data) => {
        setConditionsInputs(data)
    }

    const handleIngredientInputsChange = (data) => {
        setIngredientInputs(data)
    }

    const handleTheoreticalPropertyInputsChange = (data) => {
        setTheoreticalPropertyInputs(data)
    }

    const handleResponseConstraintChange = (sliderId, switchOn, range) => {
        let extResponseConstraint = responseConstraint;
        if (!extResponseConstraint[sliderId]) {
            extResponseConstraint[sliderId] = {};
        }
        extResponseConstraint[sliderId].switchOn = switchOn;
        extResponseConstraint[sliderId].range = range;
        setResponseConstraint(extResponseConstraint);
    }

    const formatRequestData = async (action) => {
        let requestData = {
            objective_type: filterValues.objective_type || "cost",
            objective_sense: filterValues.objective_sense || "min",
            carbon_footprint_limit: filterValues.pareto_points ? filterValues.pareto_points : "None"
        };

        let updatedInputData = JSON.parse(JSON.stringify(jsonData));

        updatedInputData["conditions"]["isocyanate_price"]["value"] = isocyanateValues.price;
        if (isocyanateValues.isocyanate_index && isocyanateValues.isocyanate_index[0]) {
            updatedInputData["conditions"]["isocyanate_index"]["value"] = isocyanateValues.isocyanate_index[0];
        }

        conditionsInputs.forEach((item) => {
            if (updatedInputData["conditions"] && updatedInputData["conditions"][item.key]) {
                updatedInputData["conditions"][item.key].value = item.value
            }
        })

        updatedInputData["conditions"]['FOAM_TYPE'].value = filterValues.foam_type;

        if (filterValues.run_type === "optimization") {
            updatedInputData["conditions"]['optimization_run'].value = true;
            updatedInputData["conditions"]['single_polyol_per_type'].value = filterValues.polyolType === "single" ? true : false;
            updatedInputData["conditions"]['variable_theoretical_properties'].value = filterValues.theoreticalProperty === "fixed" ? false : true;

            for (let r in responseConstraint) {
                updatedInputData["responses"][r]["active_constraint"] = responseConstraint[r].switchOn;
                if (responseConstraint[r].switchOn) {
                    updatedInputData["responses"][r].low_bound_user = responseConstraint[r].range[0];
                    updatedInputData["responses"][r].high_bound_user = responseConstraint[r].range[1];
                }
            }
        } else {
            updatedInputData["conditions"]['optimization_run'].value = false;
            requestData.objective_type = "cost";
            requestData.objective_sense = "min";
        }

        ingredientInputs.forEach((item) => {
            if (item.selected) {
                updatedInputData["ingredients"][item.ingredient].available = true;
                updatedInputData["ingredients"][item.ingredient].price = parseFloat(item.price);
                updatedInputData["ingredients"][item.ingredient].carbon_footprint = parseFloat(item.carbonFootprint);
                if (filterValues?.run_type === 'static') {
                    updatedInputData["ingredients"][item.ingredient].quantity = parseFloat(item.quantity);
                }
            } else {
                updatedInputData["ingredients"][item.ingredient].available = false;
            }

        });

        if (filterValues.theoreticalProperty === "fixed") {
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

        return requestData;
    }

    const onAction = async (option) => {
        switch (option) {
            case 'optimal_formulation':
                try {
                    setLoading(true);
                    const newData = await formatRequestData(option); // Replace with your data structure
                    const result = await solverOptimalFormulation(newData);
                    setLoading(false);
                    if(result && result.expressions) {
                        //setActiveTab(1);
                        setResultData(result);
                    } else {
                        showAlertDialog("No optimal solution found!", "Alert");
                    }                   
                } catch (error) {
                    console.error('Failed to create resource:', error);
                }
                break;
            case 'calculate_properties':
                try {
                    setLoading(true);
                    const newData = await formatRequestData(option); // Replace with your data structure
                    const result = await solverOptimalFormulation(newData);
                    setLoading(false);
                    if(result && result.expressions) {
                        //setActiveTab(1);
                        setResultData(result);
                    } else {
                        showAlertDialog("No optimal solution found!", "Alert");
                    }
                } catch (error) {
                    console.error('Failed to create resource:', error);
                }
                break;
            case 'generate_cost_vs_carbon_plot':
                try {
                    setLoading(true);
                    const newData = await formatRequestData(option); // Replace with your data structure
                    const result = await solverOptimalFormulation(newData);
                    setLoading(false);
                    if(result && result.expressions) {
                        //setActiveTab(1);
                        setResultData(result);
                    } else {
                        showAlertDialog("No optimal solution found!", "Alert");
                    }
                } catch (error) {
                    console.error('Failed to create resource:', error);
                }
                break;

            default:
                break;
        }
    }

    const showAlertDialog = (message, title) => {
        setDialogMessage(message);
        setDialogTitle(title);
        setDialogOpen(true);
      };
    
      const closeAlertDialog = () => {
        setDialogOpen(false);
      };

    return (
        <div className="main-layout">
            <Header />
            <div className="content">
                <div className="left-panel">
                    <FileUploader onFileUpload={handleFileUpload} />
                    <FilterPanel onFilterChange={handleFilterChange} onAction={onAction} />
                </div>
                <div className="report-panel">
                    <AlertDialog
                        open={dialogOpen}
                        onClose={closeAlertDialog}
                        message={dialogMessage}
                        title={dialogTitle}
                    />
                    {loading && <LinearProgress style={{ margin: '20px 0' }} />}
                    {(!jsonData || jsonData.length === 0) ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            fontSize: '24px',
                            color: '#888'
                        }}>
                            No data available. Import the JSON data and check!
                        </div>
                    ) : (
                        <>
                            <TabsComponent tabs={tabs} preferredTab={activeTab}>
                                <div>

                                    <ConditionsGrid jsonData={jsonData} onGridUpdate={handleConditionsInputsChange} />
                                    <SeparatorLine />
                                    <>
                                        <h3 style={{ textAlign: 'left' }}>Isocyanate Inputs {activeTab}</h3>
                                        <TextInput
                                            label="Isocyanate Price ($/kg)"
                                            value={isocyanateValues.price}
                                            onChange={handleIsocyanatePriceChange}
                                        />
                                        {
                                            filterValues?.run_type === 'static' &&
                                            <>
                                                <Slider
                                                    value={[isocyanateValues.index]}
                                                    onChange={handleIsocyanateSlideChange}
                                                    valueLabelDisplay="on"
                                                    min={isocyanateValues.min}
                                                    max={isocyanateValues.max}
                                                    sx={{
                                                        mt: 2,
                                                        '& .MuiSlider-thumb': {
                                                            bgcolor: '#282c34',
                                                        },
                                                        '& .MuiSlider-track': {
                                                            bgcolor: '#282c34',
                                                        },
                                                        '& .MuiSlider-rail': {
                                                            bgcolor: '#282c34',
                                                        },
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Min: {isocyanateValues.min}</span>
                                                    <span>Max: {isocyanateValues.max}</span>
                                                </Typography>

                                                <SeparatorLine />
                                            </>
                                        }

                                    </>

                                    <IngredientGrid runType={filterValues?.run_type} jsonData={jsonData} onGridUpdate={handleIngredientInputsChange} />

                                    <SeparatorLine />

                                    {
                                        jsonData.responses && filterValues?.run_type === 'optimization' &&
                                        <>
                                            <h3 style={{ textAlign: 'left' }}>Response Constraint Selection</h3>

                                            {Object.entries(jsonData.responses).map(([key, details], index) => (
                                                <SwitchWithRangeSlider
                                                    id={key}
                                                    switchOn={details.active_constraint}
                                                    label={details.latex_label}
                                                    min={filterValues.foam_type === 'HRSlab' ? details.low_bound_hr : details.low_bound_conv}
                                                    max={filterValues.foam_type === 'HRSlab' ? details.high_bound_hr : details.high_bound_conv}
                                                    range={[details.low_bound_user, details.high_bound_user]}
                                                    onUpdate={handleResponseConstraintChange}
                                                />
                                            ))}

                                            <SeparatorLine />
                                        </>
                                    }

                                    {
                                        filterValues?.theoretical_property === "fixed" &&
                                        <>
                                            <TheoreticalPropertyGrid jsonData={jsonData} onGridUpdate={handleTheoreticalPropertyInputsChange} />
                                            <SeparatorLine />
                                        </>
                                    }

                                </div>
                                <div>
                                    <ResultLayout filterValues = {filterValues} inputData = {jsonData} resultData = {resultData} />
                                </div>
                            </TabsComponent>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MainLayout;
