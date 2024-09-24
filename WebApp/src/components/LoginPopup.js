import React, { useState } from 'react';
import './css/Login.css'; 
import { toast, Toaster } from 'react-hot-toast';

const userList = ['INJKP0', 'USJLIH', 'USYQI0', 'INSNLD', 'USDGBF', 'INSATD'];

const LoginPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');

  const handleLogin = () => {
    if(userList.includes(username.toLocaleUpperCase())) {
        onClose(username);
    } else {
        toast('Invalid User!', { style: { background: '#333', color: '#fff' } });
    }
  };

  return (
    <div className="overlay">
      <Toaster position="bottom-center" />
      <div className="popup">
        <h2>Welcome</h2>
        <input
          type="text"
          placeholder="Enter your User Alias"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
        <button onClick={handleLogin}>Start</button>
      </div>
    </div>
  );
};

export default LoginPopup;
