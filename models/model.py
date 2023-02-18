from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from enum import Enum

class Role(Enum):
    admin = 1
    client = 2
    
    
class Tech(Enum):
    flask = 1
    express = 2
    django = 3
    

class TechType(Enum):
    services = 1
    app_web = 2

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum(Role), nullable=False)
    username = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def serialize(self):
        return {
            'id': self.id,
            'role': self.role,
            'username': self.username,
            'password': self.password,
            'email': self.email,
            'date': self.date
        }
    
    def __getitem__(self, field):
        return self.__dict__[field]

class Templates(db.Model):
    __tablename__ = 'templates'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    app_name = db.Column(db.String(200), nullable=False)
    technology = db.Column(db.Enum(Tech), nullable=False)
    tech_type = db.Column(db.Enum(TechType), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    template_ref = db.Column(db.String(200), nullable=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.app_name,
            'technology': self.technology,
            'tech_type': self.tech_type,
            'date_created': self.date_created,
            'template_ref': self.template_ref
        }

    def __getitem__(self, field):
        return self.__dict__[field]
