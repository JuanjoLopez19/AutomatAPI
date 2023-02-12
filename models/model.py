from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(), nullable=False)
    password = db.Column(db.String(), nullable=False)
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

class Templates(db.Model):
    __tablename__ = 'templates'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(), nullable=False)
    technology = db.Column(db.String(), nullable=False)
    tech_type = db.Column(db.String(), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    template_ref = db.Column(db.String(), nullable=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'technology': self.technology,
            'tech_type': self.tech_type,
            'date_created': self.date_created,
            'template_ref': self.template_ref
        }
