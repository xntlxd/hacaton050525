import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import "../style/style.css";
import { getProjects } from "../services/api";

const My_Projects = () => {
  const [ownerProjects, setOwnerProjects] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await getProjects(token);
        console.log('API response:', response.data.body); // Для дебага
        setOwnerProjects(Array.isArray(response.data.body.owner_projects) ? response.data.body.owner_projects : []);
        setMemberProjects(Array.isArray(response.data.body.member_projects) ? response.data.body.member_projects : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата неизвестна';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Обновлено давно';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Обновлено сегодня';
    if (diffInDays === 1) return 'Обновлено вчера';
    if (diffInDays < 7) return `Обновлено ${diffInDays} дня(ей) назад`;
    if (diffInDays < 30) return `Обновлено ${Math.floor(diffInDays / 7)} неделю(и) назад`;
    return `Обновлено ${Math.floor(diffInDays / 30)} месяц(ев) назад`;
  };

  const getStatusClass = (dateString) => {
    if (!dateString) return 'status-active';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) return 'status-active';
    if (diffInDays < 30) return 'status-paused';
    return 'status-completed';
  };

  const renderProjectCard = (project) => (
    <div
      key={project.id}
      className="project-card"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="project-image"></div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description || 'Описание отсутствует'}</p>
        <div className="project-meta">
          <span>{getTimeAgo(project.updated_at || project.created_at)}</span>
          <span className={`project-status ${getStatusClass(project.updated_at)}`}>
            {getStatusClass(project.updated_at) === 'status-active' ? 'Активный' :
             getStatusClass(project.updated_at) === 'status-paused' ? 'На паузе' : 'Завершен'}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <div className="loading">Загрузка проектов...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <div className="header">
          <div className="page-title">
            <h1>Мои проекты</h1>
            <p className='desc2'>Здесь собраны все ваши текущие и завершенные проекты</p>
          </div>
        </div>

        <section className="projects-section">
          <h2 className="section-title">Созданные проекты</h2>
          {ownerProjects.length === 0 ? (
            <div className="no-projects-message">
              <h3 className='desc2'>Вы не создавали проекты</h3>
              <p className='desc2'>Начните свой первый проект и воплотите идеи в жизнь!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {ownerProjects.map(renderProjectCard)}
            </div>
          )}
        </section>

        <section className="projects-section"> 
          <h2 className="section-title">Проекты, в которых вы участвуете</h2>
          {memberProjects.length === 0 ? (
            <div className="no-projects-message">
              <h3 className='desc2'>Вы не состоите в чужих проектах</h3>
              <p className='desc2'>Присоединяйтесь к проектам коллег или создайте свой!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {memberProjects.map(renderProjectCard)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default My_Projects;