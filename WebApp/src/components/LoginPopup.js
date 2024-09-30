import React, { useState } from 'react';
import './css/Popup.css';
import { toast, Toaster } from 'react-hot-toast';

const userList = ['INJKP0', 'USJLIH', 'USYQI0', 'INSNLD', 'USDGBF', 'INSATD'];

const LoginPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (userList.includes(username.toLocaleUpperCase())) {
      onClose(username);
    } else {
      toast('Invalid User!', { style: { background: '#333', color: '#fff' } });
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
