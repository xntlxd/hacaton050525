from api.v1 import *
from api.v1.resource import *
from flask_restful import Api
from flask_jwt_extended import JWTManager
from config import *

apiclient = Api(app)
jwt = JWTManager(app)

apiclient.add_resource(Users, "/api/v1/users")
apiclient.add_resource(Auth, "/api/v1/users/auth")
apiclient.add_resource(Refresh, "/api/v1/refresh")
apiclient.add_resource(Projects, "/api/v1/projects")

app.secret_key = SECRET_KEY
app.config["JWT_SECRET_KEY"] = JWT_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = ACCESS_TIME

if __name__ == "__main__":
    
    app.run(
        host="0.0.0.0",
        debug=True,
    )