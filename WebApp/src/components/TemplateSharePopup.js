import React, { useEffect, useState } from 'react';
import './css/Popup.css';
import { toast, Toaster } from 'react-hot-toast';
import { getTemplateMappings, updateTemplateMappings } from '../api/api';
import { useLoader } from '../context/LoaderContext';
import { useDataContext } from '../context/DataContext';

const TemplateSharePopup = ({ show, onClose }) => {

  const { selectedTemplate } = useDataContext();
  const [userList, setUserList] = useState([]);
  const { setLoading } = useLoader();

  useEffect(() => {
    async function fetchData() {
      setUserList([]);
      setLoading(true);
      let requestInfo = {
        "Template_Name": selectedTemplate.name
      }
      let response = await getTemplateMappings(requestInfo);
      setLoading(false);
      setUserList(response);
    }
    if (show) {
      fetchData();
    }
  }, [show]);


  if (!show) return null;

  const handleOKButtonClick = async () => {
    setLoading(true);
    let mappings = [];
    userList.forEach((item) => {
      mappings.push({
        userName: item.UsersID,
        isShared: item.isShared
      })
    })
    let requestInfo = {
      "Template_Name": selectedTemplate.name,
      "appArea": "Formul8",
      "Mappings": mappings
    }
    let response = await updateTemplateMappings(requestInfo);
    if (response) {
      toast('Template successfully shared!', { style: { background: '#008000', color: '#fff' } });
    }
    setLoading(false);
    show = false;
    if (onClose) {
      onClose(false);
    }
  };

  const handleCancelButtonClick = () => {
    show = false;
    if (onClose) {
      onClose(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const updatedList = userList.map(user =>
      user.UsersID === event.target.value
        ? { ...user, isShared: event.target.checked }
        : user
    );
    setUserList(updatedList)
  };

  return (
    <div className="overlay">
      <Toaster position="bottom-center" />
      {
        userList.length && (
          <div className="popup">
            <h3 className='title'>Share Template</h3>
            <p style={{ marginBottom: 15 }}>Share the selected template with users whom you wish</p>
            <div >
              {
                userList.length ? (
                  userList.map((user, index) => (
                    <div className='checkboxList1' style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }} key={index}>
                      <input
                        style={{ width: 24, height: 24, accentColor: 'black' }}
                        type="checkbox"
                        value={user.UsersID}
                        checked={user.isShared}
                        onChange={handleCheckboxChange}
                      />
                      <label style={{ marginLeft: 10, fontSize: 22 }}>{user.FullName}</label>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center' }}>Getting data...</p>
                )
              }
            </div>
            <div className='actions'>
              <button onClick={handleOKButtonClick}>Share</button>
              <button onClick={handleCancelButtonClick}>Cancel</button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TemplateSharePopup;
