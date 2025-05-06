// import Sidebar from "../components/Sidebar";
// import "../style/style.css";

// const Profile = () => {
//     return ( 
//     <>
//     <Sidebar />
//     <main className="main-content">
//         <div className="profile-container">
//             <div className="profile-header">
//                 <div className="profile-avatar">
//                     <span>АИ</span>
//                     <div className="avatar-upload">
//                         Изменить
//                         <input type="file" accept="image/*" />
//                     </div>
//                 </div>
//                 <div className="profile-info">
//                     <h1 className="profile-name">Алексей Иванов</h1>
//                     <span className="profile-role">Участник</span>
//                     <p className="profile-bio">Студент 3 курса, направление "Веб-разработка". Увлекаюсь созданием современных пользовательских интерфейсов и изучением новых технологий.</p>
                    
//                     <div className="profile-stats">
//                         <div className="stat-item">
//                             <div className="stat-value">24</div>
//                             <div className="stat-label">Проекта</div>
//                         </div>
//                     </div>
                    
//                     <div className="profile-actions">
//                         <button className="btn">Редактировать профиль</button>
//                     </div>
//                 </div>
//             </div>
            
//             <div className="profile-tabs">
//                 <div className="tab active" data-tab="about">Обо мне</div>
//                 <div className="tab" data-tab="projects">Проекты</div>
//                 <div className="tab" data-tab="activity">Активность</div>
//                 <div className="tab" data-tab="settings">Настройки</div>
//             </div>
            
//             <div id="about" className="tab-content active">
//                 <div className="profile-section">
//                     <h2 className="section-title">
//                         Основная информация
//                         <button className="edit-btn">
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                                 <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                             </svg>
//                             Редактировать
//                         </button>
//                     </h2>
//                     <div className="form-row">
//                         <div className="form-col">
//                             <div className="form-group">
//                                 <label>Имя</label>
//                                 <p>Алексей</p>
//                             </div>
//                         </div>
//                         <div className="form-col">
//                             <div className="form-group">
//                                 <label>Фамилия</label>
//                                 <p>Иванов</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label>Email</label>
//                         <p>alexey.ivanov@example.com</p>
//                     </div>
//                     <div className="form-group">
//                         <label>О себе</label>
//                         <p>Я учусь на 3 курсе университета по направлению "Информационные технологии". Специализируюсь на веб-разработке, особенно интересует фронтенд с использованием современных фреймворков. В свободное время изучаю UI/UX дизайн и пробую создавать собственные проекты.</p>
//                     </div>
//                 </div>
                
//                 <div className="profile-section">
//                     <h2 className="section-title">
//                         Навыки
//                         <button className="edit-btn">
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                                 <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                             </svg>
//                             Редактировать
//                         </button>
//                     </h2>
//                     <div className="skills-list">
//                         <div className="skill-tag">
//                             HTML/CSS
//                             <span className="remove-skill">&times;</span>
//                         </div>
//                         <div className="skill-tag">
//                             JavaScript
//                             <span className="remove-skill">&times;</span>
//                         </div>
//                         <div className="skill-tag">
//                             React
//                             <span className="remove-skill">&times;</span>
//                         </div>
//                         <div className="skill-tag">
//                             UI/UX Design
//                             <span className="remove-skill">&times;</span>
//                         </div>
//                         <div className="skill-tag">
//                             Figma
//                             <span className="remove-skill">&times;</span>
//                         </div>
//                     </div>
//                     <div className="add-skill">
//                         <input type="text" className="form-control" placeholder="Добавить навык" />
//                         <button className="btn">Добавить</button>
//                     </div>
//                 </div>
//             </div>
            
//             <div id="projects" className="tab-content">
//                 <div className="profile-section">
//                     <h2 className="section-title">Мои проекты</h2>
//                     <p>Здесь будут отображаться все ваши проекты. В настоящее время у вас нет активных проектов.</p>
//                 </div>
//             </div>
            
//             <div id="activity" className="tab-content">
//                 <div className="profile-section">
//                     <h2 className="section-title">Активность</h2>
//                     <p>Здесь будет отображаться ваша активность на платформе.</p>
//                 </div>
//             </div>
            
//             <div id="settings" className="tab-content">
//                 <div className="profile-section">
//                     <h2 className="section-title">Настройки профиля</h2>
//                     <p>Здесь вы можете изменить настройки вашего профиля.</p>
//                 </div>
//             </div>
//         </div>
//     </main>
//     </>
// );
// }
 
// export default Profile;

import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import "../style/style.css";

