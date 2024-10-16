import React, { useState, useEffect } from 'react';
import './css/HorizontalChart.css'; // Import CSS for styling

const HorizontalChart = ({data}) => {

  const [tooltip, setTooltip] = useState({ visible: false, data: {}, position: {} });

  const handleDotClick = (item, e) => {
    const tooltipPosition = {
      top: e.clientY - 100,
      left: 20 
    };
    setTooltip({ visible: true, data: item, position: tooltipPosition });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltip.visible) {
        setTooltip({ visible: false, data: {}, position: {} });
      }
    };

    // Add event listener for click outside
    document.addEventListener('click', handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltip.visible]);

  return (
    <div className="horizontal-chart">
      {data.map((item, index) => {
        const barWidth = ((item.high_absolute - item.low_absolute) / item.high_absolute) * 100;
        const barMarginLeft = (item.low_absolute / item.high_absolute) * 100;
        

        // Calculate the dot position based on the result value
        const resultPercent = ((parseFloat(item.result) - item.low_absolute) / (item.high_absolute - item.low_absolute)) * 100;
        const dotPosition = resultPercent < 0 ? 0 : resultPercent; // Ensure the dot doesn't go negative

        return (
          <div
            className="chart-row"
            key={index}
            style={{ backgroundColor: '#FFF'}} // Alternate row colors
          >
            <div className="label">{item.label}</div>
            <div className="value low">{item.low_absolute}</div>
            <div className="bar" style={{ backgroundColor: '#d6eaf8'}}>
              <div
                className="filled-bar"
                style={{
                  width: `${barWidth}%`,
                  marginLeft: `${barMarginLeft}%`,
                }}
              >
                <span
                  className="dot"
                  onClick={(e) => handleDotClick(item, e)} // Pass event to position tooltip
                  style={{
                    left: `${dotPosition}%`, // Position dot according to result value
                    width: '10px', // Reduced width for the dot
                    height: '10px', // Reduced height for the dot
                    lineHeight: '10px', // Center text vertically in the dot
                    fontSize: '14px',
                    
                    fontWeight: 'bold' // Adjust font size to fit in dot
                  }}
                >
                  <span style={{marginLeft:'15px'}}>{item.result}</span>
                   {/* Only display the result value in the dot */}
                </span>
              </div>
            </div>
            <div className="value high">{item.high_absolute}</div>
          </div>
        );
      })}

      {tooltip.visible && (
        <div className="tooltip" style={{ position: 'absolute', top: tooltip.position.top, left: tooltip.position.left , textAlign : 'left'}}>
          <p><strong>Name:</strong> {tooltip.data.label}</p>
          <p><strong>Low Absolute:</strong> {tooltip.data.low_absolute}</p>
          <p><strong>High Absolute:</strong> {tooltip.data.high_absolute}</p>
          <p><strong>Result:</strong> <span style={{fontWeight:'bold', color:'green'}}>{tooltip.data.result}</span></p>
        </div>
      )}
    </div>
  );
};

export default HorizontalChart;
