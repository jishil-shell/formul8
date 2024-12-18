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
        "templateName": selectedTemplate.name
      }
      let apiResponse = await getTemplateMappings(requestInfo);
      setLoading(false);
      if (apiResponse?.status) {
        setUserList(apiResponse.response);
      }

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
        userId: item.userId,
        isShared: item.isShared
      })
    })
    let requestInfo = {
      "templateName": selectedTemplate.name,
      "mappings": mappings
    }
    let apiResponse = await updateTemplateMappings(requestInfo);
    if (apiResponse?.status) {
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
      user.userId === event.target.value
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
                        value={user.userId}
                        checked={user.isShared ? JSON.parse(user.isShared) : false}
                        onChange={handleCheckboxChange}
                      />
                      <label style={{ marginLeft: 10, fontSize: 22 }}>{user.fullName}</label>
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
