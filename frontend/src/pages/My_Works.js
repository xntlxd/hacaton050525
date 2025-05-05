import Sidebar from "../components/Sidebar";
import "../style/style.css";

const My_Works = () => {
    return ( 
    <div class="dashboard">
        <Sidebar />
        <main class="main-content">
            <div class="portfolio-container">
                <div class="portfolio-header">
                    <div class="page-title">
                        <h1>Мои работы</h1>
                        <p>Здесь собраны все ваши завершенные проекты и работы</p>
                    </div>
                </div>
                
                <div class="filter-controls">
                    <button class="filter-btn active">Все работы</button>
                    <button class="filter-btn">Веб-разработка</button>
                    <button class="filter-btn">Дизайн</button>
                    <button class="filter-btn">Исследования</button>
                    <button class="filter-btn">Мобильные приложения</button>
                </div>
                
                <div class="works-grid">
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?website')">
                            <span class="work-badge">Веб-разработка</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">Корпоративный сайт для стартапа</h3>
                            <p class="work-description">Полноценный веб-сайт с адаптивным дизайном, системой блога и формой обратной связи. Реализована админ-панель для управления контентом.</p>
                            <div class="work-meta">
                                <span>Завершено: 15.05.2023</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?app')">
                            <span class="work-badge">Мобильные приложения</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">Приложение для учета финансов</h3>
                            <p class="work-description">Кроссплатформенное приложение для учета личных финансов с аналитикой расходов и синхронизацией между устройствами.</p>
                            <div class="work-meta">
                                <span>Завершено: 22.03.2023</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?design')">
                            <span class="work-badge">Дизайн</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">UI Kit для образовательной платформы</h3>
                            <p class="work-description">Дизайн-система с набором компонентов для быстрой разработки интерфейсов образовательного портала.</p>
                            <div class="work-meta">
                                <span>Завершено: 10.02.2023</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?research')">
                            <span class="work-badge">Исследования</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">Анализ ИИ в медицине</h3>
                            <p class="work-description">Исследование современных методов искусственного интеллекта для диагностики заболеваний по медицинским изображениям.</p>
                            <div class="work-meta">
                                <span>Завершено: 05.01.2023</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?dashboard')">
                            <span class="work-badge">Веб-разработка</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">Аналитическая панель</h3>
                            <p class="work-description">Веб-приложение для анализа продаж и управления товарами на маркетплейсе с интеграцией API и графиками.</p>
                            <div class="work-meta">
                                <span>Завершено: 18.12.2022</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="work-card">
                        <div class="work-image" style="background-image: url('https://source.unsplash.com/random/600x400/?mobile')">
                            <span class="work-badge">Мобильные приложения</span>
                        </div>
                        <div class="work-content">
                            <h3 class="work-title">Приложение для изучения языков</h3>
                            <p class="work-description">Интерактивное приложение для изучения иностранных языков с игровыми элементами и системой прогресса.</p>
                            <div class="work-meta">
                                <span>Завершено: 30.10.2022</span>
                            </div>
                            <div class="work-actions">
                                <a href="#" class="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div> );
}
 
export default My_Works;