# AutomatAPI 
## Final degree project for the Computer Science Degree in Salamanca's University <br>
The project consists on an application web that generates API templates of the most used technologies (flask, django, express) from parameters introduce in the application web <br><br>
The project is developed in three parts:
- FrontEnd 
	- Dashboard with template and users CRUD, with administration role
		- Technologies used --> AngularJS, Bootstrap
- FrontEnd BackEnd 
	- API
		- Express web service API to communicate with the front, the back and the relational database
	- Aux Tools
		- Passport --> useful to make the login and session
- BackEnd
	- Databases
		- PostgresSQL --> Relational database used to save the users and user templates' references
		- MongoDB --> Non-Relational database for a flexible template management
	- API 
		- Flask web service api for the connection between databases and FrontEnd API
	- Cookiecutter
		-  As engine for the template creation
