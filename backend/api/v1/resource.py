from flask import request, make_response
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt, get_jwt_identity, verify_jwt_in_request
)
from werkzeug.exceptions import BadRequest, NotFound, Forbidden, Conflict
from werkzeug.security import generate_password_hash
import logging
from .classes import *
from .connect import *

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Users(NoneResource):
    """Ресурс для управления пользователями."""
    @jwt_required()
    def get(self):
        """Получение данных текущего пользователя."""
        try:
            user_data = get_jwt()
            return ApiResponse.success(user_data, request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    def post(self):
        """Регистрация нового пользователя."""
        try:
            raw_data = self.validate(["email", "password"])
            valid_data = uValidate(**raw_data).model_dump()
            user_id = user_registration(valid_data["email"], valid_data["password"])
            return ApiResponse.created({
                "success": True,
                "email": valid_data["email"],
                "user_id": user_id
            }, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def patch(self):
        """Обновление данных пользователя."""
        try:
            data = self.validate([], ["password", "nickname", "role", "another_id"])
            request_id = get_jwt_identity()
            editing_id = request_id
            updates = {}

            if "password" in data:
                updates["password"] = generate_password_hash(data["password"])
            if "nickname" in data:
                nickname = data["nickname"]
                if not nickname or len(nickname) > 64:
                    raise BadRequest("Nickname must be between 1 and 64 characters")
                updates["nickname"] = nickname
            if "role" in data and "another_id" in data:
                request_role = user_role(request_id)
                another_role = user_role(data["another_id"])
                if request_role <= another_role:
                    raise Forbidden("Insufficient permissions to change role")
                editing_id = data["another_id"]
                updates["role"] = data["role"]

            if not updates:
                raise BadRequest("No valid fields provided for update")

            updated_user = user_edit(uid=editing_id, **updates)
            return ApiResponse.success(updated_user, request.method)
        except BadRequest as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Удаление пользователя."""
        try:
            user_id = get_jwt_identity()
            user_delete(user_id)
            return ApiResponse.success({"message": "User deleted"}, request.method)
        except NotFound as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Auth(NoneResource):
    """Ресурс для аутентификации пользователей."""
    def post(self):
        """Вход пользователя."""
        try:
            raw_data = self.validate(["email", "password"])
            user_data = user_login(raw_data["email"], raw_data["password"])
            access_token = create_access_token(
                identity=str(user_data["id"]),
                additional_claims={"email": user_data["email"], "role": user_data["role"], "created_at": user_data["created_at"]}
            )
            refresh_token = create_refresh_token(
                identity=str(user_data["id"]),
                additional_claims={"email": user_data["email"], "version": user_data["version"]}
            )
            response = make_response(AuthResponse.login(user_data, access_token, refresh_token, request.method))
            response.set_cookie(
                "refresh_token", refresh_token, httponly=True, samesite="Strict", max_age=2592000, path="/api/v1/refresh"
            )
            return response
        except NotFound as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Refresh(NoneResource):
    """Ресурс для обновления токена доступа."""
    @jwt_required(refresh=True)
    def post(self):
        """Обновление токена доступа."""
        try:
            current_user = get_jwt_identity()
            user_data = user_getinfo(uid=int(current_user), guest=False)
            new_access_token = create_access_token(
                identity=current_user,
                additional_claims={"email": user_data["email"], "role": user_data["role"]}
            )
            return AuthResponse.refresh(new_access_token)
        except NotFound as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Projects(NoneResource):
    """Ресурс для управления проектами."""
    def get(self):
        """Получение информации о проектах."""
        try:
            project_id = request.args.get("project_id", type=int)
            title = request.args.get("title")
            author = request.args.get("author", type=int)

            if project_id is None and title is None and author is None:
                verify_jwt_in_request()
                current_user_id = get_jwt_identity()
                projects = project_info(author=current_user_id)
                response_data = {
                    "owner_projects": projects.get("owner_projects", []),
                    "member_projects": projects.get("member_projects", [])
                }
                return ApiResponse.success(response_data, request.method)
            
            project = project_info(project_id, title, author)
            return ApiResponse.success(project, request.method)
        except BadRequest as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(401, "Authorization required", request.method)

    @jwt_required()
    def post(self):
        """Создание нового проекта."""
        try:
            raw_data = self.validate(["title", "description"])
            user_id = get_jwt_identity()
            valid_data = pValidate(**raw_data).model_dump()
            new_project = project_create(valid_data["title"], valid_data["description"], user_id)
            return ApiResponse.created(new_project, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Collaborators(NoneResource):
    """Ресурс для управления коллабораторами проекта."""
    @jwt_required()
    def post(self):
        """Добавление нового коллаборатора."""
        try:
            raw_data = self.validate(["project_id", "user_id", "role"])
            project_id = raw_data["project_id"]
            new_user_id = raw_data["user_id"]
            new_role = raw_data["role"]
            current_user_id = get_jwt_identity()

            if new_role < -1 or new_role > 3:
                raise BadRequest("Invalid role: must be between -1 and 3")
            if not collaborators_exist(project_id, current_user_id):
                raise Forbidden("You are not a member of the project")
            current_role = collaborators_getrole(project_id, current_user_id, error=False)
            if current_role == 0:
                raise Forbidden("You have been blocked")
            if current_role < 2:
                raise Forbidden("You are not an administrator of this project")
            if new_role > current_role or new_role == 3:
                raise Forbidden("You cannot assign a role higher than your own or owner role")

            new_collaborator = collaborators_add(project_id, new_user_id, new_role)
            logger.info(f"Added collaborator user_id={new_user_id} to project_id={project_id} with role={new_role}")
            return ApiResponse.created(new_collaborator, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except NotFound as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Conflict as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(409, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def patch(self):
        """Изменение роли коллаборатора."""
        try:
            raw_data = self.validate(["project_id", "user_id", "role"])
            project_id = raw_data["project_id"]
            target_user_id = raw_data["user_id"]
            new_role = raw_data["role"]
            current_user_id = get_jwt_identity()

            if new_role < -1 or new_role > 3:
                raise BadRequest("Invalid role: must be between -1 and 3")
            if not collaborators_exist(project_id, current_user_id):
                raise Forbidden("You are not a member of the project")
            current_role = collaborators_getrole(project_id, current_user_id)
            target_role = collaborators_getrole(project_id, target_user_id)
            if current_role == 0:
                raise Forbidden("You have been blocked")
            if current_role <= target_role or new_role >= current_role:
                raise Forbidden("You cannot change a role of an equal or higher member")

            changed = collaborators_change(project_id, target_user_id, new_role)
            logger.info(f"Changed role for user_id={target_user_id} in project_id={project_id} to role={new_role}")
            return ApiResponse.success(changed, request.method)
        except BadRequest as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except NotFound as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Удаление коллаборатора из проекта."""
        try:
            raw_data = self.validate(["project_id", "user_id"])
            project_id = raw_data["project_id"]
            target_user_id = raw_data["user_id"]
            current_user_id = get_jwt_identity()

            if not collaborators_exist(project_id, current_user_id):
                raise Forbidden("You are not a member of the project")
            current_role = collaborators_getrole(project_id, current_user_id)
            target_role = collaborators_getrole(project_id, target_user_id)
            if current_role == 0 or target_role == 0:
                raise BadRequest("User is not in the project")
            if current_role <= target_role:
                raise Forbidden("You cannot delete an equal or higher member")

            collaborators_delete(project_id, target_user_id)
            logger.info(f"Deleted collaborator user_id={target_user_id} from project_id={project_id}")
            return ApiResponse.success({"message": "Collaborator deleted"}, request.method)
        except BadRequest as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except NotFound as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Boards(NoneResource):
    """Ресурс для управления досками проекта."""
    @jwt_required()
    def get(self):
        """Получение информации о досках."""
        try:
            project_id = request.args.get("project_id", type=int)
            board_id = request.args.get("board_id", type=int)
            user_id = get_jwt_identity()

            if not can_edit(user_id, project_id=project_id):
                raise Forbidden("You are not authorized to view boards")
            boards_data = boards_info(project_id, board_id)
            return ApiResponse.success(boards_data, request.method)
        except BadRequest as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def post(self):
        """Создание новой доски."""
        try:
            raw_data = self.validate(["title", "project_id"])
            user_id = get_jwt_identity()
            valid_data = bValidate(**raw_data).model_dump()
            if not can_edit(user_id, project_id=raw_data["project_id"]):
                raise Forbidden("You are not authorized to create boards")
            board_data = boards_create(raw_data["project_id"], raw_data["title"])
            return ApiResponse.created(board_data, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Cards(NoneResource):
    """Ресурс для управления карточками."""
    @jwt_required()
    def get(self):
        """Получение информации о карточках."""
        try:
            board_id = request.args.get("board_id", type=int)
            card_id = request.args.get("card_id", type=int)
            user_id = get_jwt_identity()
            if not can_edit(user_id, board_id=board_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            cards_data = cards_info(board_id, card_id)
            return ApiResponse.success(cards_data, request.method)
        except BadRequest as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def post(self):
        """Создание новой карточки."""
        try:
            raw_data = self.validate(["board_id", "title", "about"], ["brief_about", "sell_by", "status", "priority", "external_resource"])
            user_id = get_jwt_identity()
            valid_data = cValidate(**raw_data).model_dump()
            if not can_edit(user_id, board_id=raw_data["board_id"]):
                raise Forbidden("Insufficient permissions")
            new_card = cards_create(**valid_data)
            return ApiResponse.created(new_card, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def patch(self):
        """Обновление карточки."""
        try:
            raw_data = self.validate(["card_id"], ["title", "about", "brief_about", "sell_by", "status", "priority", "external_resource", "board_id"])
            card_id = raw_data["card_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            valid_data = cValidate(**raw_data).model_dump() if any(k in raw_data for k in ["title", "about"]) else raw_data
            new_cards = cards_edit(card_id, **valid_data)
            return ApiResponse.success(new_cards, request.method)
        except BadRequest as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Удаление карточки."""
        try:
            raw_data = self.validate(["card_id"])
            card_id = raw_data["card_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            cards_delete(card_id)
            return ApiResponse.success({"message": "Card deleted"}, request.method)
        except BadRequest as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class Notification(NoneResource):
    """Ресурс для управления уведомлениями."""
    @jwt_required()
    def get(self):
        """Получение уведомлений пользователя."""
        try:
            notification_id = request.args.get("notification_id", type=int)
            user_id = get_jwt_identity()
            notifications = notifications_get(user_id, notification_id)
            return ApiResponse.success(notifications, request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Пометка уведомления как прочитанного."""
        try:
            raw_data = self.validate(["notification_id"])
            notification_id = raw_data["notification_id"]
            user_id = get_jwt_identity()
            notification_check(notification_id, user_id)
            return ApiResponse.success({"message": "Notification marked as checked"}, request.method)
        except BadRequest as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class ProjectTags(NoneResource):
    """Ресурс для управления тегами проектов."""
    @jwt_required()
    def get(self):
        """Получение тегов проекта."""
        try:
            project_id = request.args.get("project_id", type=int)
            user_id = get_jwt_identity()
            if not project_id:
                raise BadRequest("Missing required query parameter: project_id")
            if not can_edit(user_id, project_id=project_id):
                raise Forbidden("Insufficient permissions")
            tags = project_tags_get(project_id)
            return ApiResponse.success(tags, request.method)
        except BadRequest as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def post(self):
        """Добавление тегов к проекту."""
        try:
            raw_data = self.validate(["tags", "project_id"])
            tags = raw_data["tags"]
            project_id = raw_data["project_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, project_id=project_id):
                raise Forbidden("Insufficient permissions")
            tags_result = project_tags_insert(tags, project_id)
            logger.info(f"Added tags for project_id={project_id}")
            return ApiResponse.created(tags_result, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except NotFound as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def patch(self):
        """Замена всех тегов проекта."""
        try:
            raw_data = self.validate(["tags", "project_id"])
            tags = raw_data["tags"]
            project_id = raw_data["project_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, project_id=project_id):
                raise Forbidden("Insufficient permissions")
            list_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
            if not list_tags:
                raise BadRequest("No valid tags provided")
            with dbinit() as connect:
                cursor = connect.cursor()
                try:
                    cursor.execute("DELETE FROM projects_tags WHERE project_id = %s", (project_id,))
                    cursor.executemany(
                        "INSERT INTO projects_tags (tag, project_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        [(tag, project_id) for tag in list_tags]
                    )
                    connect.commit()
                    cursor.execute(
                        "SELECT id, tag, project_id FROM projects_tags WHERE project_id = %s",
                        (project_id,)
                    )
                    tags_data = cursor.fetchall()
                    column_names = [desc[0] for desc in cursor.description]
                    tags_list = [dict(zip(column_names, row)) for row in tags_data]
                    logger.info(f"Replaced tags for project_id={project_id}, new count={len(tags_list)}")
                    return ApiResponse.success(tags_list, request.method)
                except Exception as e:
                    connect.rollback()
                    logger.error(f"PATCH error during DB operation: {str(e)}")
                    raise
                finally:
                    cursor.close()
        except BadRequest as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Удаление тега из проекта."""
        try:
            raw_data = self.validate(["tag", "project_id"])
            tag = raw_data["tag"]
            project_id = raw_data["project_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, project_id=project_id):
                raise Forbidden("Insufficient permissions")
            project_tags_delete(project_id, tag)
            return ApiResponse.success({"message": "Tag deleted"}, request.method)
        except BadRequest as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

class CardTags(NoneResource):
    """Ресурс для управления тегами карточек."""
    @jwt_required()
    def get(self):
        """Получение тегов карточки."""
        try:
            card_id = request.args.get("card_id", type=int)
            user_id = get_jwt_identity()
            if not card_id:
                raise BadRequest("Missing required query parameter: card_id")
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            tags = card_tags_get(card_id)
            return ApiResponse.success(tags, request.method)
        except BadRequest as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"GET error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def post(self):
        """Добавление тегов к карточке."""
        try:
            raw_data = self.validate(["tags", "card_id"])
            tags = raw_data["tags"]
            card_id = raw_data["card_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            tags_result = card_tags_insert(tags, card_id)
            logger.info(f"Added tags for card_id={card_id}")
            return ApiResponse.created(tags_result, request.method)
        except BadRequest as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except NotFound as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Exception as e:
            logger.error(f"POST error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def patch(self):
        """Замена всех тегов карточки."""
        try:
            raw_data = self.validate(["tags", "card_id"])
            tags = raw_data["tags"]
            card_id = raw_data["card_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            list_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
            if not list_tags:
                raise BadRequest("No valid tags provided")
            with dbinit() as connect:
                cursor = connect.cursor()
                try:
                    cursor.execute("DELETE FROM cards_tags WHERE card_id = %s", (card_id,))
                    cursor.executemany(
                        "INSERT INTO cards_tags (tag, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        [(tag, card_id) for tag in list_tags]
                    )
                    connect.commit()
                    cursor.execute(
                        "SELECT id, tag, card_id FROM cards_tags WHERE card_id = %s",
                        (card_id,)
                    )
                    tags_data = cursor.fetchall()
                    column_names = [desc[0] for desc in cursor.description]
                    tags_list = [dict(zip(column_names, row)) for row in tags_data]
                    logger.info(f"Replaced tags for card_id={card_id}, new count={len(tags_list)}")
                    return ApiResponse.success(tags_list, request.method)
                except Exception as e:
                    connect.rollback()
                    logger.error(f"PATCH error during DB operation: {str(e)}")
                    raise
                finally:
                    cursor.close()
        except BadRequest as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except Forbidden as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"PATCH error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

    @jwt_required()
    def delete(self):
        """Удаление тега из карточки."""
        try:
            raw_data = self.validate(["tag", "card_id"])
            tag = raw_data["tag"]
            card_id = raw_data["card_id"]
            user_id = get_jwt_identity()
            if not can_edit(user_id, card_id=card_id):
                raise Forbidden("Insufficient permissions")
            card_tags_delete(card_id, tag)
            return ApiResponse.success({"message": "Tag deleted"}, request.method)
        except BadRequest as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(400, str(e), request.method)
        except NotFound as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(404, str(e), request.method)
        except Forbidden as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(403, str(e), request.method)
        except Exception as e:
            logger.error(f"DELETE error: {str(e)}")
            return ApiResponse.error(500, str(e), request.method)

__all__ = [
    "Users", "Auth", "Refresh", "Projects",
    "Collaborators", "Boards", "Cards", "Notification",
    "ProjectTags", "CardTags"
]