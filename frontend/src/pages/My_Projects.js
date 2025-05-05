import Sidebar from "../components/Sidebar";
import "../style/style.css";

const My_Projects = () => {
    return ( 
    <div class="dashboard">
        <Sidebar />
        
        <main class="main-content">
            <div class="header">
                <div class="page-title">
                    <h1>Мои проекты</h1>
                    <p>Здесь собраны все ваши текущие и завершенные проекты</p>
                </div>
            </div>
            
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-image" style="background-image: url('https://source.unsplash.com/random/600x400/?project')"></div>
                    <div class="project-content">
                        <h3 class="project-title">Разработка мобильного приложения</h3>
                        <p class="project-description">Приложение для учета личных финансов с аналитикой расходов и доходов. Включает диаграммы, категории и напоминания.</p>
                        <div class="project-meta">
                            <span>Обновлено 2 дня назад</span>
                            <span class="project-status status-active">Активный</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-card">
                    <div class="project-image" style="background-image: url('https://source.unsplash.com/random/600x400/?design')"></div>
                    <div class="project-content">
                        <h3 class="project-title">Дизайн сайта для школы</h3>
                        <p class="project-description">Современный адаптивный дизайн сайта для общеобразовательной школы с системой управления контентом.</p>
                        <div class="project-meta">
                            <span>Обновлено 1 неделю назад</span>
                            <span class="project-status status-paused">На паузе</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-card">
                    <div class="project-image" style="background-image: url('https://source.unsplash.com/random/600x400/?research')"></div>
                    <div class="project-content">
                        <h3 class="project-title">Исследование ИИ в медицине</h3>
                        <p class="project-description">Анализ современных методов искусственного интеллекта для диагностики заболеваний по медицинским изображениям.</p>
                        <div class="project-meta">
                            <span>Обновлено 3 недели назад</span>
                            <span class="project-status status-completed">Завершен</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-card">
                    <div class="project-image" style="background-image: url('https://source.unsplash.com/random/600x400/?education')"></div>
                    <div class="project-content">
                        <h3 class="project-title">Образовательная платформа</h3>
                        <p class="project-description">Прототип платформы для дистанционного обучения с видеоуроками, тестами и системой отслеживания прогресса.</p>
                        <div class="project-meta">
                            <span>Обновлено 1 месяц назад</span>
                            <span class="project-status status-completed">Завершен</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div> 
    );
}
 
export default My_Projects;