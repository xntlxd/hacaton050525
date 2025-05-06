import psycopg2
from psycopg2 import sql
from contextlib import contextmanager
from werkzeug.exceptions import NotFound, BadRequest, Forbidden, Conflict
from werkzeug.security import check_password_hash
from typing import Optional

@contextmanager
def dbinit():
    connect = None
    try:
        connect = psycopg2.connect(
            host="localhost",
            user="postgres",
            password="sudo",
            database="nonefolio"
        )
        yield connect
    except psycopg2.Error as e:
        print(f"Database connection failed: {e}")
        raise
    finally:
        if connect is not None:
            connect.close()

def user_registration(email: str, password: str):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        user_id = cursor.lastrowid
        connect.commit()

        return user_id
    
def user_login(email: str, password: str) -> dict:
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user_data = cursor.fetchone()

        if user_data is None:
            raise NotFound("User not found!")
        
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))

        if not check_password_hash(user_dict["password"], password):
            raise Forbidden("Incorrect login or password!")

        if "created_at" in user_dict and user_dict["created_at"]:
            user_dict["created_at"] = user_dict["created_at"].isoformat()

        if "password" in user_dict:
            del user_dict["password"]

        return user_dict
    
def user_getinfo(uid: int | None = None, email: int | None = None, guest: bool = True):
    option = None
    if uid is not None:
        option = "id"
        parameter = uid
    elif email is not None:
        option = "email"
        parameter = email

    if option is None:
        raise BadRequest("No arguments were passed")
    
    with dbinit() as connect:
        cursor = connect.cursor()

        if guest:
            sql = "SELECT id, email, role, created_at WHERE %s = %s"
        else:
            sql = "SELECT id, email, role, created_at, version WHERE %s = %s"

        cursor.execute(
            sql, (option, parameter)
        )
        user_data = cursor.fetchone()

        if user_data is None:
            raise NotFound("User not Found!")
        
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))

        if "created_at" in user_dict and user_dict["created_at"]:
            user_dict["created_at"] = user_dict["created_at"].isoformat()
        
        return user_dict

def user_edit(
    uid: int,
    password: Optional[str] = None,
    role: Optional[int] = None,
    nickname: Optional[str] = None,
) -> bool:
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
        raise BadRequest("No arguments were passed")
    
    updates.append("version = version + 1")
    
    query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
    params.append(uid)
    
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute(query, params)
        connect.commit()
        cursor.execute("SELECT id, email, role, nickname, created_at, version FROM users WHERE id = %s", uid)
        user_data = cursor.fetchone()
        if user_data is None:
            raise NotFound("User not found!")

        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))

        if "created_at" in user_dict and user_dict["created_at"]:
            user_dict["created_at"] = user_dict["created_at"].isoformat()

        return user_dict
    
def user_role(uid: int):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("SELECT role FROM users WHERE id = %s", uid)
        role = cursor.fetchone()
        if role is None:
            return 0
        return role[0]

def project_create(title: str, description: str, author: int):
    DEFAULT = ["Идея", "Проработка", "Реализация", "Готово"]

    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute(
            "INSERT INTO projects (title, description) VALUES (%s, %s) RETURNING id",
            (title, description)
        )
        project_id = cursor.fetchone()[0]
        
        cursor.execute(
            "INSERT INTO collaborators (user_id, project_id, role) VALUES (%s, %s, %s)",
            (author, project_id, 3)
        )
        connect.commit()

        for name in DEFAULT:
            cursor.execute(
                "INSERT INTO boards (title, project_id) VALUES (%s, %s)",
                (name, project_id)
            )
        connect.commit()

        cursor.execute("SELECT * FROM boards WHERE project_id = %s", (project_id, ))
        boards_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        boards_array = []
        for row in boards_data:
            boards_array.append(dict(zip(column_names, row)))

        cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id, ))
        project_data = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        project_dict = dict(zip(column_names, project_data))

        if "created_at" in project_dict and project_dict["created_at"]:
            project_dict["created_at"] = project_dict["created_at"].isoformat()

        if "updated_at" in project_dict and project_dict["updated_at"]:
            project_dict["updated_at"] = project_dict["updated_at"].isoformat()

        project_dict["boards"] = boards_array

    return project_dict

