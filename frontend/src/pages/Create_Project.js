import Sidebar from "../components/Sidebar";
import "../style/style.css";
import { useState, useRef, useCallback, useEffect } from "react";

const Create_Project = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectTags: "",
    projectStart: "",
    projectEnd: "",
    projectCover: null,
  });
  const [participants, setParticipants] = useState([]);
  const [participantInput, setParticipantInput] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // Очистка превью при размонтировании
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Проверка валидности токена
  const validateToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token || token.split('.').length !== 3) {
      setError("Недействительный токен авторизации. Пожалуйста, войдите снова.");
      return null;
    }
    return token;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParticipantInputChange = (e) => {
    setParticipantInput(e.target.value);
  };

  const addParticipant = async () => {
    if (!participantInput) {
      setError("Введите email или ID участника");
      return;
    }

    const token = validateToken();
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/v1/users?email=${participantInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.meta?.message || "Пользователь не найден");
      }

      const user = result.data.body;
      if (participants.some(p => p.id === user.id)) {
        throw new Error("Этот участник уже добавлен");
      }

      setParticipants([...participants, { id: user.id, email: user.email, role: 1 }]);
      setParticipantInput("");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleFileChange = useCallback((file) => {
    if (file && file.type.match('image.*')) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFormData(prev => ({ ...prev, projectCover: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Пожалуйста, выберите файл изображения (PNG, JPG, JPEG)");
    }
  }, [previewUrl]);

  // Обработчики drag-and-drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.dataTransfer.types.includes('Files'));
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.dataTransfer.types.includes('Files'));
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropRef.current) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData(prev => ({ ...prev, projectCover: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (!formData.projectName || !formData.projectDescription) {
      setError("Пожалуйста, заполните обязательные поля: название и описание");
      return;
    }
  
    const token = validateToken();
    if (!token) return;
  
    try {
      setIsLoading(true);
      
      // Подготовка данных в формате JSON
      const projectData = {
        title: formData.projectName,
        description: formData.projectDescription,
        tags: formData.projectTags || undefined,
        start_date: formData.projectStart || undefined,
        end_date: formData.projectEnd || undefined,
        // Файл нужно обработать отдельно, так как JSON не поддерживает бинарные данные
      };
  
      // 1. Сначала создаем проект с основными данными
      const projectResponse = await fetch("http://localhost:5000/api/v1/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(projectData),
      });
  
      const projectResult = await projectResponse.json();
      
      if (!projectResponse.ok) {
        throw new Error(projectResult.meta?.message || projectResult.message || "Ошибка при создании проекта");
      }
  
      const projectId = projectResult.data.body.id;
  
      // 2. Если есть обложка, загружаем ее отдельным запросом
      if (formData.projectCover) {
        const coverFormData = new FormData();
        coverFormData.append('cover', formData.projectCover);
        
        const coverResponse = await fetch(`http://localhost:5000/api/v1/projects/${projectId}/cover`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: coverFormData,
        });
  
        if (!coverResponse.ok) {
          const coverResult = await coverResponse.json();
          throw new Error(coverResult.meta?.message || "Ошибка при загрузке обложки");
        }
      }
  
      // 3. Добавляем участников
      for (const participant of participants) {
        const collaboratorResponse = await fetch("http://localhost:5000/api/v1/projects/collaborators", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            user_id: participant.id,
            role: participant.role,
          }),
        });
  
        if (!collaboratorResponse.ok) {
          const collaboratorResult = await collaboratorResponse.json();
          throw new Error(`Ошибка при добавлении участника ${participant.email}: ${collaboratorResult.meta?.message || "Неизвестная ошибка"}`);
        }
      }
  
      // Успешное завершение
      setSuccess("Проект успешно создан!");
      // Сброс формы
      setFormData({
        projectName: "",
        projectDescription: "",
        projectTags: "",
        projectStart: "",
        projectEnd: "",
        projectCover: null,
      });
      setParticipants([]);
      setParticipantInput("");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (err) {
      console.error("Ошибка при создании проекта:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (остальная часть JSX остается без изменений)

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
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Основная информация</h3>
              <div className="form-group">
                <label htmlFor="project-name">Название проекта</label>
                <input 
                  type="text" 
                  id="project-name" 
                  name="projectName" 
                  className="form-control form-control-lg" 
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-description">Описание проекта</label>
                <textarea 
                  id="project-description" 
                  name="projectDescription" 
                  className="form-control" 
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <label htmlFor="project-tags">Теги (через запятую)</label>
                <input 
                  type="text" 
                  id="project-tags" 
                  name="projectTags" 
                  className="form-control" 
                  placeholder="например: дизайн, интерфейсы, UX"
                  value={formData.projectTags}
                  onChange={handleInputChange}
                />
                <small className="form-text text-muted">Примечание: теги в настоящее время не сохраняются на сервере.</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Обложка проекта</h3>
              <div 
                ref={dropRef}
                className={`file-upload ${isDragging ? "dragging" : ""}`}
                id="cover-upload"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="file-upload-icon">📁</div>
                <p>{isDragging ? "Отпустите файл для загрузки" : "Перетащите сюда файл или кликните для выбора"}</p>
                <p><small>Рекомендуемый размер: 1200×600px, формат: PNG, JPG, JPEG</small></p>
                <small className="form-text text-muted">Примечание: обложка в настоящее время не сохраняется на сервере.</small>
                <input
                  type="file"
                  id="project-cover"
                  name="projectCover"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleInputFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                {previewUrl && (
                  <div className="preview-container">
                    <img
                      id="cover-preview"
                      className="preview-image"
                      src={previewUrl}
                      alt="Предпросмотр обложки"
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={removeFile}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Настройки проекта</h3>
              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="project-start">Дата начала</label>
                    <input 
                      type="date" 
                      id="project-start" 
                      name="projectStart" 
                      className="form-control" 
                      value={formData.projectStart}
                      onChange={handleInputChange}
                    />
                    <small className="form-text text-muted">Примечание: дата начала в настоящее время не сохраняется на сервере.</small>
                  </div>
                </div>
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="project-end">Дата завершения (ожидаемая)</label>
                    <input 
                      type="date" 
                      id="project-end" 
                      name="projectEnd" 
                      className="form-control" 
                      value={formData.projectEnd}
                      onChange={handleInputChange}
                    />
                    <small className="form-text text-muted">Примечание: дата завершения в настоящее время не сохраняется на сервере.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Команда проекта</h3>
              <div className="form-group">
                <label htmlFor="participant-input">Добавить участника</label>
                <div className="participant-input-group">
                  <input 
                    type="text" 
                    id="participant-input" 
                    value={participantInput}
                    onChange={handleParticipantInputChange}
                    className="form-control"
                    placeholder="Введите email или ID пользователя"
                  />
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={addParticipant}
                  >
                    + Добавить
                  </button>
                </div>
                <div className="participants-list">
                  {participants.map(participant => (
                    <div key={participant.id} className="participant-item">
                      <span className="member-avatar">
                        {participant.email.charAt(0).toUpperCase()}
                      </span>
                      <span className="participant-email">{participant.email}</span>
                      <button 
                        type="button" 
                        className="remove-participant-btn"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn"
                disabled={isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать проект'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Create_Project;