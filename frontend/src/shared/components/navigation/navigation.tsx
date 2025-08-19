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
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('currentUser');
    
    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        console.log('Navigation user data:', userData);
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

  useEffect(() => {
    const handleStorageChange = () => {
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error parsing updated user data:', error);
        }
      }
    };


    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('userDataUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);
  
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
              <div className="nav-user-avatar">
                {currentUser.profilePicture?.url ? (
                  <img 
                    src={currentUser.profilePicture.url} 
                    alt={currentUser.username}
                    className="nav-profile-image"
                    onError={(e) => {
                      console.error('Failed to load nav image for user:', currentUser.username);
                      // Hide image and show placeholder on error
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="nav-avatar-placeholder"
                  style={{ display: currentUser.profilePicture?.url ? 'none' : 'flex' }}
                >
                  {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              
              <span className="username">{currentUser.username}</span>
              <span style={{ display: "inline-block", width: "16px" }}></span>
              <button className="auth-button logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-info">
              <button className="auth-button login" onClick={handleLogin}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;