import psycopg2
from contextlib import contextmanager
from werkzeug.exceptions import NotFound, BadRequest, Forbidden, Conflict
from werkzeug.security import check_password_hash
from typing import Optional, List, Dict, Any
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@contextmanager
def dbinit():
    """Контекстный менеджер для подключения к базе данных."""
    connect = None
    try:
        connect = psycopg2.connect(
            host="localhost",
            user="postgres",
            port="1111",
            password="root",
            database="nonefolio"
        )
        yield connect
    except psycopg2.Error as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise
    finally:
        if connect is not None:
            connect.close()

def user_registration(email: str, password: str) -> int:
    """Регистрация нового пользователя."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (email, password, role) VALUES (%s, %s, %s) RETURNING id",
                (email, password, 1)
            )
            user_id = cursor.fetchone()[0]
            connect.commit()
            logger.info(f"Registered user with email={email}, id={user_id}")
            return user_id
        except psycopg2.errors.UniqueViolation:
            raise Conflict("User with this email already exists")

def user_login(email: str, password: str) -> Dict[str, Any]:
    """Аутентификация пользователя."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT id, email, password, role, created_at, version FROM users WHERE email = %s AND deleted = FALSE", (email,))
        user_data = cursor.fetchone()
        if not user_data:
            raise NotFound("User not found")
        
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))
        if not check_password_hash(user_dict["password"], password):
            raise Forbidden("Incorrect password")

        user_dict["created_at"] = user_dict["created_at"].isoformat() if user_dict.get("created_at") else None
        del user_dict["password"]
        logger.info(f"User logged in: email={email}")
        return user_dict
    
def user_getinfo(uid: Optional[int] = None, email: Optional[str] = None, guest: bool = True) -> Dict[str, Any]:
    """Получение информации о пользователе."""
    if uid is None and email is None:
        raise BadRequest("Either uid or email must be provided")
    
    with dbinit() as connect:
        cursor = connect.cursor()
        sql = "SELECT id, email, role, created_at" + (", version" if not guest else "") + " FROM users WHERE "
        params = []
        if uid is not None:
            sql += "id = %s AND deleted = FALSE"
            params.append(uid)
        else:
            sql += "email = %s AND deleted = FALSE"
            params.append(email)

        cursor.execute(sql, params)
        user_data = cursor.fetchone()
        if not user_data:
            raise NotFound("User not found")
        
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))
        user_dict["created_at"] = user_dict["created_at"].isoformat() if user_dict.get("created_at") else None
        logger.info(f"Retrieved user info: id={user_dict['id']}")
        return user_dict

def user_edit(
    uid: int,
    password: Optional[str] = None,
    role: Optional[int] = None,
    nickname: Optional[str] = None
) -> Dict[str, Any]:
    """Редактирование данных пользователя."""
    updates = []
    params = []
    
    if password is not None:
        updates.append("password = %s")
        params.append(password)
    if role is not None:
        updates.append("role = %s")
        params.append(role)
    if nickname is not None:
        updates.append("nickname = %s")
        params.append(nickname)
    
    if not updates:
        raise BadRequest("No fields to update provided")
    
    updates.append("version = version + 1")
    query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s AND deleted = FALSE RETURNING id, email, role, nickname, created_at, version"
    params.append(uid)
    
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute(query, params)
        user_data = cursor.fetchone()
        if not user_data:
            raise NotFound("User not found")
        
        connect.commit()
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))
        user_dict["created_at"] = user_dict["created_at"].isoformat() if user_dict.get("created_at") else None
        logger.info(f"Updated user: id={uid}")
        return user_dict
    
def user_role(uid: int) -> int:
    """Получение роли пользователя."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT role FROM users WHERE id = %s AND deleted = FALSE", (uid,))
        role = cursor.fetchone()
        return role[0] if role else 0

def user_delete(uid: int) -> None:
    """Удаление пользователя (мягкое удаление)."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("UPDATE users SET deleted = TRUE WHERE id = %s AND deleted = FALSE", (uid,))
        if cursor.rowcount == 0:
            raise NotFound("User not found")
        connect.commit()
        logger.info(f"Deleted user: id={uid}")

