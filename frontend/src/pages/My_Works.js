import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import "../style/style.css";
import { getProjects } from "../services/api";

const My_Works = () => {
  const [ownerWorks, setOwnerWorks] = useState([]);
  const [memberWorks, setMemberWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await getProjects(token);
        console.log('API response:', response.data.body); // Для дебага

        const completedOwnerWorks = Array.isArray(response.data.body.owner_projects)
          ? response.data.body.owner_projects.filter(project => project.status === 'completed')
          : [];
        const completedMemberWorks = Array.isArray(response.data.body.member_projects)
          ? response.data.body.member_projects.filter(project => project.status === 'completed')
          : [];

        setOwnerWorks(completedOwnerWorks);
        setMemberWorks(completedMemberWorks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата неизвестна';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const filterWorks = (works) => {
    if (activeFilter === 'all') return works;
    return works.filter(work => work.category === activeFilter);
  };

  const renderWorkCard = (work) => (
    <div key={work.id} className="work-card">
      <div className="work-image">
        <span className="work-badge">
          {work.category || 'Проект'}
        </span>
      </div>
      <div className="work-content">
        <h3 className="work-title">{work.title}</h3>
        <p className="work-description">
          {work.description || 'Описание отсутствует'}
        </p>
        <div className="work-meta">
          <span>Завершено: {formatDate(work.updated_at || work.created_at)}</span>
        </div>
        <div className="work-actions">
          <button
            className="work-btn work-btn-primary"
            onClick={() => navigate(`/work/${work.id}`)}
          >
            Просмотреть
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <div className="loading">Загрузка работ...</div>
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

  const filteredOwnerWorks = filterWorks(ownerWorks);
  const filteredMemberWorks = filterWorks(memberWorks);

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <div className="portfolio-container">
          <div className="portfolio-header">
            <div className="page-title">
              <h1>Мои работы</h1>
              <p className='desc'>Здесь собраны все ваши завершённые проекты и работы</p>
            </div>
          </div>

          <div className="filter-controls">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Все работы
            </button>
            <button
              className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
              onClick={() => setActiveFilter('web')}
            >
              Веб-разработка
            </button>
            <button
              className={`filter-btn ${activeFilter === 'design' ? 'active' : ''}`}
              onClick={() => setActiveFilter('design')}
            >
              Дизайн
            </button>
            <button
              className={`filter-btn ${activeFilter === 'research' ? 'active' : ''}`}
              onClick={() => setActiveFilter('research')}
            >
              Исследования
            </button>
            <button
              className={`filter-btn ${activeFilter === 'mobile' ? 'active' : ''}`}
              onClick={() => setActiveFilter('mobile')}
            >
              Мобильные приложения
            </button>
          </div>

          <section className="projects-section">
            <h2 className="section-title">Мои завершённые проекты</h2>
            {filteredOwnerWorks.length === 0 ? (
              <div className="no-projects-message">
                <h3 className='desc'>У вас нет созданных завершённых работ</h3>
                <p className='desc'>Завершайте свои проекты, чтобы они отобразились здесь!</p>
              </div>
            ) : (
              <div className="works-grid">
                {filteredOwnerWorks.map(renderWorkCard)}
              </div>
            )}
          </section>

          <section className="projects-section">
            <h2 className="section-title">Завершённые проекты, в которых я участвую</h2>
            {filteredMemberWorks.length === 0 ? (
              <div className="no-projects-message">
                <h3 className='desc'>У вас нет завершённых работ в чужих проектах</h3>
                <p className='desc'>Участвуйте в проектах коллег, чтобы они появились здесь!</p>
              </div>
            ) : (
              <div className="works-grid">
                {filteredMemberWorks.map(renderWorkCard)}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default My_Works;