import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = ({ size = 'md', variant = 'ghost' }) => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<FaMoon />, <FaSun />);
  const label = useColorModeValue('Switch to dark mode', 'Switch to light mode');
  
  return (
    <Tooltip label={label} placement="bottom">
      <IconButton
        aria-label="Toggle color mode"
        icon={icon}
        onClick={toggleColorMode}
        variant={variant}
        size={size}
        colorScheme={useColorModeValue('purple', 'yellow')}
        _hover={{
          transform: 'scale(1.1)',
          transition: 'transform 0.2s',
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;