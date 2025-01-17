from enum import Enum
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Role(Enum):
    """
    Enum for user roles
    """

    admin = 1
    client = 2


class Tech(Enum):
    """
    Enum for technologies
    """

    flask = 1
    express = 2
    django = 3

    def __str__(self):
        return self.name


class TechType(Enum):
    """
    Enum for technology types
    """

    services = 1
    app_web = 2

    def __str__(self):
        return self.name


class Users(db.Model):
    """
    Class for users table in database
    """

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum(Role), nullable=False)
    username = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    firstName = db.Column(db.String(200), nullable=True)
    lastName = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String, nullable=False)
    create_date = db.Column(
        db.DateTime, nullable=False, default=db.func.current_timestamp()
    )
    birthDate = db.Column(db.DateTime, nullable=True)
    activeUser = db.Column(db.Boolean, nullable=False, default=False)
    access_token = db.Column(db.String(200), nullable=False)
    password_token = db.Column(db.String(200), nullable=False)
    google_id = db.Column(db.String(200), nullable=True)
    github_id = db.Column(db.String(200), nullable=True)
    image = db.Column(db.String(200), nullable=True)

    def serialize(self):
        """
        Method to serialize the object User and return a dictionary
        """
        return {
            "id": self.id,
            "role": self.role,
            "username": self.username,
            "password": self.password,
            "first_name": self.firstName,
            "last_name": self.lastName,
            "email": self.email,
            "active_user": self.activeUser,
            "create_date": self.create_date,
            "birthdate": self.birthDate,
            "access_token": self.access_token,
            "password_token": self.password_token,
            "google_id": self.google_id,
            "github_id": self.github_id,
            "image": self.image,
        }

    def __getitem__(self, field):
        return self.__dict__[field]


class Templates(db.Model):
    """
    Class for templates table in database
    """

    __tablename__ = "templates"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    app_name = db.Column(db.String(200), nullable=False)
    technology = db.Column(db.Enum(Tech), nullable=False)
    tech_type = db.Column(db.Enum(TechType), nullable=False)
    date_created = db.Column(
        db.DateTime, nullable=False, default=db.func.current_timestamp()
    )
    template_ref = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    last_updated = db.Column(
        db.DateTime, nullable=False, default=db.func.current_timestamp()
    )

    def serialize(self):
        """
        Method to serialize the object Template and return a dictionary
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.app_name,
            "technology": self.technology,
            "tech_type": self.tech_type,
            "date_created": self.date_created,
            "template_ref": self.template_ref,
            "description": self.description,
            "last_updated": self.last_updated,
        }

    def __getitem__(self, field):
        return self.__dict__[field]


class Tokens(db.Model):
    """
    Class for tokens table in database
    """

    __tablename__ = "Tokens"
    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(db.Integer, db.ForeignKey("templates.id"), nullable=False)
    cert_key = db.Column(db.String(200), nullable=True)
    private_key = db.Column(db.String(200), nullable=True)
    template_token = db.Column(db.String(200), nullable=False)

    def serialize(self):
        """
        Method to serialize the object Token and return a dictionary
        """
        return {
            "id": self.id,
            "template_id": self.template_id,
            "cert_key": self.cert_key,
            "private_key": self.private_key,
            "template_token": self.template_token,
        }

    def __getitem__(self, field):
        return self.__dict__[field]
