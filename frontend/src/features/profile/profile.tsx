import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../shared/config/axiosinstance";
import { toast } from "react-toastify";
import "./profile.css";
import ProfilePicture from "../../shared/components/ProfilePicture/ProfilePicture";

interface IUser {
  _id?: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  profilePicture?: {
    url: string;
    public_id: string;
  } | null;
  skills?: string[];
  quickStats?: {
    connections: number;
    projects: number;
    endorsements: number;
  };
  contact?: {
    phone?: string;
    location?: string;
    website?: string;
  };
  experiences?: any[];
  education?: any[];
  certificates?: any[];
}


interface Education {
  degree: string;
  school: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Certificate {
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
  description?: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (currentUser && user) {
      setIsOwnProfile(!userId || userId === currentUser._id);
    }
  }, [currentUser, user, userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      let res;
      if (userId) {
        res = await axios.get(`/users/${userId}`);
      } else {
        res = await axios.get("/users/profile");
      }
      setUser(res.data);
      setFormData(res.data);
    } catch (err: any) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (!formData) return;
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    const parentKey = parent as keyof IUser;
    const currentParent = formData[parentKey];
    
    if (currentParent && typeof currentParent === 'object' && !Array.isArray(currentParent)) {
      setFormData({
        ...formData,
        [parent]: {
          ...currentParent,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [parent]: {
          [child]: value
        }
      });
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

const handleImageUpdate = (newImage: { url: string; public_id: string } | null) => {
  if (!user || !formData) return;

  const updatedUser: IUser = {
    ...user,
    profilePicture: newImage
  };

  const updatedFormData: IUser = {
    ...formData,
    profilePicture: newImage
  };
  
  setUser(updatedUser);
  setFormData(updatedFormData);

  if (isOwnProfile) {
    try {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        const parsedData = JSON.parse(currentUserData);
        parsedData.profilePicture = newImage;
        localStorage.setItem('currentUser', JSON.stringify(parsedData));
      }
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }
};

  const addSkill = () => {
    if (!formData) return;
    const newSkills = [...(formData.skills || []), ''];
    setFormData({ ...formData, skills: newSkills });
  };

  const updateSkill = (index: number, value: string) => {
    if (!formData) return;
    const newSkills = [...(formData.skills || [])];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    if (!formData) return;
    const newSkills = formData.skills?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, skills: newSkills });
  };

