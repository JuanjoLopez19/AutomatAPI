from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class {{cookiecutter.table_name|capitalize}}(db.Model):
    __tablename__ = '{{cookiecutter.table_name}}'
    id = db.Column('{{cookiecutter.table_name}}_id', db.Integer, primary_key = True)
    el_1 = db.Column(db.String(100))
    el_2 = db.Column(db.String(50))
    el_3 = db.Column(db.String(200)) 
    el_4 = db.Column(db.String(10))

    def __init__(self, el_1, el_2, el_3,el_4):
        self.el_1 = el_1
        self.el_2 = el_2
        self.el_3 = el_3
        self.el_4 = el_4