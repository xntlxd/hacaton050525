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
    conditions = []
    parameters = []
    
    if project_id is not None:
        conditions.append("projects.id = %s")
        parameters.append(project_id)
    if title is not None:
        conditions.append("LOWER(projects.title) = LOWER(%s)")
        parameters.append(title)
    if author is not None:
        conditions.append("collaborators.user_id = %s")
        parameters.append(author)
    
    if not conditions:
        raise BadRequest("No search criteria provided")

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
        WHERE """ + " AND ".join(conditions) + " LIMIT 1"
        
        cursor.execute(project_sql, parameters)
        project_data = cursor.fetchone()
        
        if not project_data:
            raise NotFound("Project not found!")
        
        current_project_id = project_data[0]
        
        users_sql = """
        SELECT 
            collaborators.user_id,
            collaborators.role,
            collaborators.added_at
        FROM collaborators
        WHERE collaborators.project_id = %s
        """
        
        cursor.execute(users_sql, (current_project_id,))
        users_data = cursor.fetchall()
        
        project_columns = ['id', 'title', 'description', 'created_at', 'updated_at']
        project_dict = dict(zip(project_columns, project_data))
        
        if "created_at" in project_dict and project_dict["created_at"]:
            project_dict["created_at"] = project_dict["created_at"].isoformat()

        if "updated_at" in project_dict:
            project_dict["updated_at"] = project_dict["updated_at"].isoformat() if project_dict["updated_at"] else None
        
        column_names = [desc[0] for desc in cursor.description]
        users_list = [dict(zip(column_names, user)) for user in users_data]
        
        for user in users_list:
            if "added_at" in user and user["added_at"]:
                user["added_at"] = user["added_at"].isoformat()
        
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
    
def boards_create(project_id: int, name: str):
    with dbinit() as connect:
        cursor = connect.cursor()

        cursor.execute("INSERT INTO boards (title, project_id) VALUES (%s, %s)", (name, project_id))
        board_id = cursor.fetchone()[0]
        connect.commit()
        cursor.execute("SELECT * FROM boards WHERE board_id = %s", board_id)
        board = cursor.fetchone()
        if board is None:
            raise NotFound("Board not found!")
        column_names = [row[0] for row in cursor.description]
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
            
__all__ = [
    "user_registration", "user_login", "user_getinfo", "user_edit", "user_role",
    "project_create", "project_info",
    "collaborators_add", "collaborators_getrole", "collaborators_delete", "collaborators_change", "collaborators_exist",
    "boards_create", "boards_info"
]
