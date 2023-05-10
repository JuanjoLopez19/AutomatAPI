# AutomatAPI Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

## Installation
 ```bash
 cd automatapi
 npm install
 ```
 This will be download all the packages needed to launch the frontend
 
 ## Usage
 ### Local
 Use the localhost configuration, you have to put in <a href="https://github.com/JuanjoLopez19/automatAPI-Template/blob/main/automatAPI/src/environments/env.prod.ts"> env.prod.ts</a> the correct configuration. <br>
 Won't use ssl so, the folder certificates is not needed, when everthing is correct to launch the angular service put in a terminal:
  ```bash
 cd automatapi #If not in the correct folder
 npm start
 ```
 ### Secure Connection
 This will use secure connection with http and SSl, for this you need to create a domain with some free or paid tool, recommended <a href="https://www.noip.com/"> noIp </a> <br>
 Then install some web server (apache, nginx...) that runs on the port 80, and install the certbot for windows or linux, depending on where you are working.
 To this success you have to open the ports of your home router, check out some internet tutorial to do it, recommended to open the 80, 443 and the ones the angular server and the express server will be running. <br>
 Once you have this all done, and the certificates created.
 ```bash
 cd automatapi # In case you are not there
 mkdir certificates
 mv key.pem cert.pem certificates # Move the created certs to the folder just created
 npm run dist
 ```
