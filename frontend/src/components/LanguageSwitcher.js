import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const LanguageSwitcher = ({ size = 'md', variant = 'ghost' }) => {
  const { i18n, t } = useTranslation();
  
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('gray.700', 'white');
  const menuBg = useColorModeValue('white', 'gray.800');
  const menuItemHoverBg = useColorModeValue('gray.100', 'gray.700');
  const menuItemActiveBg = useColorModeValue('blue.50', 'blue.900');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
  const buttonActiveBg = useColorModeValue('gray.200', 'gray.600');
  const menuBorderColor = useColorModeValue('gray.200', 'gray.600');
  
  const currentLanguage = i18n.language;
  
  const languages = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'ar', name: t('language.arabic'), flag: '🇸🇦' },
  ];
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    // Update document lang attribute
    document.documentElement.lang = lng;
  };
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant={variant}
        size={size}
        bg={variant === 'solid' ? buttonBg : 'transparent'}
        color={buttonColor}
        rightIcon={<Icon as={FaChevronDown} />}
        _hover={{
          bg: buttonHoverBg,
        }}
        _active={{
          bg: buttonActiveBg,
        }}
      >
        <HStack spacing={2}>
          <Icon as={FaGlobe} />
          <Text display={{ base: 'none', md: 'block' }}>
            {currentLang.flag} {currentLang.name}
          </Text>
          <Text display={{ base: 'block', md: 'none' }}>
            {currentLang.flag}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList bg={menuBg} borderColor={menuBorderColor}>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            bg={currentLanguage === language.code ? menuItemActiveBg : 'transparent'}
            _hover={{
              bg: menuItemHoverBg,
            }}
          >
            <HStack spacing={3}>
              <Text fontSize="lg">{language.flag}</Text>
              <Text fontWeight={currentLanguage === language.code ? 'bold' : 'normal'}>
                {language.name}
              </Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
