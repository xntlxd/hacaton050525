const See_Project = () => {
    return ( 
    <div class="project-details">
        <div class="project-main">
            <div class="project-section">
                <h3>Описание проекта</h3>
                <p>Приложение для учета личных финансов с аналитикой расходов и доходов. Включает диаграммы, категории и напоминания о платежах. Позволяет пользователям отслеживать свои финансовые привычки, устанавливать бюджет и получать персонализированные рекомендации по улучшению финансового состояния.</p>
                <p>Основные функции:</p>
                <ul>
                    <li>Учет доходов и расходов по категориям</li>
                    <li>Визуализация данных с помощью графиков и диаграмм</li>
                    <li>Напоминания о регулярных платежах</li>
                    <li>Установка финансовых целей</li>
                    <li>Экспорт данных в CSV и PDF</li>
                </ul>
            </div>
            
            <div class="project-section">
                <h3>Участники проекта</h3>
                <div class="project-members">
                    <div class="member-card">
                        <div class="member-avatar">АИ</div>
                        <div class="member-info">
                            <h4>Алексей Иванов</h4>
                            <p>Разработчик</p>
                        </div>
                    </div>
                    <div class="member-card">
                        <div class="member-avatar">МП</div>
                        <div class="member-info">
                            <h4>Мария Петрова</h4>
                            <p>Дизайнер</p>
                        </div>
                    </div>
                    <div class="member-card">
                        <div class="member-avatar">СК</div>
                        <div class="member-info">
                            <h4>Сергей Козлов</h4>
                            <p>Тестировщик</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="project-sidebar">
            <div class="sidebar-section">
                <h3>Детали проекта</h3>
                <div class="detail-item">
                    <span class="detail-label">Статус:</span>
                    <span class="detail-value status-active">Активный</span>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3>Технологии</h3>
                <div class="tech-tags">
                    <span class="tech-tag">Flutter</span>
                    <span class="tech-tag">Dart</span>
                    <span class="tech-tag">Firebase</span>
                    <span class="tech-tag">Node.js</span>
                    <span class="tech-tag">MongoDB</span>
                </div>
            </div>
        </div>
    </div>
</div> 
);
}
 
export default See_Project;