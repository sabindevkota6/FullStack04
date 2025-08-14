import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './navigation.css';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('currentUser');
    
    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to={isAuthenticated ? "/home" : "/login"}>M&R Solutions</Link>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {isAuthenticated && (
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <Link 
                to="/home" 
                className={location.pathname === '/home' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={location.pathname === '/profile' ? 'active' : ''}
              >
                Profile
              </Link>
            </li>
          </ul>
        )}
        
        <div className={`nav-user ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated && currentUser ? (
            <div className="user-info">
              <div className="user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              
              <span className="username">{currentUser.username}</span>
              <span style={{ display: "inline-block", width: "16px" }}></span>
              <button className="auth-button logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-info">
              (
                <button className="auth-button login" onClick={handleLogin}>
                  Login
                </button>
              )
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;