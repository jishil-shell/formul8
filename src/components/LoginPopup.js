import React, { useState } from 'react';
import './css/Popup.css';
import { toast, Toaster } from 'react-hot-toast';
import { useLoader } from '../context/LoaderContext';
import { validateUser } from '../api/api';

const LoginPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const { setLoading } = useLoader();

  const handleLogin = async() => {
    setLoading(true);
    let requestInfo = {
        userName: username.toLocaleUpperCase(),
        appArea: 'Formul8',
    }
    let apiResponse = await validateUser(requestInfo);
    setLoading(false);
    if(apiResponse?.status) {
      let activeUser = {
        username : apiResponse.response.userID,
        fullname : apiResponse.response.fullName,
        email : apiResponse.response.emailID,
      }
      onClose(activeUser);
    } else {
      toast('Invalid User!', { style: { background: '#000', color: '#fff' } });
    }
   
  };

  return (
    <div className="overlay">
      <Toaster position="bottom-center" />
      <div className="popup">
        <h3 className='title'>Welcome</h3>
        <div className='body'>
          <input className="text-box"
            type="text"
            placeholder="Enter your User Alias"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='actions'>
          <button onClick={handleLogin}>Start</button>
        </div>

      </div>
    </div>
  );
};

export default LoginPopup;
