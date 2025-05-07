from flask_restful import Resource
from flask import request
from werkzeug.exceptions import BadRequest
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Any
from werkzeug.security import generate_password_hash

class ApiResponse:
    """Класс для формирования стандартизированных HTTP-ответов API."""
    ERROR = {
        200: "Success",
        201: "Created",
        204: "No Content",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        408: "Request Timeout",
        409: "Conflict",
        418: "I'm A Teapot",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
        501: "Not Implemented",
        503: "Service Unavailable",
        520: "Unknown Error",
    }

    @classmethod
    def success(cls, data: Any, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует успешный ответ с кодом 200."""
        response = {
            "meta": {"status": "OK", "http_code": 200, "method": method},
            "data": {"body": data}
        }
        return response, 200
    
    @classmethod
    def created(cls, data: Any, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует ответ для созданного ресурса с кодом 201."""
        response = {
            "meta": {"status": "Created", "http_code": 201, "method": method},
            "data": {"body": data}
        }
        return response, 201

    @classmethod
    def error(cls, error_code: int, message: Optional[str] = None, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует ответ с ошибкой."""
        response = {
            "meta": {
                "status": "Error",
                "http_code": error_code,
                "http_message": cls.ERROR.get(error_code, "Unknown Error"),
                "method": method,
                "message": message
            },
            "data": {"body": None}
        }
        return response, error_code
    
    @classmethod
    def custom(cls, data: Any, error_code: int, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует кастомный ответ с указанным кодом."""
        response = {
            "meta": {
                "status": cls.ERROR.get(error_code, "Unknown code"),
                "http_code": error_code,
                "method": method
            },
            "data": {"body": data}
        }
        return response, error_code

class AuthResponse(ApiResponse):
    """Класс для формирования ответов аутентификации."""
    @classmethod
    def success(cls, user_data: dict, access_token: str) -> tuple[dict, int]:
        """Формирует ответ для успешной аутентификации."""
        response = {
            "meta": {"status": "Authorized", "http_code": 200},
            "data": {"access_token": access_token, "userdata": user_data}
        }
        return response, 200

    @classmethod
    def created(cls, user_data: dict, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует ответ для созданного пользователя."""
        response = {
            "meta": {"status": "Created", "http_code": 201, "method": method},
            "data": {
                "body": {
                    "user_id": user_data["id"],
                    "login": user_data.get("login", user_data["email"]),
                    "email": user_data["email"]
                }
            }
        }
        return response, 201
    
    @classmethod
    def login(cls, user_data: dict, access_token: str, refresh_token: str, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует ответ для успешного входа."""
        response = {
            "meta": {"status": "OK", "http_code": 200, "method": method},
            "data": {
                "body": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "user_id": user_data["id"],
                        "login": user_data.get("login", user_data["email"]),
                        "email": user_data["email"],
                        "version": user_data["version"]
                    }
                }
            }
        }
        return response, 200
    
    @classmethod
    def logout(cls, method: str = "Not transmitted") -> tuple[dict, int]:
        """Формирует ответ для выхода из системы."""
        response = {
            "meta": {"status": "Unauthorized", "http_code": 401, "method": method},
            "data": {"body": None}
        }
        return response, 401
    
    @classmethod
    def refresh(cls, access_token: str) -> tuple[dict, int]:
        """Формирует ответ для обновления токена."""
        response = {
            "meta": {"status": "Success", "http_code": 200, "type": "refresh"},
            "data": {"body": {"access_token": access_token}}
        }
        return response, 200

class NoneResource(Resource):
    """Базовый класс для ресурсов API с валидацией запросов."""
    def validate(self, required: list[str], optional: list[str] = None) -> dict:
        """Валидирует JSON-запрос, проверяя наличие обязательных и допустимых полей."""
        data = request.get_json(silent=True)
        if not data:
            raise BadRequest("Request body must be JSON")

        missing_fields = [field for field in required if field not in data or data[field] is None]
        if missing_fields:
            raise BadRequest(f"Missing required fields: {', '.join(missing_fields)}")

        allowed_fields = set(required).union(optional or [])
        unexpected_fields = [field for field in data if field not in allowed_fields]
        if unexpected_fields:
            raise BadRequest(f"Unexpected fields: {', '.join(unexpected_fields)}")

        return data

class uValidate(BaseModel):
    """Валидация данных пользователя."""
    email: EmailStr
    password: str

    @field_validator("password")
    def valid_password(cls, password: str) -> str:
        """Проверяет длину пароля и хеширует его."""
        if len(password) < 8 or len(password) > 64:
            raise BadRequest("Password must be between 8 and 64 characters")
        return generate_password_hash(password)

class pValidate(BaseModel):
    """Валидация данных проекта."""
    title: str
    description: str

    @field_validator("title")
    def valid_title(cls, title: str) -> str:
        """Проверяет длину заголовка проекта."""
        if len(title) < 3 or len(title) > 16:
            raise BadRequest("Title must be between 3 and 16 characters")
        return title
        
    @field_validator("description")
    def valid_description(cls, description: str) -> str:
        """Проверяет длину описания проекта."""
        if len(description) > 1024:
            raise BadRequest("Description must not exceed 1024 characters")
        return description
    
class bValidate(BaseModel):
    """Валидация данных доски."""
    title: str
    project_id: int

    @field_validator("title")
    def valid_title(cls, title: str) -> str:
        """Проверяет длину заголовка доски."""
        if not title or len(title) > 16:
            raise BadRequest("Title must be between 1 and 16 characters")
        return title
    
class cValidate(BaseModel):
    """Валидация данных карточки."""
    title: str
    about: str | None = None
    brief_about: Optional[str] = None
    sell_by: Optional[str] = None
    status: str = "todo"
    priority: int = 0
    external_resource: Optional[str] = None

    @field_validator("title")
    def valid_title(cls, title: str) -> str:
        """Проверяет длину заголовка карточки."""
        if len(title) < 3 or len(title) > 16:
            raise BadRequest("Title must be between 3 and 16 characters")
        return title
        
    @field_validator("about")
    def valid_about(cls, about: str) -> str:
        """Проверяет длину описания карточки."""
        if len(about) > 2048:
            raise BadRequest("About text must not exceed 2048 characters")
        return about

__all__ = [
    "NoneResource", 
    "ApiResponse", 
    "AuthResponse",
    "uValidate",
    "pValidate",
    "bValidate",
    "cValidate"
]