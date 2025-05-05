import Sidebar from "../components/Sidebar";
import "../style/style.css";

const Create_Project = () => {
    return ( 
    <div class="dashboard">
        <Sidebar />
        
        <main class="main-content">
            <div class="header">
                <div class="page-title">
                    <h1>Новый проект</h1>
                    <p>Создайте новый образовательный проект и начните работу</p>
                </div>
            </div>
            
            <div class="project-form-container">
                <form action="#" method="POST">
                    <div class="form-section">
                        <h3>Основная информация</h3>
                        <div class="form-group">
                            <label for="project-name">Название проекта</label>
                            <input type="text" id="project-name" name="project-name" class="form-control form-control-lg" required />
                        </div>
                        <div class="form-group">
                            <label for="project-description">Описание проекта</label>
                            <textarea id="project-description" name="project-description" class="form-control" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-col">
                                <div class="form-group">
                                    <label for="project-category">Категория</label>
                                    <select id="project-category" name="project-category" class="form-control" required>
                                        <option value="">Выберите категорию</option>
                                        <option value="web">Веб-разработка</option>
                                        <option value="design">Дизайн</option>
                                        <option value="research">Исследование</option>
                                        <option value="mobile">Мобильные приложения</option>
                                        <option value="ai">Искусственный интеллект</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-col">
                                <div class="form-group">
                                    <label for="project-tags">Теги (через запятую)</label>
                                    <input type="text" id="project-tags" name="project-tags" class="form-control" placeholder="например: дизайн, интерфейсы, UX" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Обложка проекта</h3>
                        <div class="file-upload" id="cover-upload">
                            <div class="file-upload-icon">📁</div>
                            <p>Перетащите сюда файл или кликните для выбора</p>
                            <p><small>Рекомендуемый размер: 1200×600px</small></p>
                            <input type="file" id="project-cover" name="project-cover" accept="image/*" />
                            <img id="cover-preview" class="preview-image" src="#" alt="Предпросмотр обложки" />
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Настройки проекта</h3>
                        <div class="form-row">
                            <div class="form-col">
                                <div class="form-group">
                                    <label for="project-start">Дата начала</label>
                                    <input type="date" id="project-start" name="project-start" class="form-control" required />
                                </div>
                            </div>
                            <div class="form-col">
                                <div class="form-group">
                                    <label for="project-end">Дата завершения (ожидаемая)</label>
                                    <input type="date" id="project-end" name="project-end" class="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Команда проекта</h3>
                        <div class="form-group">
                            <label>Участники</label>
                            <div style="margin-top: 0.5rem;">
                                <span class="member-avatar" style="margin-right: 0.5rem;">АИ</span>
                                <span class="member-avatar" style="margin-right: 0.5rem;">МП</span>
                                <button type="button" class="btn" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;">+ Добавить участника</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn">Создать проект</button>
                    </div>
                </form>
            </div>
        </main>
    </div> 
    );
}
 
export default Create_Project;