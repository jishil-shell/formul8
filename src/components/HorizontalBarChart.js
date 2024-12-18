import React, { useState, useEffect } from 'react';
import './css/HorizontalChart.css'; // Import CSS for styling

const HorizontalChart = ({ data, runType }) => {

  const [tooltip, setTooltip] = useState({ visible: false, data: {}, position: {} });
  const [hoverTooltip, setHoverTooltip] = useState({ visible: false, value: '', position: {} });


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

  const handleMouseMove = (item, e, barRef) => {
    const barRect = barRef.current.getBoundingClientRect();
    const xPos = e.clientX - barRect.left;
    const barWidth = barRect.width;

    // Calculate the value based on the mouse position within the bar
    const percent = (xPos / barWidth) * 100;
    const currentValue = ((item.high_absolute - item.low_absolute) * percent / 100) + item.low_absolute;

    const hoverTooltipPosition = {
      top: e.clientY - 10 , // Position slightly above the mouse pointer
      left: e.clientX - 550, // Slightly to the right of the mouse pointer
    };

    setHoverTooltip({
      visible: true,
      value: currentValue.toFixed(2),
      position: hoverTooltipPosition,
    });
  };

  const handleMouseLeave = () => {
    setHoverTooltip({ visible: false, value: '', position: {} });
  };

  return (
    <div className="horizontal-chart">
      {data.map((item, index) => {
        const barRef = React.createRef();
        let filledBarWidth, barMarginLeft, startPos, endPos, filledBarClass;
        filledBarClass = "";
        if (runType === 'optimization' && item.active_constraint) {
          filledBarClass = "filled-bar";
          startPos = ((item.low_user - item.low_absolute) / (item.high_absolute - item.low_absolute)) * 100;
          endPos = ((item.high_user - item.low_absolute) / (item.high_absolute - item.low_absolute)) * 100;
          filledBarWidth = endPos - startPos;
          barMarginLeft = startPos
        }

        // Calculate the dot position based on the result value
        const resultPercent = ((parseFloat(item.result) - item.low_absolute) / (item.high_absolute - item.low_absolute)) * 100;
        const dotPosition = resultPercent < 0 ? 0 : resultPercent; // Ensure the dot doesn't go negative

        // Define the number of segments
        const segments = 5; // You can change this value to show more or fewer marks
        const segmentValues = [];
        for (let i = 0; i <= segments; i++) {
          const value = item.low_absolute + (i * (item.high_absolute - item.low_absolute) / segments);
          segmentValues.push(value.toFixed(2));
        }

        return (
          <div
            className="chart-row"
            key={index}
            style={{ backgroundColor: '#FFF' }} // Alternate row colors
          >
            <div className="label">{item.label}</div>
            <div className="value low">{item.low_absolute}</div>
            <div className="bar"
              style={{ backgroundColor: '#d6eaf8', position: 'relative' }}
              ref={barRef}
              onMouseMove={(e) => handleMouseMove(item, e, barRef)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={filledBarClass}
                style={{
                  width: `${filledBarWidth}%`,
                  marginLeft: `${barMarginLeft}%`,
                }}
              >
                <span
                  className="dot"
                  onClick={(e) => handleDotClick(item, e)} // Pass event to position tooltip
                  style={{
                    left: `${dotPosition}%`, // Position dot according to result value
                    width: '8px', // Reduced width for the dot
                    height: '8px', // Reduced height for the dot
                    lineHeight: '8px', // Center text vertically in the dot
                    fontSize: '14px',
                    fontWeight: 'bold' // Adjust font size to fit in dot
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{item.result}</span>
                  {/* Only display the result value in the dot */}
                </span>
              </div>
              <div className="segment-values">
              {segmentValues.map((value, idx) => (
                <span
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${(idx / segments) * 100}%`,
                    top: '36px', // Position below the bar
                    transform: 'translateX(-50%)',
                    fontSize: '9px',
                    color:'grey'
                  }}
                >
                  {value}
                </span>
              ))}
            </div>
            </div>
            <div className="value high">{item.high_absolute}</div>
          </div>
        );
      })}

      {tooltip.visible && (
        <div className="tooltip" style={{ position: 'absolute', top: tooltip.position.top, left: tooltip.position.left, textAlign: 'left' }}>
          <p><strong>Name:</strong> {tooltip.data.label}</p>
          <p><strong>Low Absolute:</strong> {tooltip.data.low_absolute}</p>
          <p><strong>Low User:</strong> {tooltip.data.low_user}</p>
          <p><strong>High Absolute:</strong> {tooltip.data.high_absolute}</p>
          <p><strong>High User:</strong> {tooltip.data.high_user}</p>
          <p><strong>Result:</strong> <span style={{ fontWeight: 'bold', color: 'green' }}>{tooltip.data.result}</span></p>
        </div>
      )}

      {hoverTooltip.visible && (
        <div className="hover-tooltip" style={{ position: 'absolute', fontWeight: 'bold', color: '#8e44ad', top: hoverTooltip.position.top, left: hoverTooltip.position.left }}>
          {hoverTooltip.value}
        </div>
      )}
    </div>
  );
};

export default HorizontalChart;