def project_create(title: str, description: str, author: int) -> Dict[str, Any]:
    """Создание нового проекта с дефолтными досками."""
    default_boards = ["Идея", "Проработка", "Реализация", "Готово"]
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                "INSERT INTO projects (title, description) VALUES (%s, %s) RETURNING id",
                (title, description)
            )
            project_id = cursor.fetchone()[0]
            
            cursor.execute(
                "INSERT INTO collaborators (user_id, project_id, role) VALUES (%s, %s, %s)",
                (author, project_id, 3)
            )
            
            boards_array = []
            for name in default_boards:
                cursor.execute(
                    "INSERT INTO boards (title, project_id) VALUES (%s, %s) RETURNING *",
                    (name, project_id)
                )
                board = cursor.fetchone()
                column_names = [desc[0] for desc in cursor.description]
                boards_array.append(dict(zip(column_names, board)))
            
            cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
            project_data = cursor.fetchone()
            column_names = [desc[0] for desc in cursor.description]
            project_dict = dict(zip(column_names, project_data))
            
            project_dict["created_at"] = project_dict["created_at"].isoformat() if project_dict.get("created_at") else None
            project_dict["updated_at"] = project_dict["updated_at"].isoformat() if project_dict.get("updated_at") else None
            project_dict["boards"] = boards_array
            
            connect.commit()
            logger.info(f"Created project: id={project_id}, title={title}")
            return project_dict
        except Exception as e:
            connect.rollback()
            logger.error(f"Error creating project: {str(e)}")
            raise

def project_info(project_id: Optional[int] = None, title: Optional[str] = None, author: Optional[int] = None) -> Dict[str, Any]:
    """Получение информации о проектах."""
    if project_id is not None or title is not None:
        conditions = []
        parameters = []
        if project_id is not None:
            conditions.append("projects.id = %s")
            parameters.append(project_id)
        if title is not None:
            conditions.append("LOWER(projects.title) = LOWER(%s)")
            parameters.append(title)
        
        with dbinit() as connect:
            cursor = connect.cursor()
            project_sql = """
                SELECT projects.id, projects.title, projects.description, projects.created_at, projects.updated_at
                FROM projects
                """ + ("JOIN collaborators ON projects.id = collaborators.project_id " if author else "") + \
                "WHERE " + " AND ".join(conditions) + " LIMIT 1"
            cursor.execute(project_sql, parameters)
            project_data = cursor.fetchone()
            if not project_data:
                raise NotFound("Project not found")
            return format_project_data(connect, project_data)
    else:
        with dbinit() as connect:
            cursor = connect.cursor()
            if not author:
                raise BadRequest("No search criteria provided")
            
            cursor.execute("""
                SELECT p.id, p.title, p.description, p.created_at, p.updated_at
                FROM projects p
                JOIN collaborators c ON p.id = c.project_id
                WHERE c.user_id = %s AND c.role = 3
                ORDER BY p.created_at DESC
                """, (author,))
            owner_projects = [format_project_data(connect, project) for project in cursor.fetchall()]
            
            cursor.execute("""
                SELECT p.id, p.title, p.description, p.created_at, p.updated_at
                FROM projects p
                JOIN collaborators c ON p.id = c.project_id
                WHERE c.user_id = %s AND c.role < 3
                ORDER BY p.created_at DESC
                """, (author,))
            member_projects = [format_project_data(connect, project) for project in cursor.fetchall()]
            
            logger.info(f"Retrieved projects for user_id={author}")
            return {"owner_projects": owner_projects, "member_projects": member_projects}

def format_project_data(connection, project_data: tuple) -> Dict[str, Any]:
    """Форматирование данных проекта."""
    cursor = connection.cursor()
    project_id = project_data[0]
    project_columns = ['id', 'title', 'description', 'created_at', 'updated_at']
    project_dict = dict(zip(project_columns, project_data))
    
    cursor.execute("""
        SELECT c.user_id, c.role, c.added_at, u.email, u.nickname
        FROM collaborators c
        JOIN users u ON c.user_id = u.id
        WHERE c.project_id = %s
        """, (project_id,))
    users_data = cursor.fetchall()
    users_columns = ['user_id', 'role', 'added_at', 'email', 'nickname']
    users_list = [dict(zip(users_columns, user)) for user in users_data]
    
    cursor.execute("""
        SELECT id, title
        FROM boards
        WHERE project_id = %s
        ORDER BY id
        """, (project_id,))
    boards_data = cursor.fetchall()
    boards_columns = ['id', 'title']
    boards_list = [dict(zip(boards_columns, board)) for board in boards_data]
    
    for field in ['created_at', 'updated_at']:
        if project_dict.get(field):
            project_dict[field] = project_dict[field].isoformat()
    for user in users_list:
        if user.get('added_at'):
            user['added_at'] = user['added_at'].isoformat()
    
    project_dict['users'] = users_list
    project_dict['boards'] = boards_list
    logger.info(f"Formatted project data: id={project_id}")
    return project_dict

