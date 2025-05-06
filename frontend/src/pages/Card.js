const Card = () => {
    return ( 
    <main class="main-content">
        <div class="project-board">
            <div class="board-header">
                <div class="board-title">
                    <h1>Разработка мобильного приложения</h1>
                    <p>Команда: Алексей Иванов, Мария Петрова, Елена Смирнова</p>
                </div>
                <div class="board-actions">
                    <button class="btn btn-secondary">Поделиться</button>
                    <button class="btn">+ Добавить задачу</button>
                </div>
            </div>
            
            <div class="columns-container">
                <div class="column">
                    <div class="column-header">
                        <h3 class="column-title">Запланировано</h3>
                        <div class="column-actions">
                            <button class="column-action">⋮</button>
                        </div>
                    </div>
                    <div class="cards-list">
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-research"></div>
                            </div>
                            <div class="card-title">Исследование рынка мобильных приложений</div>
                            <div class="card-meta">
                                <span>Срок: 15.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">АИ</div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-design"></div>
                            </div>
                            <div class="card-title">Создать прототипы основных экранов</div>
                            <div class="card-meta">
                                <span>Срок: 18.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">МП</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-card">
                        <i>+</i> Добавить карточку
                    </div>
                </div>
                
                <div class="column">
                    <div class="column-header">
                        <h3 class="column-title">В работе</h3>
                        <div class="column-actions">
                            <button class="column-action">⋮</button>
                        </div>
                    </div>
                    <div class="cards-list">
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-dev"></div>
                            </div>
                            <div class="card-title">Разработать модуль авторизации</div>
                            <div class="card-meta">
                                <span>Срок: 20.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">АИ</div>
                                    <div class="card-avatar">ЕС</div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-design"></div>
                                <div class="card-label label-dev"></div>
                            </div>
                            <div class="card-title">Дизайн и реализация главного экрана</div>
                            <div class="card-meta">
                                <span>Срок: 22.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">МП</div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-research"></div>
                            </div>
                            <div class="card-title">Анализ API для интеграции с банком</div>
                            <div class="card-meta">
                                <span>Срок: 25.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">ЕС</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-card">
                        <i>+</i> Добавить карточку
                    </div>
                </div>
                
                <div class="column">
                    <div class="column-header">
                        <h3 class="column-title">На проверке</h3>
                        <div class="column-actions">
                            <button class="column-action">⋮</button>
                        </div>
                    </div>
                    <div class="cards-list">
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-dev"></div>
                                <div class="card-label label-bug"></div>
                            </div>
                            <div class="card-title">Исправить баг с кэшированием данных</div>
                            <div class="card-meta">
                                <span>Срок: 10.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">АИ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-card">
                        <i>+</i> Добавить карточку
                    </div>
                </div>
                
                <div class="column">
                    <div class="column-header">
                        <h3 class="column-title">Готово</h3>
                        <div class="column-actions">
                            <button class="column-action">⋮</button>
                        </div>
                    </div>
                    <div class="cards-list">
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-research"></div>
                            </div>
                            <div class="card-title">Составить техническое задание</div>
                            <div class="card-meta">
                                <span>Завершено: 05.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">АИ</div>
                                    <div class="card-avatar">МП</div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-labels">
                                <div class="card-label label-design"></div>
                            </div>
                            <div class="card-title">Создать логотип приложения</div>
                            <div class="card-meta">
                                <span>Завершено: 08.10</span>
                                <div class="card-avatars">
                                    <div class="card-avatar">МП</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-card">
                        <i>+</i> Добавить карточку
                    </div>
                </div>
                
                <div class="add-column">
                    <i>+</i> Добавить колонку
                </div>
            </div>
        </div>
    </main>

<script>
    // Добавление новой карточки
    document.querySelectorAll('.add-card').forEach(btn => {
        btn.addEventListener('click', function() {
            const column = this.closest('.column');
            const cardsList = column.querySelector('.cards-list');
            
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <div class="card-title" contenteditable="true">Новая задача</div>
                <div class="card-meta">
                    <span>Срок: --.--</span>
                    <div class="card-avatars"></div>
                </div>
            `;
            
            cardsList.insertBefore(newCard, this);
            newCard.querySelector('.card-title').focus();
        });
    });
    
    // Добавление новой колонки
    document.querySelector('.add-column').addEventListener('click', function() {
        const columnsContainer = this.closest('.columns-container');
        const newColumn = document.createElement('div');
        newColumn.className = 'column';
        newColumn.innerHTML = `
            <div class="column-header">
                <h3 class="column-title" contenteditable="true">Новая колонка</h3>
                <div class="column-actions">
                    <button class="column-action">⋮</button>
                </div>
            </div>
            <div class="cards-list"></div>
            <div class="add-card">
                <i>+</i> Добавить карточку
            </div>
        `;
        
        columnsContainer.insertBefore(newColumn, this);
        newColumn.querySelector('.column-title').focus();
        
        // Добавляем обработчик для новой кнопки добавления карточки
        newColumn.querySelector('.add-card').addEventListener('click', function() {
            const column = this.closest('.column');
            const cardsList = column.querySelector('.cards-list');
            
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <div class="card-title" contenteditable="true">Новая задача</div>
                <div class="card-meta">
                    <span>Срок: --.--</span>
                    <div class="card-avatars"></div>
                </div>
            `;
            
            cardsList.insertBefore(newCard, this);
            newCard.querySelector('.card-title').focus();
        });
    });
    
    // Перетаскивание карточек (базовый функционал)
    let draggedCard = null;
    
    document.querySelectorAll('.card').forEach(card => {
        card.setAttribute('draggable', 'true');
        
        card.addEventListener('dragstart', function() {
            draggedCard = this;
            setTimeout(() => {
                this.style.opacity = '0.4';
            }, 0);
        });
        
        card.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
    
    document.querySelectorAll('.cards-list').forEach(list => {
        list.addEventListener('dragover', function(e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(this, e.clientY);
            if (afterElement == null) {
                this.appendChild(draggedCard);
            } else {
                this.insertBefore(draggedCard, afterElement);
            }
        });
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
</script>
 );
}
 
export default Card;