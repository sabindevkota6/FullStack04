import axiosInstance from './axiosinstance';

// Auth endpoints
export const login = (data: {username: string, password: string}) => {
  return axiosInstance.post('/auth/login', data);
};

export const register = (data: {username: string, email: string, password: string}) => {
  return axiosInstance.post('/auth/register', data);
};

// User profile endpoints
export const getUserProfile = () => {
  return axiosInstance.get('/users/profile');
};

export const updateProfile = (data: any) => {
  return axiosInstance.put('/users/profile', data);
};

// Experience endpoints
export const addExperience = (data: any) => {
  return axiosInstance.post('/users/experience', data);
};

export const updateExperience = (id: string, data: any) => {
  return axiosInstance.put(`/users/experience/${id}`, data);
};

export const deleteExperience = (id: string) => {
  return axiosInstance.delete(`/users/experience/${id}`);
};

// Education endpoints
export const addEducation = (data: any) => {
  return axiosInstance.post('/users/education', data);
};

export const updateEducation = (id: string, data: any) => {
  return axiosInstance.put(`/users/education/${id}`, data);
};

export const deleteEducation = (id: string) => {
  return axiosInstance.delete(`/users/education/${id}`);
};

// User search/list endpoints
export const getUserList = () => {
  return axiosInstance.get('/users');
};

export const searchUsers = (query: string) => {
  return axiosInstance.get(`/users/search?query=${query}`); 
};

// Profile Picture endpoints
export const uploadProfilePicture = (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return axiosInstance.patch('/users/uploadProfilePic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProfilePicture = () => {
  return axiosInstance.delete('/users/deleteProfilePicture');
};