def collaborators_add(project_id: int, user_id: int, role: int) -> Dict[str, Any]:
    """Добавление коллаборатора в проект."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute("SELECT 1 FROM projects WHERE id = %s", (project_id,))
            if not cursor.fetchone():
                raise NotFound("Project not found")
            cursor.execute("SELECT 1 FROM users WHERE id = %s AND deleted = FALSE", (user_id,))
            if not cursor.fetchone():
                raise NotFound("User not found")
            cursor.execute("SELECT 1 FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
            if cursor.fetchone():
                raise Conflict("User is already a collaborator on this project")
            cursor.execute(
                "INSERT INTO collaborators (user_id, project_id, role) VALUES (%s, %s, %s) RETURNING *",
                (user_id, project_id, role)
            )
            new_collaborator = cursor.fetchone()
            if not new_collaborator:
                raise Exception("Failed to create collaborator")
            column_names = [desc[0] for desc in cursor.description]
            collaborator_dict = dict(zip(column_names, new_collaborator))
            collaborator_dict["added_at"] = collaborator_dict["added_at"].isoformat() if collaborator_dict.get("added_at") else None
            connect.commit()
            logger.info(f"Added collaborator: user_id={user_id}, project_id={project_id}, role={role}")
            return collaborator_dict
        except Exception as e:
            connect.rollback()
            logger.error(f"Error adding collaborator: {str(e)}")
            raise

def collaborators_delete(project_id: int, user_id: int) -> None:
    """Удаление коллаборатора из проекта."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("DELETE FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        if cursor.rowcount == 0:
            raise NotFound("Collaborator not found")
        connect.commit()
        logger.info(f"Deleted collaborator: user_id={user_id}, project_id={project_id}")

def collaborators_exist(project_id: int, user_id: int) -> bool:
    """Проверка, является ли пользователь коллаборатором проекта."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT 1 FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        return bool(cursor.fetchone())

def collaborators_getrole(project_id: int, user_id: int, error: bool = True) -> int:
    """Получение роли коллаборатора."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT role FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        role = cursor.fetchone()
        if not role and error:
            raise NotFound(f"User {user_id} not found in project {project_id}")
        return role[0] if role else 0

def collaborators_change(project_id: int, user_id: int, role: int) -> Dict[str, Any]:
    """Изменение роли коллаборатора."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                "UPDATE collaborators SET role = %s WHERE project_id = %s AND user_id = %s RETURNING *",
                (role, project_id, user_id)
            )
            changed = cursor.fetchone()
            if not changed:
                raise NotFound("Collaborator not found")
            column_names = [desc[0] for desc in cursor.description]
            changed_dict = dict(zip(column_names, changed))
            changed_dict["added_at"] = changed_dict["added_at"].isoformat() if changed_dict.get("added_at") else None
            connect.commit()
            logger.info(f"Changed collaborator role: user_id={user_id}, project_id={project_id}, new_role={role}")
            return changed_dict
        except Exception as e:
            connect.rollback()
            logger.error(f"Error changing collaborator role: {str(e)}")
            raise

def boards_create(project_id: int, name: str) -> Dict[str, Any]:
    """Создание новой доски."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                "INSERT INTO boards (title, project_id) VALUES (%s, %s) RETURNING *",
                (name, project_id)
            )
            board = cursor.fetchone()
            if not board:
                raise Exception("Failed to create board")
            column_names = [desc[0] for desc in cursor.description]
            board_dict = dict(zip(column_names, board))
            connect.commit()
            logger.info(f"Created board: title={name}, project_id={project_id}")
            return board_dict
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Project not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error creating board: {str(e)}")
            raise

def boards_info(project_id: int, board_id: Optional[int] = None) -> List[Dict[str, Any]] | Dict[str, Any]:
    """Получение информации о досках."""
    with dbinit() as connect:
        cursor = connect.cursor()
        where = "project_id = %s"
        params = [project_id]
        if board_id is not None:
            where += " AND id = %s"
            params.append(board_id)
        
        cursor.execute(f"SELECT * FROM boards WHERE {where}", params)
        board_data = cursor.fetchall()
        if not board_data:
            raise NotFound("Board not found")
        
        column_names = [desc[0] for desc in cursor.description]
        result = [dict(zip(column_names, row)) for row in board_data]
        logger.info(f"Retrieved boards: project_id={project_id}, count={len(result)}")
        return result[0] if board_id is not None else result