const Profile = () => {
  const [user, setUser] = useState({ email: '', nickname: '', role: 0, created_at: '' });
  const [projects, setProjects] = useState({ owner: [], member: [] });
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nickname: '' });
  const [skills, setSkills] = useState(['HTML/CSS', 'JavaScript', 'React', 'UI/UX Дизайн', 'Figma']);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    // Загрузка данных профиля
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:5000/api/v1/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Не удалось загрузить профиль');
        const data = await response.json();
        setUser(data.data.body);
        setFormData({ nickname: data.data.body.nickname || '' });
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    // Загрузка проектов пользователя
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:5000/api/v1/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Не удалось загрузить проекты');
        const data = await response.json();
        setProjects({
          owner: data.data.body.owner_projects,
          member: data.data.body.member_projects
        });
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
      }
    };

    fetchProfile();
    fetchProjects();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/v1/users', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Не удалось обновить профиль');
      const data = await response.json();
      setUser(data.data.body);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <>
      <Sidebar />
      <main className="main-content p-6">
        <div className="profile-container max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="profile-header flex flex-col md:flex-row items-center md:items-start mb-6">
            <div className="profile-avatar relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6">
              <span className="text-2xl font-bold text-gray-600">
                {user.nickname ? user.nickname[0].toUpperCase() : 'П'}
              </span>
              <div className="avatar-upload absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
                Изменить
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div className="profile-info flex-1">
              <h1 className="profile-name text-2xl font-bold">{user.nickname || 'Пользователь'}</h1>
              <span className="profile-role text-gray-600">{user.role === 3 ? 'Владелец' : 'Участник'}</span>
              <p className="profile-bio text-gray-700 mt-2">Биография недоступна.</p>
              <div className="profile-stats flex mt-4">
                <div className="stat-item mr-6">
                  <div className="stat-value text-lg font-semibold">{projects.owner.length + projects.member.length}</div>
                  <div className="stat-label text-gray-600">Проекты</div>
                </div>
              </div>
              <div className="profile-actions mt-4">
                <button onClick={handleEdit} className="btn">
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>

          <div className="profile-tabs flex border-b mb-6">
            {['about', 'projects', 'activity', 'settings'].map(tab => (
              <div
                key={tab}
                className={`tab px-4 py-2 cursor-pointer ${activeTab === tab ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'about' ? 'Обо мне' : tab === 'projects' ? 'Проекты' : tab === 'activity' ? 'Активность' : 'Настройки'}
              </div>
            ))}
          </div>

          {activeTab === 'about' && (
            <div id="about" className="tab-content">
              <div className="profile-section mb-6">
                <h2 className="section-title text-xl font-semibold mb-4 flex justify-between items-center">
                  Основная информация
                  {isEditing ? (
                    <button onClick={handleSave} className="text-blue-500 flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Сохранить
                    </button>
                  ) : (
                    <button onClick={handleEdit} className="text-blue-500 flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Редактировать
                    </button>
                  )}
                </h2>
                <div className="form-group mb-4">
                  <label className="block text-gray-600">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div className="form-group mb-4">
                  <label className="block text-gray-600">Псевдоним</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-800">{user.nickname || 'Не установлен'}</p>
                  )}
                </div>
              </div>
              <div className="profile-section">
                <h2 className="section-title text-xl font-semibold mb-4 flex justify-between items-center">
                  Навыки
                  <button onClick={handleEdit} className="text-blue-500 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Редактировать
                  </button>
                </h2>
                <div className="skills-list flex flex-wrap gap-2 mb-4">
                  {skills.map(skill => (
                    <div key={skill} className="skill-tag bg-gray-200 px-3 py-1 rounded flex items-center">
                      {skill}
                      <span
                        className="remove-skill ml-2 cursor-pointer text-red-500"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
                <div className="add-skill flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="form-control border rounded px-3 py-2 flex-1"
                    placeholder="Добавить навык"
                  />
                  <button onClick={handleAddSkill} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div id="projects" className="tab-content">
              <div className="profile-section">
                <h2 className="section-title text-xl font-semibold mb-4">Мои проекты</h2>
                {projects.owner.length === 0 && projects.member.length === 0 ? (
                  <p>Нет активных проектов.</p>
                ) : (
                  <div className="projects-list">
                    <h3 className="text-lg font-semibold mb-2">Проекты владельца</h3>
                    {projects.owner.map(project => (
                      <div key={project.id} className="project-item border p-4 mb-4 rounded">
                        <h4 className="text-xl">{project.title}</h4>
                        <p>{project.description}</p>
                        <p className="text-gray-600">Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}</p>
                      </div>
                    ))}
                    <h3 className="text-lg font-semibold mb-2">Проекты участника</h3>
                    {projects.member.map(project => (
                      <div key={project.id} className="project-item border p-4 mb-4 rounded">
                        <h4 className="text-xl">{project.title}</h4>
                        <p>{project.description}</p>
                        <p className="text-gray-600">Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div id="activity" className="tab-content">
              <div className="profile-section">
                <h2 className="section-title text-xl font-semibold mb-4">Активность</h2>
                <p>Здесь будет отображаться ваша активность на платформе.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div id="settings" className="tab-content">
              <div className="profile-section">
                <h2 className="section-title text-xl font-semibold mb-4">Настройки профиля</h2>
                <p>Здесь вы можете изменить настройки вашего профиля.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Profile;