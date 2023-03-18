
if __name__ == '__main__':
    {%- if cookiecutter.connect_DB == "yes" %}
    with app.app_context():
        db.create_all()
    {%- endif %}
    app.run(host='{{cookiecutter.host}}', port='{{cookiecutter.port}}' {%- if cookiecutter.use_ssl == "yes" %}, ssl_context=('certificates/{{cookiecutter.certs.cert_name}}.pem', 'certificates/{{cookiecutter.certs.key_name}}.pem'){%- endif %})