  const handleStatsChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      quickStats: {
        connections: formData.quickStats?.connections || 0,
        projects: formData.quickStats?.projects || 0,
        endorsements: formData.quickStats?.endorsements || 0,
        ...formData.quickStats,
        [field]: parseInt(value) || 0
      }
    });
  };

  const addEducation = () => {
    if (!formData) return;
    const newEducation: Education = {
      degree: '',
      school: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setFormData({
      ...formData,
      education: [...(formData.education || []), newEducation]
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    if (!formData) return;
    const newEducation = [...(formData.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    if (!formData) return;
    const newEducation = formData.education?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, education: newEducation });
  };

  const addExperience = () => {
    if (!formData) return;
    const newExperience: Experience = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setFormData({
      ...formData,
      experiences: [...(formData.experiences || []), newExperience]
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    if (!formData) return;
    const newExperiences = [...(formData.experiences || [])];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setFormData({ ...formData, experiences: newExperiences });
  };

  const removeExperience = (index: number) => {
    if (!formData) return;
    const newExperiences = formData.experiences?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, experiences: newExperiences });
  };

  const addCertificate = () => {
    if (!formData) return;
    const newCertificate: Certificate = {
      name: '',
      issuer: '',
      date: '',
      url: '',
      description: ''
    };
    setFormData({
      ...formData,
      certificates: [...(formData.certificates || []), newCertificate]
    });
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: any) => {
    if (!formData) return;
    const newCertificates = [...(formData.certificates || [])];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    setFormData({ ...formData, certificates: newCertificates });
  };

  const removeCertificate = (index: number) => {
    if (!formData) return;
    const newCertificates = formData.certificates?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, certificates: newCertificates });
  };

  const handleSave = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const res = await axios.put("/users/profile", formData);
      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error">{error}</div>;
  if (!user) return <div className="profile-container">No user data found.</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{isOwnProfile ? 'My Profile' : `${user.username}'s Profile`}</h1>
        {isOwnProfile && (
          <div className="header-buttons">
            <button 
              className="btn-secondary"
              onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            {editMode && (
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        )}
      </div>

      <div className="section">
        <h2>Personal Information</h2>
        <div className="personal-content">
          <div className="avatar-section">
  <ProfilePicture
    currentImage={user.profilePicture ?? undefined}
    username={user.username}
    onImageUpdate={handleImageUpdate}
    isEditable={editMode && isOwnProfile}
    size="large"
  />
</div>

          
          <div className="personal-details">
            {editMode && isOwnProfile ? (
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="username"
                    value={formData?.username || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="contact.phone"
                    value={formData?.contact?.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    name="contact.location"
                    value={formData?.contact?.location || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Website</label>
                  <input
                    name="contact.website"
                    value={formData?.contact?.website || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData?.bio || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Skills</label>
                  <div className="skills-edit">
                    {formData?.skills?.map((skill, index) => (
                      <div key={index} className="skill-input">
                        <input
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          placeholder="Enter skill"
                        />
                        <button type="button" onClick={() => removeSkill(index)}>×</button>
                      </div>
                    ))}
                    <button type="button" onClick={addSkill} className="btn-add">+ Add Skill</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="display-grid">
                <div className="detail">
                  <span className="label">Name:</span>
                  <span>{user.username}</span>
                </div>
                <div className="detail">
                  <span className="label">Email:</span>
                  <span>{user.email}</span>
                </div>
                {user.contact?.phone && (
                  <div className="detail">
                    <span className="label">Phone:</span>
                    <span>{user.contact.phone}</span>
                  </div>
                )}
                {user.contact?.location && (
                  <div className="detail">
                    <span className="label">Location:</span>
                    <span>{user.contact.location}</span>
                  </div>
                )}
                {user.contact?.website && (
                  <div className="detail">
                    <span className="label">Website:</span>
                    <a href={user.contact.website} target="_blank" rel="noopener noreferrer">
                      {user.contact.website}
                    </a>
                  </div>
                )}
                {user.bio && (
                  <div className="detail full-width">
                    <span className="label">About:</span>
                    <p>{user.bio}</p>
                  </div>
                )}
                {user.skills && user.skills.length > 0 && (
                  <div className="detail full-width">
                    <span className="label">Skills:</span>
                    <div className="skills">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Education & Certifications</h2>
        <div className="subsection">
          <div className="subsection-header">
            <h3>Education</h3>
            {editMode && isOwnProfile && (
              <button onClick={addEducation} className="btn-add">+ Add Education</button>
            )}
          </div>
          
          {editMode && isOwnProfile ? (
            <div className="edit-items">
              {formData?.education?.map((edu, index) => (
                <div key={index} className="edit-item">
                  <div className="edit-item-header">
                    <h4>Education #{index + 1}</h4>
                    <button onClick={() => removeEducation(index)} className="btn-remove">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>School</label>
                      <input
                        value={edu.school || ''}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        value={edu.field || ''}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(edu.startDate)}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(edu.endDate)}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        disabled={edu.current}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={edu.current || false}
                          onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                        />
                        Currently studying here
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={edu.description || ''}
                        onChange={(e) => updateEducation(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            user.education && user.education.length > 0 ? (
              <div className="items">
                {user.education.map((edu, index) => (
                  <div key={index} className="item">
                    <div className="item-header">
                      <h4>{edu.degree}</h4>
                      <span className="date">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="item-subtitle">{edu.school}</p>
                    {edu.field && <p className="item-text">Field: {edu.field}</p>}
                    {edu.description && <p className="item-description">{edu.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No education added yet.</p>
            )
          )}
        </div>

        <div className="subsection">
          <div className="subsection-header">
            <h3>Certifications</h3>
            {editMode && isOwnProfile && (
              <button onClick={addCertificate} className="btn-add">+ Add Certificate</button>
            )}
          </div>
          
          {editMode && isOwnProfile ? (
            <div className="edit-items">
              {formData?.certificates?.map((cert, index) => (
                <div key={index} className="edit-item">
                  <div className="edit-item-header">
                    <h4>Certificate #{index + 1}</h4>
                    <button onClick={() => removeCertificate(index)} className="btn-remove">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Certificate Name</label>
                      <input
                        value={cert.name || ''}
                        onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Issuer</label>
                      <input
                        value={cert.issuer || ''}
                        onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date Issued</label>
                      <input
                        type="date"
                        value={formatDateForInput(cert.date)}
                        onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Certificate URL</label>
                      <input
                        value={cert.url || ''}
                        onChange={(e) => updateCertificate(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={cert.description || ''}
                        onChange={(e) => updateCertificate(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            user.certificates && user.certificates.length > 0 ? (
              <div className="items">
                {user.certificates.map((cert, index) => (
                  <div key={index} className="item">
                    <div className="item-header">
                      <h4>{cert.name}</h4>
                      {cert.date && <span className="date">{formatDate(cert.date)}</span>}
                    </div>
                    {cert.issuer && <p className="item-subtitle">Issued by: {cert.issuer}</p>}
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-link">
                        View Certificate
                      </a>
                    )}
                    {cert.description && <p className="item-description">{cert.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No certifications added yet.</p>
            )
          )}
        </div>
      </div>

      <div className="section">
        <h2>Professional Experience & Stats</h2>
        <div className="subsection">
          <div className="subsection-header">
            <h3>Work Experience</h3>
            {editMode && isOwnProfile && (
              <button onClick={addExperience} className="btn-add">+ Add Experience</button>
            )}
          </div>
          
          {editMode && isOwnProfile ? (
            <div className="edit-items">
              {formData?.experiences?.map((exp, index) => (
                <div key={index} className="edit-item">
                  <div className="edit-item-header">
                    <h4>Experience #{index + 1}</h4>
                    <button onClick={() => removeExperience(index)} className="btn-remove">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input
                        value={exp.title || ''}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(exp.startDate)}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(exp.endDate)}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        />
                        Currently working here
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            user.experiences && user.experiences.length > 0 ? (
              <div className="items">
                {user.experiences.map((exp, index) => (
                  <div key={index} className="item">
                    <div className="item-header">
                      <h4>{exp.title}</h4>
                      <span className="date">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="item-subtitle">{exp.company}</p>
                    {exp.location && <p className="item-text">{exp.location}</p>}
                    {exp.description && <p className="item-description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No work experience added yet.</p>
            )
          )}
        </div>

        <div className="subsection">
          <h3>Quick Stats</h3>
          {editMode && isOwnProfile ? (
            <div className="stats-edit">
              <div className="stat-input">
                <label>Connections</label>
                <input
                  type="number"
                  value={formData?.quickStats?.connections || 0}
                  onChange={(e) => handleStatsChange('connections', e.target.value)}
                />
              </div>
              <div className="stat-input">
                <label>Projects</label>
                <input
                  type="number"
                  value={formData?.quickStats?.projects || 0}
                  onChange={(e) => handleStatsChange('projects', e.target.value)}
                />
              </div>
              <div className="stat-input">
                <label>Endorsements</label>
                <input
                  type="number"
                  value={formData?.quickStats?.endorsements || 0}
                  onChange={(e) => handleStatsChange('endorsements', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="stats-display">
              <div className="stat">
                <span className="stat-number">{user.quickStats?.connections || 0}</span>
                <span className="stat-label">Connections</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.quickStats?.projects || 0}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.quickStats?.endorsements || 0}</span>
                <span className="stat-label">Endorsements</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;