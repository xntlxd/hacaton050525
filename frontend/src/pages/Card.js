import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../style/style.css';

// Компонент для отображения и управления карточками на доске
const Card = () => {
  const { projectId } = useParams();
  const [boards, setBoards] = useState([]); // Список досок
  const [cards, setCards] = useState({}); // Карточки, сгруппированные по ID досок
  const [projectUsers, setProjectUsers] = useState([]); // Пользователи проекта
  const [projectTitle, setProjectTitle] = useState(''); // Название проекта
  const [editingCard, setEditingCard] = useState(null); // Текущая редактируемая карточка (модальное окно)
  const [editingCardId, setEditingCardId] = useState(null); // ID карточки для редактирования заголовка
  const [editingBoardId, setEditingBoardId] = useState(null); // ID доски для редактирования заголовка
  const [error, setError] = useState(null); // Сообщение об ошибке

  // Загружаем доски, пользователей и название проекта
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        if (!projectId || isNaN(parseInt(projectId))) {
          throw new Error('Некорректный ID проекта');
        }
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Токен авторизации отсутствует');
        const response = await fetch(`/api/v1/projects?project_id=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) throw new Error('Токен истёк или недействителен');
        if (!response.ok) throw new Error(`Ошибка ${response.status}: Не удалось загрузить доски`);
        const data = await response.json();
        const projectData = data.data.body;
        setBoards(projectData.boards || []);
        setProjectUsers(projectData.users || []);
        setProjectTitle(projectData.title || 'Без названия');
      } catch (err) {
        console.error('Ошибка при загрузке досок:', err.message);
        setError(err.message);
      }
    };
    fetchBoards();
  }, [projectId]);

  // Загружаем карточки для каждой доски
  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Токен авторизации отсутствует');
        return;
      }
      const cardData = {};
      for (const board of boards) {
        if (!board.id || isNaN(parseInt(board.id))) {
          console.warn(`Некорректный ID доски: ${board.id}`);
          cardData[board.id] = [];
          continue;
        }
        try {
          const response = await fetch(`/api/v1/projects/cards?board_id=${board.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 404) {
            console.warn(`Доска ${board.id} не найдена или нет карточек`);
            cardData[board.id] = [];
            continue;
          }
          if (response.status === 401) throw new Error('Токен истёк или недействителен');
          if (!response.ok) throw new Error(`Ошибка ${response.status} для доски ${board.id}`);
          const data = await response.json();
          cardData[board.id] = data.data.body || [];
        } catch (err) {
          console.error(`Ошибка при загрузке карточек для доски ${board.id}:`, err.message);
          cardData[board.id] = [];
        }
      }
      setCards(cardData);
    };
    if (boards.length > 0) {
      fetchCards();
    }
  }, [boards]);

  // Добавляем новую карточку
  const handleAddCard = async (boardId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      if (!boards.some((board) => board.id === boardId)) {
        throw new Error(`Доска с ID ${boardId} не найдена`);
      }
      const body = {
        board_id: parseInt(boardId),
        title: 'Новая задача',
        about: 'Описание задачи',
        brief_about: null,
        sell_by: null,
        status: 'planned',
        priority: 0,
        external_resource: null,
      };
      const response = await fetch('/api/v1/projects/cards', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Не удалось создать карточку'}`);
      }
      const data = await response.json();
      const newCard = data.data.body;
      setCards((prev) => ({
        ...prev,
        [boardId]: [...(prev[boardId] || []), newCard],
      }));
      setError(null);
    } catch (err) {
      console.error('Ошибка при создании карточки:', err.message);
      setError(err.message);
    }
  };

  // Добавляем новую доску
  const handleAddBoard = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const body = {
        project_id: parseInt(projectId),
        title: 'Новая доска',
      };
      const response = await fetch('/api/v1/projects/boards', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для создания доски');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Не удалось создать доску'}`);
      }
      const data = await response.json();
      const newBoard = data.data.body;
      setBoards((prev) => [...prev, newBoard]);
      setCards((prev) => ({ ...prev, [newBoard.id]: [] }));
      setError(null);
    } catch (err) {
      console.error('Ошибка при создании доски:', err.message);
      setError(err.message);
    }
  };

  // Редактируем заголовок карточки
  const handleCardTitleChange = async (cardId, boardId, newTitle) => {
    if (!newTitle.trim()) return; // Не сохраняем пустое название
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const response = await fetch('/api/v1/projects/cards', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardId,
          title: newTitle,
        }),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для редактирования карточки');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Не удалось обновить карточку'}`);
      }
      const data = await response.json();
      const updatedCard = data.data.body;
      setCards((prev) => ({
        ...prev,
        [boardId]: prev[boardId].map((c) => (c.id === updatedCard.id ? updatedCard : c)),
      }));
      setEditingCardId(null);
      setError(null);
    } catch (err) {
      console.error('Ошибка при обновлении заголовка карточки:', err.message);
      setError(err.message);
    }
  };

  // Редактируем заголовок доски
  const handleBoardTitleChange = async (boardId, newTitle) => {
    if (!newTitle.trim()) return; // Не сохраняем пустое название
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const response = await fetch('/api/v1/projects/boards', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: boardId,
          title: newTitle,
        }),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для редактирования доски');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Не удалось обновить доску'}`);
      }
      const data = await response.json();
      const updatedBoard = data.data.body;
      setBoards((prev) =>
        prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      );
      setEditingBoardId(null);
      setError(null);
    } catch (err) {
      console.error('Ошибка при обновлении заголовка доски:', err.message);
      setError(err.message);
    }
  };

  // Открываем редактирование карточки (модальное окно)
  const handleEditCard = (card) => {
    setEditingCard({ ...card });
  };

  // Сохраняем изменения карточки (модальное окно)
  const handleSaveCard = async () => {
    if (!editingCard) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const response = await fetch('/api/v1/projects/cards', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: editingCard.id,
          title: editingCard.title,
          about: editingCard.about,
          sell_by: editingCard.sell_by,
        }),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для редактирования карточки');
      if (!response.ok) throw new Error(`Ошибка ${response.status}: Не удалось обновить карточку`);
      const data = await response.json();
      const updatedCard = data.data.body;
      setCards((prev) => ({
        ...prev,
        [editingCard.board_id]: prev[editingCard.board_id].map((c) =>
          c.id === updatedCard.id ? updatedCard : c
        ),
      }));
      setEditingCard(null);
      setError(null);
    } catch (err) {
      console.error('Ошибка при обновлении карточки:', err.message);
      setError(err.message);
    }
  };

  // Удаляем карточку
  const handleDeleteCard = async (cardId, boardId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const response = await fetch('/api/v1/projects/cards', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ card_id: cardId }),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для удаления карточки');
      if (!response.ok) throw new Error(`Ошибка ${response.status}: Не удалось удалить карточку`);
      setCards((prev) => ({
        ...prev,
        [boardId]: prev[boardId].filter((c) => c.id !== cardId),
      }));
      setError(null);
    } catch (err) {
      console.error('Ошибка при удалении карточки:', err.message);
      setError(err.message);
    }
  };

  // Обрабатываем завершение перетаскивания
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceBoardId = parseInt(source.droppableId);
    const destBoardId = parseInt(destination.droppableId);

    if (sourceBoardId === destBoardId && source.index === destination.index) return;

    // Обновляем локальное состояние
    const sourceCards = [...(cards[sourceBoardId] || [])];
    const [movedCard] = sourceCards.splice(source.index, 1);
    const destCards = sourceBoardId === destBoardId ? sourceCards : [...(cards[destBoardId] || [])];
    destCards.splice(destination.index, 0, { ...movedCard, board_id: destBoardId });

    setCards((prev) => ({
      ...prev,
      [sourceBoardId]: sourceCards,
      [destBoardId]: destCards,
    }));

    // Обновляем на сервере
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Токен авторизации отсутствует');
      const response = await fetch('/api/v1/projects/cards', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: movedCard.id,
          board_id: destBoardId,
        }),
      });
      if (response.status === 401) throw new Error('Токен истёк или недействителен');
      if (response.status === 403) throw new Error('Недостаточно прав для перемещения карточки');
      if (!response.ok) throw new Error(`Ошибка ${response.status}: Не удалось переместить карточку`);
      setError(null);
    } catch (err) {
      console.error('Ошибка при перемещении карточки:', err.message);
      setError(err.message);
      // Откатываем состояние
      setCards((prev) => ({
        ...prev,
        [sourceBoardId]: [...(prev[sourceBoardId] || []), movedCard],
        [destBoardId]: prev[destBoardId].filter((c) => c.id !== movedCard.id),
      }));
    }
  };

  // Получаем инициалы пользователя для аватарки
  const getUserInitials = (user) => {
    const name = user.nickname || user.email.split('@')[0];
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Получаем класс для метки из тегов
  const getLabelClass = (tags) => {
    if (!tags || tags.length === 0) return '';
    const tag = tags[0].tag.toLowerCase();
    return `card-label label-${tag}`;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="main-content p-4">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="project-board">
          <div className="board-header flex justify-between items-center mb-4">
            <div className="board-title">
              <Link to={`/project/${projectId}`}>
                <h1 className="text-2xl font-bold">{projectTitle || 'Без названия'}</h1>
              </Link>
              <p>Команда: {projectUsers.map((u) => u.nickname || u.email).join(', ')}</p>
            </div>
            <div className="board-actions flex gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded">Поделиться</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">+ Добавить задачу</button>
            </div>
          </div>
          <div className="columns-container flex gap-4 overflow-x-auto">
            {boards.map((board) => (
              <Droppable droppableId={board.id.toString()} key={board.id} isCombineEnabled={false}>
                {(provided) => (
                  <div
                    className="column w-72 bg-gray-100 rounded p-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className="column-header flex justify-between items-center mb-2">
                      {editingBoardId === board.id ? (
                        <input
                          type="text"
                          defaultValue={board.title}
                          onBlur={(e) => handleBoardTitleChange(board.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleBoardTitleChange(board.id, e.target.value);
                            }
                          }}
                          className="column-title-input"
                          autoFocus
                        />
                      ) : (
                        <h3
                          className="column-title text-lg font-semibold"
                          onMouseEnter={() => setEditingBoardId(board.id)}
                        >
                          {board.title}
                        </h3>
                      )}
                      <div className="column-actions">
                        <button className="column-action text-gray-500">⋮</button>
                      </div>
                    </div>
                    <div className="cards-list">
                      {(cards[board.id] || []).map((card, index) => (
                        <Draggable draggableId={card.id.toString()} index={index} key={card.id}>
                          {(provided) => (
                            <div
                              className="card bg-white p-3 mb-2 rounded shadow"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="card-labels">
                                <div className={getLabelClass(card.tags)}></div>
                              </div>
                              {editingCardId === card.id ? (
                                <input
                                  type="text"
                                  defaultValue={card.title}
                                  onBlur={(e) => handleCardTitleChange(card.id, board.id, e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCardTitleChange(card.id, board.id, e.target.value);
                                    }
                                  }}
                                  className="card-title-input"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="card-title font-medium"
                                  onMouseEnter={() => setEditingCardId(card.id)}
                                >
                                  {card.title}
                                </div>
                              )}
                              <div className="card-meta flex justify-between items-center">
                                <span>
                                  {card.sell_by
                                    ? `Срок: ${new Date(card.sell_by).toLocaleDateString('ru-RU')}`
                                    : 'Срок: --.--'}
                                </span>
                                <div className="card-avatars flex gap-1">
                                  {projectUsers
                                    .filter((u) => card.assigned_users?.includes(u.user_id))
                                    .map((u) => (
                                      <div
                                        key={u.user_id}
                                        className="card-avatar w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"
                                      >
                                        {getUserInitials(u)}
                                      </div>
                                    ))}
                                </div>
                              </div>
                              <div className="card-actions flex gap-2 mt-2">
                                <button
                                  onClick={() => handleEditCard(card)}
                                  className="text-blue-500 text-sm"
                                >
                                  Редактировать
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.id, board.id)}
                                  className="text-red-500 text-sm"
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    <div
                      className="add-card mt-2 text-blue-500 cursor-pointer"
                      onClick={() => handleAddCard(board.id)}
                    >
                      <i>+</i> Добавить карточку
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
            <div
              className="add-column w-72 bg-gray-100 rounded p-2 flex items-center justify-center cursor-pointer"
              onClick={handleAddBoard}
            >
              <i>+</i> Добавить колонку
            </div>
          </div>
        </div>
        {editingCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Редактировать задачу</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium">Название</label>
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Описание</label>
                <textarea
                  value={editingCard.about}
                  onChange={(e) => setEditingCard({ ...editingCard, about: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Срок</label>
                <input
                  type="date"
                  value={editingCard.sell_by ? new Date(editingCard.sell_by).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingCard({ ...editingCard, sell_by: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCard}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </DragDropContext>
  );
};

export default Card;