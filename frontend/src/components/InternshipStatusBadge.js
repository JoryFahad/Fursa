import React from 'react';

const InternshipStatusBadge = ({ isOpen, applicationDeadline, className = '' }) => {
  // Fallback logic if backend doesn't provide status fields yet
  const deadline = applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now as fallback
  const isDeadlinePassed = new Date(deadline) < new Date();
  const internshipIsOpen = isOpen !== undefined ? isOpen : true; // Default to open if not provided
  const isActuallyOpen = internshipIsOpen && !isDeadlinePassed;
    const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    ...(isActuallyOpen ? {
      background: '#ecfdf5',
      color: '#047857',
      borderColor: '#a7f3d0',
    } : {
      background: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fecaca',
    })
  };

  return (
    <span style={badgeStyle} className={className}>
      <span style={{ marginRight: '4px' }}>
        {isActuallyOpen ? '🟢' : '🔴'}
      </span>
      {isActuallyOpen ? 'Open' : 'Closed'}
    </span>
  );
};

export default InternshipStatusBadge;
