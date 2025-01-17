import nodemailer from 'nodemailer'
import config from '../../config/config'

export interface mailOptions {
  from: string
  to: string
  subject: string
  html: string
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
})

/**
 * Send the email to the user with the especified options
 * @param mailOptions Options of the email to be sent
 * @returns promise with the status of the email sent
 */
export const sendMail = function (mailOptions: mailOptions) {
  return new Promise((resolve, reject) => {
    try {
      transporter.verify(function (err, success) {
        if (err) {
          console.log('Error while verifying stmp connection: ', err)
          reject({ status: 500, message: err })
        } else {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Error while sending email: ', error)
              reject({ status: 500, message: error })
            } else {
              resolve({ status: 200, message: 'T_EMAIL_SENT' })
            }
          })
        }
      })
    } catch (err: any) {
      console.log('Email ERROR : ' + err.code)
      reject({
        status: 500,
        message: 'T_ERROR_SENDING_EMAIL',
      })
    }
  })
}
