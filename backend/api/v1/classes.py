from flask_restful import Resource
from flask import request
from werkzeug.exceptions import BadRequest, Forbidden
from werkzeug.security import generate_password_hash
from pydantic import BaseModel, EmailStr, field_validator

class ApiResponse:
    ERROR = {
        200: "Success",
        201: "Created!",
        204: "No content!",
        400: "Bad Request!",
        401: "Unauthorized!",
        403: "Forbidden!",
        404: "Not Found!",
        405: "Method Not Allowed!",
        406: "Not Acceptable!",
        408: "Request Timeout!",
        409: "Conflict",
        418: "I'm A Teapot!",
        422: "Unprocessable Entity",
        500: "Internal Server Error!",
        501: "Not Implemented!",
        503: "Service Unavailable!",
        520: "Unknown Error!",
    }

    @classmethod
    def success(
        cls,
        data: list | dict,
        method: str | None = "Not transmitted"
    ) -> dict:
        response = {
            "meta": {
                "status": "OK!",
                "http_code": 200,
                "method": method
            },
            "data": {
                "body": data
            }
        }
        return response, 200
    
    @classmethod
    def created(
        cls,
        data: list | dict,
        method: str | None = "Not transmitted"
    ) -> dict:
        response = {
            "meta": {
                "status": "Created!",
                "http_code": 201,
                "method": method
            },
            "data": {
                "body": data
            }
        }
        return response, 201

    @classmethod
    def error(
        cls,
        error_code: int,
        message: str | None = None,
        method: str | None = "Not transmitted") -> dict:
        response = {
            "meta": {
                "status": "Error!",
                "http_code": error_code,
                "http_message": cls.ERROR.get(error_code, "Unknown Error"),
                "method": method,
                "message": message
            },
            "data": {
                "body": None,
            }
        }
        return response, error_code
    
    @classmethod
    def custom(
        cls,
        data: any,
        error_code: int,
        method: str | None = "Not transmitted!"
    ) -> dict:
        response = {
            "meta": {
                "status": ApiResponse.ERROR[error_code] if ApiResponse.ERROR[error_code] is not None else "Unknown code",
                "http_code": error_code,
                "method": method
            },
            "data": {
                "body": data
            }
        }
        return response, error_code

class AuthResponse(ApiResponse):
    @classmethod
    def success(
        cls,
        user_data: dict,
        access_token: str,
    ) -> dict:
        response = {
            "meta": {
                "status": "Authorized!",
            },
            "data": {
                "access_token": access_token,
                "userdata": user_data
            }
        }
        return response, 200

    @classmethod
    def created(
        cls,
        user_data: dict,
        method: str | None = "Not transmitted!"
    ) -> dict:
        response = {
            "meta": {
                "status": "Created!",
                "http_code": 201,
                "method": method
            },
            "data": {
                "body": {
                    "user_id": user_data["id"],
                    "login": user_data["login"],
                    "email": user_data["email"]
                }
            }
        }
        return response, 201
    
    @classmethod
    def login(
        cls,
        user_data: dict,
        access_token: str,
        refresh_token: str,
        method: str | None = "Not transmitted!"
    ) -> dict:
        response = {
            "meta": {
                "status": "OK!",
                "http_code": 200,
                "method": method
            },
            "data": {
                "body": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "user_id": user_data["id"],
                        "login": user_data["login"],
                        "email": user_data["email"],
                        "email": user_data["email"],
                        "version": user_data["version"]
                    }
                }
            }
        }
        return response, 200
    
    @classmethod
    def logout(
        cls,
        method: str | None = "Not transmitted!"
    ) -> dict:
        response = {
            "meta": {
                "status": ApiResponse.ERROR[401],
                "http_code": 401,
                "method": method
            },
            "data": {
                "body": None
            }
        }
        return response, 401
    
    @classmethod
    def refresh(
        cls,
        access: str
    ) -> dict:
        response = {
            "meta": {
                "status": ApiResponse.ERROR[200],
                "http_code": 200,
                "type": "refresh"
            },
            "data": {
                "body": {
                    "access": access
                }
            }
        }
        return response, 200

class NoneResource(Resource):

    def validate(self, requested: list[str]):
        data = request.get_json() or request.form
        if not all(field in data for field in requested):
            raise BadRequest("Missing required fields")
        
        data = request.get_json()
        if not data:
            raise BadRequest("Request body must be JSON")
        
        missing_fields = [field for field in requested if field not in data]
        if missing_fields:
            raise BadRequest(f"Missing required fields: {', '.join(missing_fields)}")
        
        return data

class uValidate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    def valid_password(cls, password):
        if len(password) < 8 or len(password) > 64:
            raise BadRequest("The password length must not be less than 8 and exceed 64!")
        
        return generate_password_hash(password)

class pValidate(BaseModel):
    title: str
    description: str

    @field_validator("title")
    def valid_title(cls, title):
        if len(title) < 3 or len(title) > 16:
            raise BadRequest("The title length must not be less than 3 and exceed 16!")
        return title
        
    @field_validator("description")
    def valid_description(cls, description):
        if len(description) > 1024:
            raise BadRequest("The description length must not be exceed 1024!")
        return description
    
class bValidate(BaseModel):
    title: str
    project_id: int

    @field_validator("title")
    def valid_title(cls, title):
        if len(title) == 0 or len(title) > 16:
            raise BadRequest("The title must not exceed 16 characters!")
        return title

__all__ = [
    "NoneResource", 
    "ApiResponse", "AuthResponse",
    "uValidate",
    "pValidate",
    "bValidate",
]