def cards_create(
    board_id: int,
    title: str,
    about: str,
    brief_about: Optional[str] = None,
    sell_by: Optional[str] = None,
    status: str = "todo",
    priority: int = 0,
    external_resource: Optional[str] = None
) -> Dict[str, Any]:
    """Создание новой карточки."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO cards (board_id, title, about, brief_about, sell_by, status, priority, external_resource)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
                """,
                (board_id, title, about, brief_about, sell_by, status, priority, external_resource)
            )
            card_data = cursor.fetchone()
            if not card_data:
                raise Exception("Failed to create card")
            column_names = [desc[0] for desc in cursor.description]
            card_dict = dict(zip(column_names, card_data))
            connect.commit()
            logger.info(f"Created card: id={card_dict['id']}, board_id={board_id}")
            return card_dict
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Board not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error creating card: {str(e)}")
            raise

def cards_info(board_id: Optional[int] = None, card_id: Optional[int] = None) -> List[Dict[str, Any]] | Dict[str, Any]:
    """Получение информации о карточках."""
    with dbinit() as connect:
        cursor = connect.cursor()
        where = []
        params = []
        if board_id is not None:
            where.append("board_id = %s")
            params.append(board_id)
        if card_id is not None:
            where.append("id = %s")
            params.append(card_id)
        
        if not where:
            raise BadRequest("Either board_id or card_id must be provided")
        
        query = "SELECT * FROM cards WHERE " + " AND ".join(where)
        cursor.execute(query, params)
        cards_data = cursor.fetchall()
        if not cards_data:
            raise NotFound("No cards found")
        
        column_names = [desc[0] for desc in cursor.description]
        result = [dict(zip(column_names, row)) for row in cards_data]
        for card in result:
            for date_field in ['created_at', 'updated_at', 'sell_by']:
                if card.get(date_field):
                    card[date_field] = card[date_field].isoformat()
        logger.info(f"Retrieved cards: count={len(result)}")
        return result[0] if card_id is not None else result

def cards_edit(
    card_id: int,
    title: Optional[str] = None,
    about: Optional[str] = None,
    brief_about: Optional[str] = None,
    sell_by: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[int] = None,
    external_resource: Optional[str] = None,
    board_id: Optional[int] = None
) -> Dict[str, Any]:
    """Редактирование карточки."""
    updates = []
    params = []
    if title is not None:
        updates.append("title = %s")
        params.append(title)
    if about is not None:
        updates.append("about = %s")
        params.append(about)
    if brief_about is not None:
        updates.append("brief_about = %s")
        params.append(brief_about)
    if sell_by is not None:
        updates.append("sell_by = %s")
        params.append(sell_by)
    if status is not None:
        updates.append("status = %s")
        params.append(status)
    if priority is not None:
        updates.append("priority = %s")
        params.append(priority)
    if external_resource is not None:
        updates.append("external_resource = %s")
        params.append(external_resource)
    if board_id is not None:
        updates.append("board_id = %s")
        params.append(board_id)
    
    if not updates:
        raise BadRequest("No fields to update provided")
    
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            update_sql = f"UPDATE cards SET {', '.join(updates)} WHERE id = %s RETURNING *"
            params.append(card_id)
            cursor.execute(update_sql, params)
            updated_card = cursor.fetchone()
            if not updated_card:
                raise NotFound("Card not found")
            
            cursor.execute(
                """
                SELECT cards.*, b.title as board_title, p.title as project_title
                FROM cards
                JOIN boards b ON cards.board_id = b.id
                JOIN projects p ON b.project_id = p.id
                WHERE cards.id = %s
                """, (card_id,)
            )
            card_data = cursor.fetchone()
            if not card_data:
                raise NotFound("Card not found")
            
            column_names = [desc[0] for desc in cursor.description]
            card_dict = dict(zip(column_names, card_data))
            for date_field in ['created_at', 'updated_at', 'sell_by']:
                if card_dict.get(date_field):
                    card_dict[date_field] = card_dict[date_field].isoformat()
            
            connect.commit()
            logger.info(f"Edited card: id={card_id}")
            return card_dict
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Board not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error editing card: {str(e)}")
            raise

