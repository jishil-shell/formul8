import React from 'react';
import { Tabs, Tab, Box } from '@mui/material'; // If using Material-UI

const TabsComponent = ({ tabs, children, preferredTab, onTabChange}) => {

    return (
        <div>
            <Tabs value={preferredTab} onChange={onTabChange} aria-label="tabs">
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab} />
                ))}
            </Tabs>
            <Box sx={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '15px' }}>
                {children[preferredTab]}
            </Box>
        </div>
    );
};

export default TabsComponent;
