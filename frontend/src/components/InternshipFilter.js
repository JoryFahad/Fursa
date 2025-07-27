import React from 'react';
import { useColorModeValue } from '@chakra-ui/react';

const InternshipFilter = ({ currentStatus, onStatusChange, counts }) => {
  // Dark mode color values
  const filterBg = useColorModeValue('#ffffff', '#2d3748');
  const filterBorder = useColorModeValue('#e2e8f0', '#4a5568');
  const filterShadow = useColorModeValue('0 4px 16px rgba(0, 0, 0, 0.05)', '0 4px 16px rgba(0, 0, 0, 0.25)');
  const filterTitleColor = useColorModeValue('#1e293b', '#f7fafc');
  
  const buttonActiveBg = useColorModeValue('#3b82f6', '#5a67d8');
  const buttonActiveBorder = useColorModeValue('#3b82f6', '#5a67d8');
  const buttonActiveShadow = useColorModeValue('0 2px 8px rgba(59, 130, 246, 0.25)', '0 2px 8px rgba(90, 103, 216, 0.4)');
  
  const buttonInactiveBg = useColorModeValue('#f8fafc', '#4a5568');
  const buttonInactiveColor = useColorModeValue('#64748b', '#cbd5e0');
  const buttonInactiveBorder = useColorModeValue('#e2e8f0', '#718096');
  const buttonInactiveShadow = useColorModeValue('0 1px 3px rgba(0, 0, 0, 0.05)', '0 1px 3px rgba(0, 0, 0, 0.2)');
  
  const buttonHoverBorder = useColorModeValue('#94a3b8', '#8a96a6');
  
  const badgeActiveBg = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)');
  const badgeInactiveBg = useColorModeValue('#e2e8f0', '#718096');
  const badgeInactiveColor = useColorModeValue('#64748b', '#e2e8f0');
  const filters = [
    { key: 'all', label: 'All Internships', count: counts?.all, icon: '📋' },
    { key: 'open', label: 'Open Applications', count: counts?.open, icon: '🟢' },
    { key: 'closed', label: 'Closed Applications', count: counts?.closed, icon: '🔴' },
  ];
  const baseButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white',
    textDecoration: 'none',
    userSelect: 'none',
    outline: 'none',
  };
  const getButtonStyle = (isActive) => ({
    ...baseButtonStyle,
    ...(isActive ? {
      background: buttonActiveBg,
      color: 'white',
      borderColor: buttonActiveBorder,
      boxShadow: buttonActiveShadow,
    } : {
      background: buttonInactiveBg,
      color: buttonInactiveColor,
      borderColor: buttonInactiveBorder,
      boxShadow: buttonInactiveShadow,
    })
  });

  const getCountBadgeStyle = (isActive) => ({
    marginLeft: '8px',
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    minWidth: '18px',
    textAlign: 'center',
    ...(isActive ? {
      background: badgeActiveBg,
      color: 'white',
    } : {
      background: badgeInactiveBg,
      color: badgeInactiveColor,
    })
  });
  return (    <div style={{ 
      marginBottom: '32px',
      background: filterBg,
      padding: '20px',
      borderRadius: '16px',
      boxShadow: filterShadow,
      border: `1px solid ${filterBorder}`,
    }}>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: '700',
        color: filterTitleColor,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🔍</span>
        Filter by Status
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px',
      }}>
        {filters.map(({ key, label, count, icon }) => (
          <button
            key={key}
            onClick={() => onStatusChange(key)}
            style={getButtonStyle(currentStatus === key)}            onMouseEnter={(e) => {
              if (currentStatus !== key) {
                e.target.style.borderColor = buttonHoverBorder;
              }
            }}
            onMouseLeave={(e) => {
              if (currentStatus !== key) {
                e.target.style.borderColor = buttonInactiveBorder;
              }
            }}
          >
            <span style={{ marginRight: '6px', fontSize: '16px' }}>{icon}</span>
            {label}
            {count !== undefined && (
              <span style={getCountBadgeStyle(currentStatus === key)}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InternshipFilter;