def project_info(project_id: int | None = None, title: str | None = None, author: int | None = None):
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
            SELECT 
                projects.id,
                projects.title,
                projects.description,
                projects.created_at,
                projects.updated_at
            FROM projects
            """ + ("JOIN collaborators ON projects.id = collaborators.project_id " if author else "") + \
            "WHERE " + " AND ".join(conditions) + " LIMIT 1"
            
            cursor.execute(project_sql, parameters)
            project_data = cursor.fetchone()
            
            if not project_data:
                raise NotFound("Project not found!")
            
            return format_project_data(connect, project_data)
    else:
        with dbinit() as connect:
            cursor = connect.cursor()
            
            try:
                current_user_id = author
            except Exception:
                raise BadRequest("No search criteria provided!")
            
            cursor.execute("""
                SELECT 
                    p.id, p.title, p.description, p.created_at, p.updated_at
                FROM projects p
                JOIN collaborators c ON p.id = c.project_id
                WHERE c.user_id = %s AND c.role = 3
                ORDER BY p.created_at DESC
                """, (current_user_id,))
            
            owner_projects = []
            for project in cursor.fetchall():
                owner_projects.append(format_project_data(connect, project))
            
            cursor.execute("""
                SELECT 
                    p.id, p.title, p.description, p.created_at, p.updated_at
                FROM projects p
                JOIN collaborators c ON p.id = c.project_id
                WHERE c.user_id = %s AND c.role < 3
                ORDER BY p.created_at DESC
                """, (current_user_id,))
            
            member_projects = []
            for project in cursor.fetchall():
                member_projects.append(format_project_data(connect, project))
            
            return {
                "owner_projects": owner_projects,
                "member_projects": member_projects
            }

def format_project_data(connection, project_data):
    """Вспомогательная функция для форматирования данных проекта"""
    cursor = connection.cursor()
    project_id = project_data[0]
    
    project_columns = ['id', 'title', 'description', 'created_at', 'updated_at']
    project_dict = dict(zip(project_columns, project_data))
    
    cursor.execute("""
        SELECT 
            c.user_id, c.role, c.added_at,
            u.email, u.nickname
        FROM collaborators c
        JOIN users u ON c.user_id = u.id
        WHERE c.project_id = %s
        """, (project_id,))
    
    users_data = cursor.fetchall()
    users_columns = ['user_id', 'role', 'added_at', 'email', 'nickname']
    users_list = [dict(zip(users_columns, user)) for user in users_data]
    
    for field in ['created_at', 'updated_at']:
        if project_dict.get(field):
            project_dict[field] = project_dict[field].isoformat()
    
    for user in users_list:
        if user.get('added_at'):
            user['added_at'] = user['added_at'].isoformat()
    
    project_dict['users'] = users_list
    return project_dict
    
def collaborators_add(project_id: int, user_id: int, role: int):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("SELECT 1 FROM projects WHERE id = %s", (project_id,))
        if not cursor.fetchone():
            raise NotFound("Project not found")

        cursor.execute("SELECT 1 FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            raise NotFound("User not found")

        cursor.execute("SELECT 1 FROM collaborators WHERE project_id = %s AND user_id = %s", 
                      (project_id, user_id))
        if cursor.fetchone():
            raise Conflict("User is already a collaborator on this project")

        cursor.execute("""
            INSERT INTO collaborators (user_id, project_id, role) 
            VALUES (%s, %s, %s)
            RETURNING *
            """, 
            (user_id, project_id, role)
        )
        
        new_collaborator = cursor.fetchone()
        if not new_collaborator:
            raise Exception("Failed to create collaborator")
            
        column_names = [desc[0] for desc in cursor.description]
        collaborator_dict = dict(zip(column_names, new_collaborator))
        connect.commit()

        if "added_at" in collaborator_dict and collaborator_dict["added_at"]:
            collaborator_dict["added_at"] = collaborator_dict["added_at"].isoformat()
        
        return collaborator_dict

def collaborators_delete(project_id: int, user_id: int):
    with dbinit() as connect:
        cursor = connect.cursor()
        cursor.execute("DELETE FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        connect.commit()
        return True

def collaborators_exist(project_id: int, user_id: int):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("SELECT id FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        role = cursor.fetchone()
        
        if role is None:
            return False
        return True

def collaborators_getrole(project_id: int, user_id: int, error: bool = True):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("SELECT role FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        role = cursor.fetchone()

        if role is None and error:
            raise NotFound(f"User: {user_id} - not found!")
        elif role is None:
            return 0
        
        return role[0]
    
def collaborators_change(project_id: int, user_id: int, role: int):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("UPDATE collaborators SET role = %s WHERE project_id = %s AND user_id = %s", (role, project_id, user_id))
        connect.commit()
        cursor.execute("SELECT * FROM collaborators WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        
        changed = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]

        changed_dict = dict(zip(column_names, changed))

        if "added_at" in changed_dict and changed_dict["added_at"]:
            changed_dict["added_at"] = changed_dict["added_at"].isoformat()

        return changed_dict
    
def boards_create(project_id: int, name: str) -> dict:
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute(
            "INSERT INTO boards (title, project_id) VALUES (%s, %s) RETURNING id",
            (name, project_id)
        )
        board_id = cursor.fetchone()[0]
        connect.commit()

        cursor.execute("SELECT * FROM boards WHERE id = %s", (board_id,))
        board = cursor.fetchone()
        
        if board is None:
            raise NotFound("Board not found!")

        column_names = [desc[0] for desc in cursor.description]
        return dict(zip(column_names, board))
    
def boards_info(project_id: int, board_id: int | None = None):
    with dbinit() as conn:
        cursor = conn.cursor()
        where = ""
        params = [project_id]
        
        if board_id is not None:
            where = " AND id = %s"
            params.append(board_id)

        query = f"SELECT * FROM boards WHERE project_id = %s{where}"
        cursor.execute(query, params)
        board_data = cursor.fetchall()
        
        if not board_data:
            raise NotFound("Board not found!")
        
        column_names = [desc[0] for desc in cursor.description]
        
        result = []
        for row in board_data:
            result.append(dict(zip(column_names, row)))
        
        if board_id is not None:
            return result[0]
        
        return result
    
def cards_create(
    board_id: int,
    title: str,
    about: str,
    brief_about: str | None = None,
    sell_by: str | None = None,
    status: str = "todo",
    priority: int = 0,
    external_resource: str | None = None
) -> dict:
    with dbinit() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO cards (
                board_id, title, about, brief_about, 
                sell_by, status, priority, external_resource
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (board_id, title, about, brief_about, 
             sell_by, status, priority, external_resource)
        )
        
        card_data = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        card_dict = dict(zip(column_names, card_data))
        
        conn.commit()
        return card_dict

def cards_info(board_id: int | None = None, card_id: int | None = None) -> list[dict] | dict:
    with dbinit() as conn:
        cursor = conn.cursor()
        
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
        
        return result[0] if card_id is not None else result

def responsible_add(card_id: int, user_id: int, appointed_by: int) -> dict:
    with dbinit() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO responsible (card_id, user_id, appointed, appointed_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING *
            """,
            (card_id, user_id, appointed_by)
        )
        
        resp_data = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        resp_dict = dict(zip(column_names, resp_data))
        
        conn.commit()
        return resp_dict

