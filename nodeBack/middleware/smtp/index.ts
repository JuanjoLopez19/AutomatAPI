import nodemailer from "nodemailer";
import config from "../../config/config";

export interface mailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
}
const transporter = nodemailer.createTransport({
	host: config.smtp.host,
	port: config.smtp.port,
	auth: {
		user: config.smtp.email,
		pass: config.smtp.password,
	},
	tls: {
		// do not fail on invalid certs
		rejectUnauthorized: false,
	},
});

export const sendMail = function (mailOptions: mailOptions) {
	return new Promise((resolve, reject) => {
		try {
			transporter.verify(function (err, success) {
				if (err) {
					console.log("Error while verifying stmp connection: ", err);
					reject({ status: 500, message: err });
				} else {
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log("Error while sending email: ", error);
							reject({ status: 500, message: error });
						} else {
							resolve({ status: 200, message: "Email succesfully sended!" });
						}
					});
				}
			});
		} catch (err: any) {
			console.log("Email ERROR : " + err.code);
			reject({
				status: 500,
				message: "There was an error while sending email!",
			});
		}
	});
};

/*
export const sendMultipleMail = function(mailOptions: mailOptions[]) {
  return new Promise((resolve, reject) => {
	try {
		transporter.verify(function (err, success) {
		  if (err) {
		    console.log('Error while verifying stmp connection: ',err);
		    reject({status: 500, message: err});
		  } else {
		    var flag = true;
		    forEachOf(mailOptions, function (mailToSend: mailOptions, i, inner_callback){
		    	transporter.sendMail(mailToSend, function(error, info){
			  		if (error) {
				    	console.log('Error while sending email: ',error);
				    	flag = false;
				  	}
			    	inner_callback(null)
				});
	        }, function(err: any){
	          	if (err) {
	          		reject({status: 500, message: "There was an error while sending an email"});
	          	} else {
	          		if (!flag) {
	          			reject({status: 500, message: "Some emails where not succesfully sended"});
	          		} else {
	          			resolve({status: 200, message: "Emails succesfully sended!"});
	          		}
	          	}
	        });
		  }
		});
	} catch (err: any) {
        console.log("Email ERROR : " + err.code)
        reject({status: 500, message: "There was an error while sending email!"});
	}
  });
}*/
