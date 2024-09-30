import React from 'react';
import './css/Header.css';
import { useUserContext } from '../context/UserContext';

const Header = () => {
    const { user, logoutUser } = useUserContext();
    return (
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div>
                <h1>Formul8</h1>
                <p>A polyurethane foam property prediction tool</p>
            </div>

            {
                user && user.username &&
                <button className="logout-button" onClick={logoutUser}>
                    Log Out
                </button>
            }

        </header>
    );
};

export default Header;
