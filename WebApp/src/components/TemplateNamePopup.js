import React, { useState } from 'react';
import './css/Popup.css';
import { toast, Toaster } from 'react-hot-toast';
import { checkTemplateApi } from '../api/api';
import { useLoader } from '../context/LoaderContext';

const TemplateNamePopup = ({ show, onClose }) => {

  const [templateName, setTemplateName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const { setLoading } = useLoader();

  if (!show) return null;

  const handleOKButtonClick = async () => {
    if (!templateName) {
      toast('Please enter a valid name!', { style: { background: '#333', color: '#fff' } });
    } else {
      setLoading(true);
      let requestInfo = {
        "Template_Name": templateName,
        "appArea": "Formul8"
      }
      let response = await checkTemplateApi(requestInfo);
      setLoading(false);
      if (response) {
        toast('Template name "' + templateName + '" already exists, please try with a different name!', { style: { background: '#333', color: '#fff' } });
      } else {
        onClose(templateName, isDefault);
      }
    }
  };

  const handleCancelButtonClick = () => {
    onClose(false);
  };

  return (
    <div className="overlay">
      <Toaster position="bottom-center" />
      <div className="popup">
        <h3 className='title'>Template Name</h3>
        <div className='body'>
          {/* <p>'Please enter a name for the Template'</p> */}
          <input className="text-box"
              type="text"
            placeholder='Please enter an unique name for the Template'
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <div className="checkbox">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}               
            />
            <label>Set as default template</label>
          </div>
        </div>
        <div className='actions'>
          <button onClick={handleOKButtonClick}>Proceed</button>
          <button onClick={handleCancelButtonClick}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateNamePopup;
