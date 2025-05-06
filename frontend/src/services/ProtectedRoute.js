import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshToken, getUserInfo } from './api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No token found');
        }

        // Проверяем токен
        const userInfo = await getUserInfo(token);
        
        // Если все ок, разрешаем доступ
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        
        // Пробуем обновить токен
        try {
          const refreshResponse = await refreshToken();
          localStorage.setItem('accessToken', refreshResponse.data.access_token);
          setIsAuthenticated(true);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;