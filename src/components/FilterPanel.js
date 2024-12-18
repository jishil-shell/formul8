import React, { useState, useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import './css/Common.css';
import './css/Filter.css';
import NumberInputWithButton from './NumberInputWithButton';
import { getTemplates } from '../api/api';
import { useLoader } from '../context/LoaderContext';
import { toast, Toaster } from 'react-hot-toast';
import FileUploader from './FileUploader';
import { useUserContext } from '../context/UserContext';

const FilterPanel = ({ onFilterChange, onDataLoad, onAction, reload }) => {

    const { jsonData } = useDataContext();
    const { setResultData } = useDataContext();
    const { selectedTemplate, setSelectedTemplate } = useDataContext();


    const [showFileUpload] = useState(false);
    const { setLoading } = useLoader();
    const [templates, setTemplates] = useState([]);

    const [selectedRunType, setSelectedRunType] = useState('optimization');
    const [selectedFoamType, setSelectedFoamType] = useState('HRSlab');
    const [selectedObjectiveType, setSelectedObjectiveType] = useState('cost');
    const [selectedObjectiveSense, setSelectedObjectiveSense] = useState('max');
    const [selectedPolyolType, setSelectedPolyolType] = useState('multiple');
    const [selectedTheoreticalProperty, setSelectedTheoreticalProperty] = useState('fixed');

    const [paretoPlot, setParetoPlot] = useState(false);
    const [paretoPoints, setParetoPoints] = useState(10);

    const runTypeOptions = [
        { value: 'optimization', text: 'Optimization' },
        { value: 'static', text: 'Simulation' }
    ];

    const foamTypeOptions = [
        { value: 'HRSlab', text: 'High Resilience' },
        { value: 'ConvSlab', text: 'Conventional' }
    ];

    const objectiveOptions = [
        { value: 'cost', text: 'Cost' },
        { value: 'carbon', text: 'Carbon Footprint' },
        { value: 'response_center_distance', text: 'Response Distance from Center' }
    ];

    const objectiveSenseOptions = [
        { value: 'min', text: 'Minimize' },
        { value: 'max', text: 'Maximize' }
    ];

    const polyolTypeOptions = [
        { value: 'multiple', text: 'Multiple' },
        { value: 'single', text: 'Single' }
    ];

    const theoreticalPropertyOptions = [
        { value: 'fixed', text: 'Fixed' },
        { value: 'variable', text: 'Variable' }
    ];

    async function fetchData() {
        setLoading(true);
        let apiResponse = await getTemplates({});
        if (apiResponse?.status) {
            let templateList = apiResponse.response;
            let items = [];
            let activeTemplate = {};  
            templateList.forEach((t) => {
                let item = {};
                item.name = t.templateName;
                item.text = t.templateName;
                item.data = JSON.parse(t.templateDetails);
                if(item.data?.input_json) {
                    item.data.inputJson = item.data?.input_json;
                }
                item.default = t.isDefault ? JSON.parse(t.isDefault) : false;
                item.generic = t.isGeneric ? JSON.parse(t.isGeneric) : false;
                item.shared = t.isShared ? JSON.parse(t.isShared) : false;
                item.owner = t.createdBy || '';
                item.ownerName = t.fullName || '';
                if (item.default) {
                    activeTemplate = item;
                }
                if(item.generic) {
                    item.text += ' (Generic)' 
                }
                if(item.shared) {
                    item.text += ' (Shared)' 
                }
                items.push(item)
            })
            setTemplates(items)
            if (activeTemplate?.name) {
                setSelectedTemplate(activeTemplate);
                onDataLoad(activeTemplate?.data?.inputJson || {})
            } else {
                activeTemplate = items[0];
                setSelectedTemplate(activeTemplate);
                onDataLoad(activeTemplate?.data?.inputJson || {})
            }
            setLoading(false);
        } else {
            setLoading(false);
            toast('Request failed!', { style: { background: '#333', color: '#fff' } });
        }
    }

    useEffect(() => {
        if(reload) {
            fetchData();
        }        
    }, [reload]);

    useEffect(() => {
        if(selectedTemplate && selectedTemplate.name) {
            setSelectedObjectiveSense(selectedTemplate?.data?.objective_sense);
            setSelectedObjectiveType(selectedTemplate?.data?.objective_type);
            onFilterChange('objective_type', selectedTemplate?.data?.objective_type);
            onFilterChange('objective_sense', selectedTemplate?.data?.objective_sense);
        }
        else if (selectedRunType) {
            onFilterChange('run_type', selectedRunType);
            onFilterChange('theoretical_property', 'fixed');
            onFilterChange('objective_type', 'cost');
            onFilterChange('objective_sense', 'min');
        }

        if (jsonData?.conditions?.optimization_run?.value) {
            setSelectedRunType('optimization');
            onFilterChange('run_type', 'optimization');
        } else {
            setSelectedRunType('static');
            onFilterChange('run_type', 'static');
        }

        if (jsonData?.conditions?.FOAM_TYPE?.value) {
            setSelectedFoamType(jsonData.conditions.FOAM_TYPE.value);
            onFilterChange('foam_type', jsonData.conditions.FOAM_TYPE.value);
        }

        if (jsonData?.conditions?.single_polyol_per_type?.value) {
            setSelectedPolyolType('single');
            onFilterChange('polyol_type', 'single');
        } else {
            setSelectedPolyolType('multiple');
            
            onFilterChange('polyol_type', 'multiple');
        }
        if (jsonData?.conditions?.variable_theoretical_properties?.value) {
            setSelectedTheoreticalProperty('variable');
            onFilterChange('theoretical_property', 'variable');
        } else {
            setSelectedTheoreticalProperty('fixed');
            onFilterChange('theoretical_property', 'fixed');
        }

    }, [jsonData]);

    const handleDropdownChange = (e, filterType) => {
        switch (filterType) {
            case 'template':
                var activeTemplate = templates.find(item => item.name === e.target.value);
                if (activeTemplate && activeTemplate.data) {
                    setSelectedTemplate(activeTemplate);
                    setLoading(true);
                    setTimeout(() => {
                        let data = activeTemplate.data?.inputJson ? activeTemplate.data?.inputJson : {};
                        onDataLoad(data);  
                        setLoading(false);
                    }, 5)
                }
                break;
            case 'run_type':
                setSelectedRunType(e.target.value)
                break;
            case 'foam_type':
                setSelectedFoamType(e.target.value)
                break;
            case 'objective_type':
                setSelectedObjectiveType(e.target.value)
                break;
            case 'objective_sense':
                setSelectedObjectiveSense(e.target.value)
                break;
            case 'polyol_type':
                setSelectedPolyolType(e.target.value)
                break;
            case 'theoretical_property':
                setSelectedTheoreticalProperty(e.target.value)
                break;
            default:
                break;
        }
        setResultData({});
        onFilterChange(filterType, e.target.value);
    };

    const handleCheckboxChange = (value, boxName) => {
        switch (boxName) {
            case 'pareto_plot':
                setParetoPlot(value)
                break;
            default:
                break;
        }
    };

    const handleButtonClick = (event, action) => {
        if (!jsonData || jsonData.length === 0) {
            alert("Please select the JSON file!")
        } else {
            onFilterChange('action', action);
            if (selectedRunType === 'optimization' && paretoPlot) {
                onFilterChange('pareto_points', paretoPoints);
            }
            onAction(action)
        }
    };

    const handleFileUpload = (data) => {
        setLoading(true);
        setTimeout(() => {
            onDataLoad(data);  
            setLoading(false);
        }, 5) 
    };

    return (
        <div>
            <Toaster position="bottom-center" />

            <h2 className='leftHeader'>Select Templates</h2>
            <div className="filter-group">
                <label htmlFor="template">Template : </label>
                <select id="template" value={selectedTemplate.name} onChange={(e) => handleDropdownChange(e, 'template')}>
                    {templates.map((option, index) => (
                        <option key={index} value={option.name}>
                            {option.text}
                        </option>
                    ))}
                </select>
            </div>

            {
                showFileUpload &&
                <div style={{marginBottom:'70px'}}>
                    <span><b>OR</b></span>
                    <FileUploader onFileUpload={handleFileUpload}/>
                </div>
            }

            <h2 className='leftHeader'>Filters</h2>

            <div className="filter-group">
                <label htmlFor="runFilter">Run Type : </label>
                <select id="runFilter" value={selectedRunType} onChange={(e) => handleDropdownChange(e, 'run_type')}>
                    {runTypeOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="foamFilter">Foam Type : </label>
                <select id="foamFilter" defaultValue="" value={selectedFoamType} onChange={(e) => handleDropdownChange(e, 'foam_type')}>
                    <option value="">

                    </option>
                    {foamTypeOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>
            </div>
            {
                selectedRunType === 'optimization' &&

                <div className="filter-group">
                    <label htmlFor="objectiveFilter">Objective : </label>
                    <select id="objectiveFilter" defaultValue="" value={selectedObjectiveType} onChange={(e) => handleDropdownChange(e, 'objective_type')}>
                        <option value="">

                        </option>
                        {objectiveOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            }

            {
                selectedRunType === 'optimization' &&
                <div className="filter-group">
                    <label htmlFor="objectiveSenseFilter">Objective Sense : </label>
                    <select id="objectiveSenseFilter" defaultValue="" value={selectedObjectiveSense} onChange={(e) => handleDropdownChange(e, 'objective_sense')}>
                        <option value="">

                        </option>
                        {objectiveSenseOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            }

            {
                selectedRunType === 'optimization' &&
                <div className="filter-group">
                    <label htmlFor="polyolTypeFilter">Possible Use of Different Polyols from Each Category : </label>
                    <select id="polyolTypeFilter" defaultValue="" value={selectedPolyolType} onChange={(e) => handleDropdownChange(e, 'polyol_type')}>
                        <option value="">

                        </option>
                        {polyolTypeOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            }

            {
                selectedRunType === 'optimization' &&
                <div className="filter-group">
                    <label htmlFor="polyolTypeFilter">Theoretical Polyol Properties : </label>
                    <select id="polyolTypeFilter" defaultValue="" value={selectedTheoreticalProperty} onChange={(e) => handleDropdownChange(e, 'theoretical_property')}>
                        <option value="">

                        </option>
                        {theoreticalPropertyOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            }

            {
                selectedRunType === 'optimization' &&
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={paretoPlot}
                            onChange={(e) => handleCheckboxChange(e.target.checked, 'pareto_plot')}
                        />
                        Cost vs. Carbon Plot
                    </label>
                </div>
            }

            {
                selectedRunType === 'optimization' && paretoPlot &&
                <div className="filter-group">
                    <NumberInputWithButton
                        value={paretoPoints}
                        onChange={setParetoPoints}
                        min={2}
                        max={100}
                        step={1}
                        disabled={false} // Set to true to disable the input and buttons
                    />
                </div>
            }

            {
                selectedRunType === 'optimization' && paretoPlot &&
                <button className="filter-button" onClick={(e) => handleButtonClick(e, 'generate_cost_vs_carbon_plot')}>Generate Cost vs. Carbon Plot</button>
            }
            {
                selectedRunType === 'optimization' && !paretoPlot &&
                <button className="filter-button" onClick={(e) => handleButtonClick(e, 'optimal_formulation')}>Find Optimal Formulation</button>
            }

            {
                selectedRunType === 'static' &&
                <button className="filter-button" onClick={(e) => handleButtonClick(e, 'calculate_properties')}>Calculate Properties</button>
            }
        </div>
    );
};

export default FilterPanel;
