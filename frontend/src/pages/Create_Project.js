import Sidebar from "../components/Sidebar";
import "../style/style.css";

const Create_Project = () => {
    return ( 
    <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
            <div className="header">
                <div className="page-title">
                    <h1>Новый проект</h1>
                    <p>Создайте новый образовательный проект и начните работу</p>
                </div>
            </div>
            
            <div className="project-form-container">
                <form action="#" method="POST">
                    <div className="form-section">
                        <h3>Основная информация</h3>
                        <div className="form-group">
                            <label htmlFor="project-name">Название проекта</label>
                            <input type="text" id="project-name" name="project-name" className="form-control form-control-lg" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="project-description">Описание проекта</label>
                            <textarea id="project-description" name="project-description" className="form-control" required></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="project-category">Категория</label>
                                    <select id="project-category" name="project-category" className="form-control" required>
                                        <option value="">Выберите категорию</option>
                                        <option value="web">Веб-разработка</option>
                                        <option value="design">Дизайн</option>
                                        <option value="research">Исследование</option>
                                        <option value="mobile">Мобильные приложения</option>
                                        <option value="ai">Искусственный интеллект</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="project-tags">Теги (через запятую)</label>
                                    <input type="text" id="project-tags" name="project-tags" className="form-control" placeholder="например: дизайн, интерфейсы, UX" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Обложка проекта</h3>
                        <div className="file-upload" id="cover-upload">
                            <div className="file-upload-icon">📁</div>
                            <p>Перетащите сюда файл или кликните для выбора</p>
                            <p><small>Рекомендуемый размер: 1200×600px</small></p>
                            <input type="file" id="project-cover" name="project-cover" accept="image/*" />
                            <img id="cover-preview" className="preview-image" src="#" alt="Предпросмотр обложки" />
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Настройки проекта</h3>
                        <div className="form-row">
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="project-start">Дата начала</label>
                                    <input type="date" id="project-start" name="project-start" className="form-control" required />
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="project-end">Дата завершения (ожидаемая)</label>
                                    <input type="date" id="project-end" name="project-end" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Команда проекта</h3>
                        <div className="form-group">
                            <label>Участники</label>
                            <div>
                                <span className="member-avatar">АИ</span>
                                <span className="member-avatar">МП</span>
                                <button type="button" className="btn">+ Добавить участника</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn">Создать проект</button>
                    </div>
                </form>
            </div>
        </main>
    </div> 
    );
}
 
export default Create_Project;