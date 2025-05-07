import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProjectView = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Токен доступа не найден');

        const response = await fetch(`/api/v1/projects?project_id=${projectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка ${response.status}: ${errorText.slice(0, 100)}`);
        }

        const data = await response.json();
        
        if (data?.meta?.status === 'OK' && data?.data?.body) {
          // Форматируем данные для удобства использования
          const formattedProject = {
            ...data.data.body,
            status: data.data.body.status || 'active',
            tags: data.data.body.tags || [],
            features: data.data.body.features || [],
            users: data.data.body.users || []
          };
          setProject(formattedProject);
        } else {
          throw new Error(data?.meta?.message || 'Неверная структура ответа');
        }
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке проекта');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center h-screen">Проект не найден</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <div className="project-view-container">
          <div className="project-header">
            <div className="project-meta-large">
              <h1 className="project-title">{project.title || 'Без названия'}</h1>
              <div className="project-meta-info">
                <span className={`status ${project.status === 'active' ? 'status-active' : 'status-paused'}`}>
                  {project.status === 'active' ? 'Активный' : 'Неактивный'}
                </span>
                <span>Создан: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="project-details">
            <div className="project-main">
              <div className="project-card">
                <div className="project-section">
                  <h3>Описание проекта</h3>
                  <p className="desc">{project.description || 'Описание отсутствует'}</p>
                  <p className="desc">Основные функции:</p>
                  <ul className="desc list-disc pl-5">
                    {project.features.length > 0 ? (
                      project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))
                    ) : (
                      <li>Функции не указаны</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="project-card">
                <div className="project-section">
                  <h3>Участники проекта</h3>
                  <div className="project-members">
                    {project.users.length > 0 ? (
                      project.users.map((user) => (
                        <div key={user.user_id} className="member-card">
                          <div className="member-info">
                            <h4>{user.nickname || user.email}</h4>
                            <p>
                              {user.role === 3 ? 'Владелец' : 
                               user.role === 2 ? 'Администратор' : 
                               user.role === 1 ? 'Участник' : 'Заблокирован'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="desc">Участники не найдены</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="project-sidebar">
              <div className="project-card">
                <div className="sidebar-section">
                  <h3>Детали проекта</h3>
                  <div className="detail-item">
                    <span className="detail-label">Статус:</span>
                    <span className={`detail-value ${project.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {project.status === 'active' ? 'Активный' : 'Неактивный'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Создан:</span>
                    <span className="detail-value">
                      {new Date(project.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Обновлен:</span>
                    <span className="detail-value">
                      {project.updated_at ? new Date(project.updated_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <div className="sidebar-section">
                  <h3>Технологии</h3>
                  <div className="tech-tags">
                    {project.tags.length > 0 ? (
                      project.tags.map((tag) => (
                        <span key={tag} className="tech-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Технологии не указаны</span>
                    )}
                  </div>
                </div>
              </div>
              <Link
                  to={`/project/${projectId}/cards`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <div className="project-card">
                    <div className="sidebar-section cardbtn">Перейти к доскам</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectView;