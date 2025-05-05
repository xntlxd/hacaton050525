import psycopg2
from contextlib import contextmanager
from werkzeug.exceptions import NotFound, BadRequest, Forbidden
from werkzeug.security import check_password_hash

@contextmanager
def dbinit():
    connect = None
    try:
        connect = psycopg2.connect(
            host="localhost",
            port="1111",
            user="postgres",
            password="root",
            database="nonetrello"
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

        if "create_time" in user_dict and user_dict["create_time"]:
            user_dict["create_time"] = user_dict["create_time"].isoformat()

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
            sql = "SELECT id, email, role, created_time WHERE %s = %s"
        else:
            sql = "SELECT id, email, role, created_time, version WHERE %s = %s"

        cursor.execute(
            sql, (option, parameter)
        )
        user_data = cursor.fetchone()

        if user_data is None:
            raise NotFound("User not Found!")
        
        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))
        
        return user_dict

__all__ = [
    "user_registration", "user_login", "user_getinfo", 
]
