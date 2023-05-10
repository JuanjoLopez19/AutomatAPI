# AutomatAPI Node Backend
This project use Node Version 16.13.2 with Typescript 4.9.5

## Installation
```bash
cd nodeBack
npm install
```
This will download all the neccessary packages to run the project

## Usage

### "Production"
In production, you will have your server without hotreload, in order to do this, first is needed to compile TS files to JS files and then run the server.<br> <br>
It's important to fill the <a href="https://github.com/JuanjoLopez19/automatAPI-Template/blob/main/nodeBack/temp.env">.env</a> file with the parameters, to avoid errors, if will be running on https is needed to specify the path to the certificates
else if will be running on http, change the server to http in <a href="https://github.com/JuanjoLopez19/automatAPI-Template/blob/main/nodeBack/server.ts"> server.ts </a>
```bash
npm run build
npm start
```

### Development
This will be compiled and launched in hot reload. <br>
It's important to fill the <a href="https://github.com/JuanjoLopez19/automatAPI-Template/blob/main/nodeBack/temp.env">.env</a> file with the parameters, to avoid errors, if will be running on https is needed to specify the path to the certificates
else if will be running on http, change the server to http in <a href="https://github.com/JuanjoLopez19/automatAPI-Template/blob/main/nodeBack/server.ts"> server.ts </a>
```bash
npm run dev
```
