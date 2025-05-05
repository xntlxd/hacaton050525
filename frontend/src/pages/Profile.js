import "../style/style.css";

const Profile = () => {
    return ( 
    <main class="main-content">
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">
                    <span>АИ</span>
                    <div class="avatar-upload">
                        Изменить
                        <input type="file" accept="image/*" />
                    </div>
                </div>
                <div class="profile-info">
                    <h1 class="profile-name">Алексей Иванов</h1>
                    <span class="profile-role">Участник</span>
                    <p class="profile-bio">Студент 3 курса, направление "Веб-разработка". Увлекаюсь созданием современных пользовательских интерфейсов и изучением новых технологий.</p>
                    
                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">24</div>
                            <div class="stat-label">Проекта</div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn">Редактировать профиль</button>
                    </div>
                </div>
            </div>
            
            <div class="profile-tabs">
                <div class="tab active" data-tab="about">Обо мне</div>
                <div class="tab" data-tab="projects">Проекты</div>
                <div class="tab" data-tab="activity">Активность</div>
                <div class="tab" data-tab="settings">Настройки</div>
            </div>
            
            <div id="about" class="tab-content active">
                <div class="profile-section">
                    <h2 class="section-title">
                        Основная информация
                        <button class="edit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Редактировать
                        </button>
                    </h2>
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label>Имя</label>
                                <p>Алексей</p>
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label>Фамилия</label>
                                <p>Иванов</p>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <p>alexey.ivanov@example.com</p>
                    </div>
                    <div class="form-group">
                        <label>О себе</label>
                        <p>Я учусь на 3 курсе университета по направлению "Информационные технологии". Специализируюсь на веб-разработке, особенно интересует фронтенд с использованием современных фреймворков. В свободное время изучаю UI/UX дизайн и пробую создавать собственные проекты.</p>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="section-title">
                        Навыки
                        <button class="edit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Редактировать
                        </button>
                    </h2>
                    <div class="skills-list">
                        <div class="skill-tag">
                            HTML/CSS
                            <span class="remove-skill">&times;</span>
                        </div>
                        <div class="skill-tag">
                            JavaScript
                            <span class="remove-skill">&times;</span>
                        </div>
                        <div class="skill-tag">
                            React
                            <span class="remove-skill">&times;</span>
                        </div>
                        <div class="skill-tag">
                            UI/UX Design
                            <span class="remove-skill">&times;</span>
                        </div>
                        <div class="skill-tag">
                            Figma
                            <span class="remove-skill">&times;</span>
                        </div>
                    </div>
                    <div class="add-skill">
                        <input type="text" class="form-control" placeholder="Добавить навык" />
                        <button class="btn">Добавить</button>
                    </div>
                </div>
            </div>
            
            <div id="projects" class="tab-content">
                <div class="profile-section">
                    <h2 class="section-title">Мои проекты</h2>
                    <p>Здесь будут отображаться все ваши проекты. В настоящее время у вас нет активных проектов.</p>
                </div>
            </div>
            
            <div id="activity" class="tab-content">
                <div class="profile-section">
                    <h2 class="section-title">Активность</h2>
                    <p>Здесь будет отображаться ваша активность на платформе.</p>
                </div>
            </div>
            
            <div id="settings" class="tab-content">
                <div class="profile-section">
                    <h2 class="section-title">Настройки профиля</h2>
                    <p>Здесь вы можете изменить настройки вашего профиля.</p>
                </div>
            </div>
        </div>
    </main> 
);
}
 
export default Profile;