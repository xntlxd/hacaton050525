from api.v1 import *
from api.v1.resource import *
from flask_restful import Api
from flask_jwt_extended import JWTManager
from config import *
from flask_cors import CORS

apiclient = Api(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

apiclient.add_resource(Users, "/api/v1/users")
apiclient.add_resource(Auth, "/api/v1/users/auth")
apiclient.add_resource(Refresh, "/api/v1/refresh")

apiclient.add_resource(Projects, "/api/v1/projects")
apiclient.add_resource(Collaborators, "/api/v1/projects/collaborators")
apiclient.add_resource(Boards, "/api/v1/projects/boards")
apiclient.add_resource(Cards, "/api/v1/projects/cards")
apiclient.add_resource(ProjectTags, "/api/v1/projects/tags")

apiclient.add_resource(Notification, "/api/v1/notification")

app.secret_key = SECRET_KEY
app.config['JWT_SECRET_KEY'] = 'your-secure-secret-key' 
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) 
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers']


if __name__ == "__main__":
    
    app.run(
        host="0.0.0.0",
        debug=True,
    )