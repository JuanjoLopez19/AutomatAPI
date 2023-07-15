module.exports = {
	apps: [
		{
			name: "Node",
			cwd: "./nodeBack/",
			script: "npm",
			args: ["run start"],
			out_file: "./log/backend.log",
			error_file: "./log/backend_err.log",
		},
		{
			name: "Flask",
			cwd: "./flaskBack/",
			script: "venv/Scripts/python.exe",
			args: ["app.py"],
			out_file: "./log/python.log",
			error_file: "./log/python.log",
		},
		{
			name: "Angular",
			cwd: "./automatAPI/",
			script: "npm",
			args: ["run", "dist"],
			out_file: "./log/frontend.log",
			error_file: "./log/frontend.log_err.log",
		},
	],
};
