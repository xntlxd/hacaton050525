import Sidebar from "../components/Sidebar";
import "../style/style.css";

const My_Projects = () => {
    return ( 
    <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
            <div className="header">
                <div className="page-title">
                    <h1>Мои проекты</h1>
                    <p>Здесь собраны все ваши текущие и завершенные проекты</p>
                </div>
            </div>
            
            <div className="projects-grid">
                <div className="project-card">
                    <div className="project-image"></div>
                    <div className="project-content">
                        <h3 className="project-title">Разработка мобильного приложения</h3>
                        <p className="project-description">Приложение для учета личных финансов с аналитикой расходов и доходов. Включает диаграммы, категории и напоминания.</p>
                        <div className="project-meta">
                            <span>Обновлено 2 дня назад</span>
                            <span className="project-status status-active">Активный</span>
                        </div>
                    </div>
                </div>
                
                <div className="project-card">
                    <div className="project-image"></div>
                    <div className="project-content">
                        <h3 className="project-title">Дизайн сайта для школы</h3>
                        <p className="project-description">Современный адаптивный дизайн сайта для общеобразовательной школы с системой управления контентом.</p>
                        <div className="project-meta">
                            <span>Обновлено 1 неделю назад</span>
                            <span className="project-status status-paused">На паузе</span>
                        </div>
                    </div>
                </div>
                
                <div className="project-card">
                    <div className="project-image"></div>
                    <div className="project-content">
                        <h3 className="project-title">Исследование ИИ в медицине</h3>
                        <p className="project-description">Анализ современных методов искусственного интеллекта для диагностики заболеваний по медицинским изображениям.</p>
                        <div className="project-meta">
                            <span>Обновлено 3 недели назад</span>
                            <span className="project-status status-completed">Завершен</span>
                        </div>
                    </div>
                </div>
                
                <div className="project-card">
                    <div className="project-image"></div>
                    <div className="project-content">
                        <h3 className="project-title">Образовательная платформа</h3>
                        <p className="project-description">Прототип платформы для дистанционного обучения с видеоуроками, тестами и системой отслеживания прогресса.</p>
                        <div className="project-meta">
                            <span>Обновлено 1 месяц назад</span>
                            <span className="project-status status-completed">Завершен</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div> 
    );
}
 
export default My_Projects;