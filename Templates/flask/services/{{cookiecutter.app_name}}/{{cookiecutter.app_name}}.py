from flask import Flask

app = Flask(__name__)

# Here goes if theres config file
{% if cookiecutter.config_file == 'yes' %}
app.config.from_pyfile('./config.cfg')
{% endif %}


#Here goes the endpoinst to be added


if __name__ == '__main__':
    app.run(host='{{cookiecutter.host}}', port='{{cookiecutter.port}}')