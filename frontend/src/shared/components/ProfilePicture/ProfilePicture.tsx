import React, { useState, useRef } from 'react';
import { uploadProfilePicture, deleteProfilePicture } from '../../config/api';
import { toast } from 'react-toastify';
import './ProfilePicture.css';

interface ProfilePictureProps {
  currentImage?: {
    url: string;
    public_id: string;
  };
  username: string;
  onImageUpdate: (newImage: { url: string; public_id: string } | null) => void;
  isEditable?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  currentImage,
  username,
  onImageUpdate,
  isEditable = false,
  size = 'medium'
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadProfilePicture(file);
      onImageUpdate(response.data.image);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImage) return;

    setUploading(true);
    try {
      await deleteProfilePicture();
      onImageUpdate(null);
      toast.success('Profile picture removed successfully!');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'profile-picture-small';
      case 'large': return 'profile-picture-large';
      default: return 'profile-picture-medium';
    }
  };

  return (
    <div className={`profile-picture-container ${getSizeClass()}`}>
      <div className="profile-picture-wrapper">
        {currentImage ? (
          <img 
            src={currentImage.url} 
            alt={`${username}'s profile`}
            className="profile-picture-img"
          />
        ) : (
          <div className="profile-picture-placeholder">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        
        {isEditable && (
          <div className="profile-picture-overlay">
            {uploading ? (
              <div className="uploading-spinner">⏳</div>
            ) : (
              <div className="picture-actions">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="picture-action-btn upload-btn"
                  title="Upload new picture"
                >
                  📷
                </button>
                {currentImage && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="picture-action-btn delete-btn"
                    title="Remove picture"
                  >
                    🗑️
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {isEditable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden-file-input"
        />
      )}
    </div>
  );
};

export default ProfilePicture;