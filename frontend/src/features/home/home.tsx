// frontend/src/features/home/home.tsx - Updated with basic lightweight details

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { getUserList, searchUsers } from '../../shared/config/api';
import './home.css';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  quickStats?: {
    connections: number;
    projects: number;
    endorsements: number;
  };
}

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Load current user data
        const userString = localStorage.getItem('currentUser');
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                setCurrentUser(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        // Load initial user list
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await getUserList();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            // If search is empty, fetch all users
            fetchUsers();
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await searchUsers(searchQuery);
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error searching users:', error);
            setError('Failed to search users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            {currentUser && (
                <div className="welcome-banner">
                    <h1>Welcome, {currentUser.username}!</h1>
                    <p>Connect with professionals in your network</p>
                </div>
            )}
            
            <div className="search-section">
                <h2>Find People</h2>
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by username..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>

            <div className="users-section">
                <h2>People You May Know</h2>
                
                {loading && <div className="loading">Loading...</div>}
                
                {error && <div className="error-message">{error}</div>}
                
                {!loading && !error && users.length === 0 && (
                    <div className="no-users">No users found</div>
                )}
                
                <div className="users-grid">
                    {users.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="user-name">{user.username}</h3>
                            <p className="user-email">{user.email}</p>
                            
                            {user.location && (
                                <p className="user-location">📍 {user.location}</p>
                            )}
                            
                            {user.bio && (
                                <p className="user-bio">{user.bio}</p>
                            )}
                            
                            {user.skills && user.skills.length > 0 && (
                                <div className="user-skills">
                                    {user.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {user.quickStats && (
                                <div className="user-stats">
                                    <div className="stat">
                                        <span className="stat-number">{user.quickStats.connections}</span>
                                        <span className="stat-label">Connections</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">{user.quickStats.projects}</span>
                                        <span className="stat-label">Projects</span>
                                    </div>
                                </div>
                            )}
                            
                            <button className="connect-button">Connect</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;