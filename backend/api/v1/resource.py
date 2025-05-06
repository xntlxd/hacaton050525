from .classes import *
from .connect import *
from flask import request, make_response
from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from werkzeug.security import generate_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt, get_jwt_identity, verify_jwt_in_request
)
from psycopg2.errors import ForeignKeyViolation

class Users(NoneResource):
    @jwt_required()
    def get(self):
        user_data = get_jwt()
        return user_data

    def post(self):
        try:
            raw_data = self.validate(["email", "password"])
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)

        try:
            valid_data = uValidate(**raw_data).model_dump()
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except Exception as e:
            return ApiResponse.error(500, str(e), request.method)

        try:
            user_id = user_registration(valid_data["email"], valid_data["password"])
        except Exception as e:
            return ApiResponse.error(500, str(e), request.method)

        if user_id is not None:
            return ApiResponse.custom({
                "success": True,
                "email": valid_data["email"],
                "user_id": user_id
            }, 200, request.method)

        return ApiResponse.error(500, ApiResponse.ERROR[500], request.method)

    @jwt_required()
    def patch(self):
        data = request.get_json()
        if not data:
            return ApiResponse.error(400, "No data provided for update", request.method)

        request_id = get_jwt_identity()
        editing = request_id
        updates = {}

        if "password" in data:
            updates["password"] = generate_password_hash(data["password"])

        if "nickname" in data:
            nickname = data["nickname"]
            if len(nickname) == 0 or len(nickname) > 64:
                return ApiResponse.error(400, "The nickname must not be more than 64 characters", request.method)
            updates["nickname"] = nickname
        
        if "role" in data:
            if "another_id" in data:
                request_role = user_role(request_id)
                another_role = user_role(data["another_id"])
                if request_role > another_role:
                    editing = data["another_id"]
                    updates["role"] = data["role"]
        

        if not updates:
            return ApiResponse.error(400, "No valid fields provided for update", request.method)

        try:
            updated_user = user_edit(
                uid=editing,
                **updates
            )
            return ApiResponse.success(updated_user, request.method)

        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            return ApiResponse.error(500, str(e), request.method)


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
                "created_at": user_data["created_at"]
            }
        )

        refresh = create_refresh_token(
            identity = str(user_data["id"]),
            additional_claims = {
                "email": user_data["email"],
                "version": user_data["version"]
            }
        )

        response = make_response(AuthResponse.success(user_data, access))
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
    
class Projects(NoneResource):
    def get(self):
        project_id = request.args.get("project_id", type=int)
        title = request.args.get("title")
        author = request.args.get("author", type=int)

        try:
            project = project_info(project_id, title, author)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            return ApiResponse.error(404, str(e), request.method)
        
        return ApiResponse.success(project, request.method)

    @jwt_required()
    def post(self):
        try:
            raw_data = self.validate(["title", "description"])
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)

        user_id = get_jwt_identity()

        try:
            valid_data = pValidate(**raw_data).model_dump()
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except Exception as e:
            return ApiResponse.error(500, str(e), request.method)

        new_project = project_create(valid_data["title"], valid_data["description"], user_id)

        return ApiResponse.created(new_project, request.method)
    
class Collaborators(NoneResource):
    @jwt_required()
    def post(self):
        try:
            raw_data = self.validate(["project_id", "user_id", "role"])
            user_id = get_jwt_identity()

            if not collaborators_exist(raw_data["project_id"], user_id):
                return ApiResponse.error(403, "You are not a member of the project!", request.method)

            role = collaborators_getrole(raw_data["project_id"], user_id, False)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)

        if raw_data["role"] < -1 or raw_data["role"] > 3:
            return ApiResponse.error(400, "You cannot issue non-existent access levels!", request.method)
        elif role == 0:
            return ApiResponse.error(403, "You have been blocked!", request.method)
        elif role < 2:
            return ApiResponse.error(403, "You are not an administrator of this project!", request.method)
        elif raw_data["role"] > role or raw_data["role"] == 3:
            return ApiResponse.error(403, "You do not have the right to add a stronger member!", request.method)

        try:
            new_collaborator = collaborators_add(raw_data["project_id"], raw_data["user_id"], raw_data["role"])
        except ForeignKeyViolation as e:
            return ApiResponse.error(400, str(e), request.method)
        
        return ApiResponse.success(new_collaborator, request.method)

    @jwt_required()
    def patch(self):
        try:
            raw_data = self.validate(["project_id", "user_id", "role"])
            user_id = get_jwt_identity()

            if not collaborators_exist(raw_data["project_id"], user_id):
                return ApiResponse.error(403, "You are not a member of the project!", request.method)

            try:
                self_role = collaborators_getrole(raw_data["project_id"], user_id)
                change_role = collaborators_getrole(raw_data["project_id"], raw_data["user_id"])
            except NotFound as e:
                return ApiResponse.error(400, str(e), request.method)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)

        if raw_data["role"] < -1 or raw_data["role"] > 3:
            return ApiResponse.error(400, "You cannot issue non-existent access levels!", request.method)
        elif self_role == 0:
            return ApiResponse.error(403, "You are not a member of the project!", request.method)
        elif self_role <= change_role or raw_data["role"] >= self_role:
            return ApiResponse.error(403, "You do not have the right to change a stronger member!", request.method)
        
        changed = collaborators_change(raw_data["project_id"], raw_data["user_id"], raw_data["role"])

        return ApiResponse.success(changed, request.method)

    @jwt_required()
    def delete(self):
        try:
            raw_data = self.validate(["project_id", "user_id"])
            user_id = get_jwt_identity()

            if not collaborators_exist(raw_data["project_id"], user_id):
                return ApiResponse.error(403, "You are not a member of the project!", request.method)

            try:
                self_role = collaborators_getrole(raw_data["project_id"], user_id)
                deleted_role = collaborators_getrole(raw_data["project_id"], raw_data["user_id"])

            except NotFound as e:
                return ApiResponse.error(400, str(e), request.method)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)

        if deleted_role == 0 or self_role == 0:
            return ApiResponse.error(400, "The user is not in the project!", request.method)
        elif self_role <= deleted_role:
            return ApiResponse.error(403, "You do not have the right to delete a stronger member!", request.method)

        collaborators_delete(raw_data["project_id"], raw_data["user_id"])
        return ApiResponse.custom(None, 204)

class Boards(NoneResource):
    
    @jwt_required()
    def get(self):
        data = request.args
        project_id = data.get("project_id", type=int)
        board_id = data.get("board_id", type=int)
        user_id = get_jwt_identity()

        try:
            user_edit = collaborators_getrole(project_id, user_id, False)

            if user_edit == 0:
                return ApiResponse.error(403, "You are not a member of the project!", request.method)
            
            boards_data = boards_info(project_id, board_id)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            return ApiResponse.error(404, str(e), request.method)
        
        return ApiResponse.success(boards_data, request.method)

    @jwt_required()
    def post(self):
        try:
            raw_data = self.validate(["title", "project_id"])
            user_id = get_jwt_identity()
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        
        try:
            valid_data = bValidate(**raw_data).model_dump()
            user_edit = collaborators_getrole(raw_data["project_id"], user_id, False)

            if user_edit < 2:
                return ApiResponse.error(403, "You are not an administrator of this project!", request.method)
        except BadRequest as e:
            return ApiResponse.error(400, str(e), request.method)
        
        board_data = boards_create(raw_data["project_id"], raw_data["title"])
        return ApiResponse.created(board_data)

class Cards(NoneResource):
    pass

__all__ = [
    "Users", "Auth", "Refresh", "Projects",
    "Collaborators", "Boards"
]