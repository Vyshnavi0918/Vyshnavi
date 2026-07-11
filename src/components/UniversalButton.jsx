import React from 'react';
import PropTypes from 'prop-types';

/**
 * UniversalButton - a premium styled button used throughout the app.
 * All buttons inherit this style to ensure consistency and enabled state.
 */
export default function UniversalButton({ children, onClick, style, ...rest }) {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#8b9dc3',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...style,
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = 'rgba(79,142,247,0.1)';
    e.currentTarget.style.borderColor = 'rgba(79,142,247,0.3)';
    e.currentTarget.style.color = '#4f8ef7';
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.color = '#8b9dc3';
  };

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
}

UniversalButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

UniversalButton.defaultProps = {
  onClick: undefined,
  style: {},
};
