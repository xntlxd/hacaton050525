import React, { useState, useEffect } from 'react';
import '../style/style.css';

const Sidebar = () => {
  const [user, setUser] = useState({ email: '', role: 0 });

  useEffect(() => {
    // Загрузка данных пользователя
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:5000/api/v1/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Не удалось загрузить данные пользователя');
        const data = await response.json();
        console.log('Sidebar API response:', data); // Debug log
        setUser(data.data.body || { email: '', role: 0 });
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        setUser({ email: 'Ошибка загрузки', role: 0 });
      }
    };

    fetchUser();
  }, []);

  // Определяем email и первую букву для аватара
  const displayName = user.email.split("@")[0] || 'Пользователь';
  const avatarLetter = displayName[0]?.toUpperCase() || 'П';
  const roleText = user.role === 3 ? 'Владелец' : 'Участник';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="/dashboard" className="sidebar-logo">Nonefolio</a>
        <a href="/profile"><div className="user-profile">
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <h4>{displayName}</h4>
            <p>{roleText}</p>
          </div>
        </div></a>
      </div>
      <nav className="sidebar-menu">
        <p className="menu-title">Основное</p>
        <a href="/create_project" className="menu-item">
          <i>➕</i>
          <span>Новый проект</span>
        </a>
        <a href="/notifications" className="menu-item">
          <i>💬</i>
          <span>Уведомления</span>
        </a>
        <p className="menu-title">Портфолио</p>
        <a href="/dashboard" className="menu-item">
          <i>📋</i>
          <span>Мои проекты</span>
        </a>
        <p className="menu-title">Настройки</p>
        <a href="/profile" className="menu-item">
          <i>⚙️</i>
          <span>Профиль</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;