from .classes import *
from .connect import *
from flask import request, make_response
from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt, get_jwt_identity
)

class Users(NoneResource):
    @jwt_required()
    def get(self):
        user_data = get_jwt()
        return user_data

    def post(self):
        raw_data = self.validate(["email", "password"])

        try:
            valid_data = uValidate(**raw_data).model_dump()
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except Exception as e:
            return ApiResponse.error(500, str(e), request.method)

        try:
            user_id = user_registration(valid_data["email"], valid_data["password"])
        except Exception:
            user_id = None

        if user_id is not None:
            return ApiResponse.custom({
                "success": True,
                "email": valid_data["email"],
                "user_id": user_id
            }, 200, request.method)

        return ApiResponse.error(500, ApiResponse.ERROR[500], request.method)

    def patch(self):
        pass

    def delete(self):
        pass

class Auth(NoneResource):
    def post(self):
        raw_data = self.validate(["email", "password"])

        try:
            user_data = user_login(raw_data["email"], raw_data["password"])
        except NotFound as e:
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            return ApiResponse.error(403, str(e), request.method)

        access = create_access_token(
            identity = str(user_data["id"]),
            additional_claims = {
                "email": user_data["email"],
                "role": user_data["role"],
                "create_time": user_data["create_time"]
            }
        )

        refresh = create_refresh_token(
            identity = str(user_data["id"]),
            additional_claims = {
                "email": user_data["email"],
                "version": user_data["version"]
            }
        )

        response = make_response(AuthResponse.success(access))
        response.set_cookie(
            "refresh_token", refresh, httponly=True, samesite="Strict", max_age=2592000, path="api/v1/refresh"
        )

        return response
    
class Refresh(NoneResource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        
        try:
            user_data = user_getinfo(uid=int(current_user), guest=False)
        except NotFound as e:
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            return ApiResponse.error(403, str(e), request.method)

        new_access_token = create_access_token(
            identity=current_user,
            additional_claims={
                "email": user_data["email"],
                "role": user_data["role"]
            }
        )

        return AuthResponse.success({
            "access_token": new_access_token
        })

__all__ = [
    "Users", "Auth", "Refresh"
]