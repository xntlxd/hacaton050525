const API_BASE_URL = 'http://localhost:5000/api/v1';

export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.meta.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth`, {
      method: 'POST',
      credentials: 'include',  // Для работы с куками
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.meta.message || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',  // Для работы с куками
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const getUserInfo = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

export const createProject = async (token, title, description) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.meta.message || 'Project creation failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};