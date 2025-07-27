import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/home" className="nav-logo">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Fursa Logo" className="logo-img" />
          <span className="logo-text">Fursa</span>
          <span className="logo-dot">.</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/home">{t('nav.home')}</Link>
          {user && user.role === 'student' && (
            <Link to="/status">{t('nav.dashboard')}</Link>
          )}
          <Link to="/settings">{t('nav.settings')}</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSwitcher size="sm" variant="ghost" />
          <ThemeToggle />
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