def cards_delete(card_id: int) -> None:
    """Удаление карточки."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("DELETE FROM cards WHERE id = %s", (card_id,))
        if cursor.rowcount == 0:
            raise NotFound("Card not found")
        connect.commit()
        logger.info(f"Deleted card: id={card_id}")

def responsible_add(card_id: int, user_id: int, appointed_by: int) -> Dict[str, Any]:
    """Добавление ответственного за карточку."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO responsible (card_id, user_id, appointed_by, appointed_at)
                VALUES (%s, %s, %s, CURRENT_TIMESTAMP) RETURNING *
                """,
                (card_id, user_id, appointed_by)
            )
            resp_data = cursor.fetchone()
            if not resp_data:
                raise Exception("Failed to add responsible")
            column_names = [desc[0] for desc in cursor.description]
            resp_dict = dict(zip(column_names, resp_data))
            resp_dict["appointed_at"] = resp_dict["appointed_at"].isoformat() if resp_dict.get("appointed_at") else None
            connect.commit()
            logger.info(f"Added responsible: user_id={user_id}, card_id={card_id}")
            return resp_dict
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Card or user not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error adding responsible: {str(e)}")
            raise

def responsible_get(card_id: int) -> List[Dict[str, Any]]:
    """Получение списка ответственных за карточку."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute(
            """
            SELECT r.*, u.email, u.nickname 
            FROM responsible r
            JOIN users u ON r.user_id = u.id
            WHERE r.card_id = %s
            """,
            (card_id,)
        )
        resp_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        result = [dict(zip(column_names, row)) for row in resp_data]
        for resp in result:
            resp["appointed_at"] = resp["appointed_at"].isoformat() if resp.get("appointed_at") else None
        logger.info(f"Retrieved responsible for card_id={card_id}, count={len(result)}")
        return result

def notification_create(to_whom: int, text: str, priority: int = 0) -> Dict[str, Any]:
    """Создание уведомления."""
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO notifications (to_whom, text, priority)
                VALUES (%s, %s, %s) RETURNING *
                """,
                (to_whom, text, priority)
            )
            notif_data = cursor.fetchone()
            if not notif_data:
                raise Exception("Failed to create notification")
            column_names = [desc[0] for desc in cursor.description]
            notif_dict = dict(zip(column_names, notif_data))
            connect.commit()
            logger.info(f"Created notification: to_whom={to_whom}, id={notif_dict['id']}")
            return notif_dict
        except Exception as e:
            connect.rollback()
            logger.error(f"Error creating notification: {str(e)}")
            raise

def notifications_get(user_id: int, notification_id: Optional[int] = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Получение уведомлений пользователя."""
    with dbinit() as connect:
        cursor = connect.cursor()
        where = "to_whom = %s"
        params = [user_id]
        if notification_id is not None:
            where += " AND id = %s"
            params.append(notification_id)
        
        params.append(limit)
        cursor.execute(
            f"""
            SELECT * FROM notifications 
            WHERE {where}
            ORDER BY id DESC
            LIMIT %s
            """,
            params
        )
        notif_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        result = [dict(zip(column_names, row)) for row in notif_data]
        for notification in result:
            for date_field in ['created_at']:
                if notification.get(date_field):
                    notification[date_field] = notification[date_field].isoformat()
        logger.info(f"Retrieved notifications for user_id={user_id}, count={len(result)}")
        return result

def notification_check(notification_id: int, user_id: int) -> None:
    """Пометка уведомления как прочитанного."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute(
            "UPDATE notifications SET checked = TRUE WHERE id = %s AND to_whom = %s",
            (notification_id, user_id)
        )
        if cursor.rowcount == 0:
            raise Forbidden("Notification not found or not authorized")
        connect.commit()
        logger.info(f"Checked notification: id={notification_id}, user_id={user_id}")

def can_edit(user_id: int, project_id: Optional[int] = None, board_id: Optional[int] = None, card_id: Optional[int] = None) -> bool:
    """Проверка прав редактирования."""
    if not any([project_id, board_id, card_id]):
        raise BadRequest("Must specify project_id, board_id, or card_id")
    
    with dbinit() as connect:
        cursor = connect.cursor()
        if project_id is not None:
            sql = "SELECT role FROM collaborators WHERE project_id = %s AND user_id = %s"
            params = (project_id, user_id)
        elif board_id is not None:
            sql = """
                SELECT c.role FROM collaborators c
                JOIN boards b ON c.project_id = b.project_id
                WHERE b.id = %s AND c.user_id = %s
                """
            params = (board_id, user_id)
        else:
            sql = """
                SELECT c.role FROM collaborators c
                JOIN boards b ON c.project_id = b.project_id
                JOIN cards ON cards.board_id = b.id
                WHERE cards.id = %s AND c.user_id = %s
                """
            params = (card_id, user_id)
        
        cursor.execute(sql, params)
        role_data = cursor.fetchone()
        role = role_data[0] if role_data else 0
        logger.info(f"Checked edit permissions: user_id={user_id}, role={role}")
        return role >= 2

def project_tags_insert(tags: List[str] | str, project_id: int) -> List[Dict[str, Any]]:
    """Добавление тегов к проекту."""
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    if not tags:
        raise BadRequest("No valid tags provided")
    
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.executemany(
                "INSERT INTO projects_tags (tag, project_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                [(tag, project_id) for tag in tags]
            )
            connect.commit()
            cursor.execute(
                "SELECT id, tag, project_id FROM projects_tags WHERE project_id = %s",
                (project_id,)
            )
            tags_data = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            tags_list = [dict(zip(column_names, row)) for row in tags_data]
            logger.info(f"Inserted tags for project_id={project_id}, count={len(tags_list)}")
            return tags_list
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Project not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error inserting project tags: {str(e)}")
            raise

def project_tags_get(project_id: int) -> List[str]:
    """Получение тегов проекта."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT tag FROM projects_tags WHERE project_id = %s", (project_id,))
        tags_data = cursor.fetchall()
        tags = [row[0] for row in tags_data]
        logger.info(f"Retrieved tags for project_id={project_id}, count={len(tags)}")
        return tags

