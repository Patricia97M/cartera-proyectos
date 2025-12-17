from flask import Flask, jsonify, request # type: ignore
from dotenv import load_dotenv # type: ignore
from models import db, User, Project # type: ignore
from datetime import datetime, timezone
from flask_cors import CORS
import os
load_dotenv()

app = Flask(__name__)
CORS(app)

# Cadena de conexión a la base de datos PostgreSQL.
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
    f"@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}/{os.environ['DB_NAME']}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicia la conexión con la base de datos.
db.init_app(app)

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
            
        if not email or not password:
            return jsonify({"error": "Email and password are required", "status": "MISSING_CREDENTIALS"}), 400
            
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid credentials", "status": "INVALID_CREDENTIALS"}), 401
        if user.password != password:
            return jsonify({"error": "Invalid credentials", "status": "INVALID_CREDENTIALS"}), 401
            
        return jsonify({
            "message": "Login successful",
            "status": "SUCCESS",
            "user": {
                "id": user.id,
                "email": user.email
            }
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "detail": str(e),
            "status": "ERROR"
        }), 500


@app.route("/proyectos", methods=["GET"])
def get_projects_by_user():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "email query param is required", "status": "MISSING_EMAIL_PARAM"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found", "status": "USER_NOT_FOUND"}), 404

        projects = [
            {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "status": project.status,
                "createdAt": project.created_at.isoformat().replace("+00:00", "Z"),
                "updatedAt": project.updated_at.isoformat().replace("+00:00", "Z")
            }
            for project in user.projects
            if project.is_deleted == False
        ]

        return jsonify(projects), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "detail": str(e),
            "status": "ERROR"
        }), 500

@app.route("/proyectos", methods=["POST"])
def create_project():
    try:
        data = request.get_json()
        
        email = data.get("email")
        name = data.get("name")
        description = data.get("description")
        status = data.get("status")
        
        if not email or not name or not status:
            return jsonify({"error": "Email, name and status are required", "status": "MISSING_PARAMS"}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found", "status": "USER_NOT_FOUND"}), 404

        new_project = Project(
            name=name,
            description=description,
            status=status
        )
        
        db.session.add(new_project)
        db.session.flush()
        
        user.projects.append(new_project)
        
        db.session.commit()
        
        return jsonify({
            "message": "Project created successfully",
            "status": "SUCCESS",
            "project": {
                "id": new_project.id,
                "name": new_project.name,
                "description": new_project.description,
                "status": new_project.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Internal server error",
            "detail": str(e),
            "status": "ERROR"
        }), 500

@app.route("/proyectos/<int:id>", methods=["PATCH"])
def update_project_status(id):
    try:
        data = request.get_json()
        
        status = data.get("status")
        if not status:
            return jsonify({"error": "Status is required", "status": "MISSING_STATUS"}), 400
        if status not in ["enabled", "disabled"]:
            return jsonify({"error": "Invalid status value", "status": "INVALID_STATUS"}), 400
        
        project = Project.query.filter_by(id=id, is_deleted=False).first()
        
        if not project:
            return jsonify({"error": "Project not found", "status": "PROJECT_NOT_FOUND"}), 404
        
        project.status = status
        db.session.commit()
        
        return jsonify({
            "message": "Project status updated successfully",
            "status": "SUCCESS",
            "project": {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "status": project.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Internal server error",
            "detail": str(e),
            "status": "ERROR"
        }), 500

@app.route("/proyectos/<int:id>", methods=["DELETE"])
def delete_project(id):
    try:
        project = Project.query.filter_by(id=id, is_deleted=False).first()
        
        if not project:
            return jsonify({"error": "Project not found", "status": "PROJECT_NOT_FOUND"}), 404
        
        project.is_deleted = True
        project.deleted_at = datetime.now(timezone.utc)

        db.session.commit()
        
        return jsonify({
            "message": "Project deleted successfully",
            "status": "SUCCESS"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Internal server error",
            "detail": str(e),
            "status": "ERROR"
        }), 500

