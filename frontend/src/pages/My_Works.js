import Sidebar from "../components/Sidebar";
import "../style/style.css";

const My_Works = () => {
    return ( 
    <div className="dashboard">
        <Sidebar />
        <main className="main-content">
            <div className="portfolio-container">
                <div className="portfolio-header">
                    <div className="page-title">
                        <h1>Мои работы</h1>
                        <p>Здесь собраны все ваши завершенные проекты и работы</p>
                    </div>
                </div>
                
                <div className="filter-controls">
                    <button className="filter-btn active">Все работы</button>
                    <button className="filter-btn">Веб-разработка</button>
                    <button className="filter-btn">Дизайн</button>
                    <button className="filter-btn">Исследования</button>
                    <button className="filter-btn">Мобильные приложения</button>
                </div>
                
                <div className="works-grid">
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Веб-разработка</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">Корпоративный сайт для стартапа</h3>
                            <p className="work-description">Полноценный веб-сайт с адаптивным дизайном, системой блога и формой обратной связи. Реализована админ-панель для управления контентом.</p>
                            <div className="work-meta">
                                <span>Завершено: 15.05.2023</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Мобильные приложения</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">Приложение для учета финансов</h3>
                            <p className="work-description">Кроссплатформенное приложение для учета личных финансов с аналитикой расходов и синхронизацией между устройствами.</p>
                            <div className="work-meta">
                                <span>Завершено: 22.03.2023</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Дизайн</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">UI Kit для образовательной платформы</h3>
                            <p className="work-description">Дизайн-система с набором компонентов для быстрой разработки интерфейсов образовательного портала.</p>
                            <div className="work-meta">
                                <span>Завершено: 10.02.2023</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Исследования</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">Анализ ИИ в медицине</h3>
                            <p className="work-description">Исследование современных методов искусственного интеллекта для диагностики заболеваний по медицинским изображениям.</p>
                            <div className="work-meta">
                                <span>Завершено: 05.01.2023</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Веб-разработка</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">Аналитическая панель</h3>
                            <p className="work-description">Веб-приложение для анализа продаж и управления товарами на маркетплейсе с интеграцией API и графиками.</p>
                            <div className="work-meta">
                                <span>Завершено: 18.12.2022</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="work-card">
                        <div className="work-image">
                            <span className="work-badge">Мобильные приложения</span>
                        </div>
                        <div className="work-content">
                            <h3 className="work-title">Приложение для изучения языков</h3>
                            <p className="work-description">Интерактивное приложение для изучения иностранных языков с игровыми элементами и системой прогресса.</p>
                            <div className="work-meta">
                                <span>Завершено: 30.10.2022</span>
                            </div>
                            <div className="work-actions">
                                <a href="#" className="work-btn work-btn-primary">Просмотреть</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div> );
}
 
export default My_Works;