def project_tags_search(tag: str) -> List[int]:
    """Поиск проектов по тегу."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT project_id FROM projects_tags WHERE tag = %s", (tag,))
        tags_data = cursor.fetchall()
        project_ids = [row[0] for row in tags_data]
        logger.info(f"Searched projects by tag={tag}, count={len(project_ids)}")
        return project_ids

def project_tags_delete(project_id: int, tag: str) -> None:
    """Удаление тега из проекта."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("DELETE FROM projects_tags WHERE project_id = %s AND tag = %s", (project_id, tag))
        if cursor.rowcount == 0:
            raise NotFound("Tag not found for this project")
        connect.commit()
        logger.info(f"Deleted tag={tag} from project_id={project_id}")

def card_tags_insert(tags: List[str] | str, card_id: int) -> List[Dict[str, Any]]:
    """Добавление тегов к карточке."""
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    if not tags:
        raise BadRequest("No valid tags provided")
    
    with dbinit() as connect:
        cursor = connect.cursor()
        try:
            cursor.executemany(
                "INSERT INTO cards_tags (tag, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                [(tag, card_id) for tag in tags]
            )
            connect.commit()
            cursor.execute(
                "SELECT id, tag, card_id FROM cards_tags WHERE card_id = %s",
                (card_id,)
            )
            tags_data = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            tags_list = [dict(zip(column_names, row)) for row in tags_data]
            logger.info(f"Inserted tags for card_id={card_id}, count={len(tags_list)}")
            return tags_list
        except psycopg2.errors.ForeignKeyViolation:
            raise NotFound("Card not found")
        except Exception as e:
            connect.rollback()
            logger.error(f"Error inserting card tags: {str(e)}")
            raise

def card_tags_get(card_id: int) -> List[str]:
    """Получение тегов карточки."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT tag FROM cards_tags WHERE card_id = %s", (card_id,))
        tags_data = cursor.fetchall()
        tags = [row[0] for row in tags_data]
        logger.info(f"Retrieved tags for card_id={card_id}, count={len(tags)}")
        return tags

def card_tags_delete(card_id: int, tag: str) -> None:
    """Удаление тега из карточки."""
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("DELETE FROM cards_tags WHERE card_id = %s AND tag = %s", (card_id, tag))
        if cursor.rowcount == 0:
            raise NotFound("Tag not found for this card")
        connect.commit()
        logger.info(f"Deleted tag={tag} from card_id={card_id}")

__all__ = [
    "dbinit",
    "user_registration", "user_login", "user_getinfo", "user_edit", "user_role", "user_delete",
    "project_create", "project_info", "format_project_data",
    "collaborators_add", "collaborators_delete", "collaborators_exist", "collaborators_getrole", "collaborators_change",
    "boards_create", "boards_info",
    "cards_create", "cards_info", "cards_edit", "cards_delete",
    "responsible_add", "responsible_get",
    "notification_create", "notifications_get", "notification_check",
    "can_edit",
    "project_tags_insert", "project_tags_get", "project_tags_search", "project_tags_delete",
    "card_tags_insert", "card_tags_get", "card_tags_delete"
]