def responsible_get(card_id: int) -> list[dict]:
    with dbinit() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT r.*, u.email, u.nickname 
            FROM responsible r
            JOIN users u ON r.user_id = u.id
            WHERE r.card_id = %s
            """,
            (card_id,)
        )
        
        resp_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        return [dict(zip(column_names, row)) for row in resp_data]
    
def notification_create(to_whom: int, text: str, priority: int = 0) -> dict:
    with dbinit() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO notifications (to_whom, text, priority)
            VALUES (%s, %s, %s)
            RETURNING *
            """,
            (to_whom, text, priority)
        )
        
        notif_data = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        notif_dict = dict(zip(column_names, notif_data))
        
        conn.commit()
        return notif_dict

def notifications_get(user_id: int, limit: int = 10) -> list[dict]:
    with dbinit() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM notifications 
            WHERE to_whom = %s
            ORDER BY id DESC
            LIMIT %s
            """,
            (user_id, limit)
        )
        
        notif_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        return [dict(zip(column_names, row)) for row in notif_data]
    
def can_edit(user_id: int, project_id: int | None = None, board_id: int | None = None, card_id: int | None = None) -> bool:
    sql = ""
    params = (user_id,)
    
    if project_id is not None:
        sql = """
            SELECT role FROM collaborators 
            WHERE project_id = %s AND user_id = %s
            """
        params = (project_id, user_id)
    elif board_id is not None:
        sql = """
            SELECT c.role FROM collaborators c
            JOIN boards b ON c.project_id = b.project_id
            WHERE b.id = %s AND c.user_id = %s
            """
        params = (board_id, user_id)
    elif card_id is not None:
        sql = """
            SELECT c.role FROM collaborators c
            JOIN boards b ON c.project_id = b.project_id
            JOIN cards ON cards.board_id = b.id
            WHERE cards.id = %s AND c.user_id = %s
            """
        params = (card_id, user_id)
    else:
        raise BadRequest("Must specify project_id, board_id or card_id")

    with dbinit() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        role_data = cursor.fetchone()
        print(role_data)
        
        if role_data is None:
            return False
            
        role = role_data[0]
        return role >= 2

__all__ = [
    "user_registration", "user_login", "user_getinfo", "user_edit", "user_role",
    "project_create", "project_info",
    "collaborators_add", "collaborators_getrole", "collaborators_delete", "collaborators_change", "collaborators_exist",
    "boards_create", "boards_info",
    "cards_create", "cards_info",
    "responsible_add", "responsible_get",
    "notification_create", "notifications_get",
    "can_edit"
]
