import User, { UserAttributes, role } from '../database/models/user'
import { Request, Response } from 'express'
import config from '../config/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  formatSessionObject,
  generateToken,
  sendActivationEmail,
  sendPasswordResetEmail,
} from '../middleware/auxiliaryFunctions'
import { Op, WhereOptions } from 'sequelize'

export const Signup = async (req: Request, res: Response) => {
  if (
    req.body.password != undefined &&
    req.body.username != undefined &&
    req.body.email != undefined &&
    req.body.date != undefined &&
    req.body.name != undefined &&
    req.body.surname != undefined
  ) {
    let user: UserAttributes = {
      username: req.body.username,
      email: req.body.email,
      role: role.client,
      birthDate: req.body.date,
      firstName: req.body.name,
      lastName: req.body.surname,
      password: '',
      activeUser: false,
      access_token: '',
      password_token: '',
    }

    bcrypt.genSalt(
      config.saltRounds,
      (err: Error | undefined, salt: string) => {
        if (!err) {
          bcrypt.hash(
            req.body.password,
            salt,
            (err: Error | undefined, passwordHashed: string) => {
              if (!err) {
                let userTokens = []
                for (let i = 0; i < 2; i++) userTokens.push(generateToken(100))
                user.password = passwordHashed
                user.access_token = userTokens[0]
                user.password_token = userTokens[1]

                User.create(user)
                  .then(createdUser => {
                    if (createdUser) {
                      sendActivationEmail(
                        createdUser.email,
                        createdUser.access_token,
                        createdUser.username
                      ).then(response => {
                        if (response === 200) {
                          res.status(200).send({
                            message: 'T_EMAIL_SENT_SUCCESFULLY',
                            status: 200,
                          })
                        } else {
                          createdUser
                            .destroy()
                            .then(() => {
                              res.status(500).send({
                                message: 'T_INTERNAL_SERVER_ERROR',
                                status: 500,
                              })
                            })
                            .catch(err => {
                              res.status(500).send({
                                message: 'T_INTERNAL_SERVER_ERROR',
                                status: 500,
                              })
                            })
                        }
                      })
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: 'T_INTERNAL_SERVER_ERROR',
                      status: 500,
                    })
                  })
              } else {
                res.status(500).send({
                  message: 'T_INTERNAL_SERVER_ERROR',
                  status: 500,
                })
              }
            }
          )
        } else {
          res.status(500).send({
            message: 'T_INTERNAL_SERVER_ERROR',
            status: 500,
          })
        }
      }
    )
  } else {
    res.status(400).send({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

export const Signin = async (req: Request, res: Response) => {
  let user: User
  if (!res.locals.user) {
    res.status(404).json({
      message: 'T_USER_NOT_FOUND',
      status: 404,
    })
  }
  user = res.locals.user

  if (!user.activeUser) {
    return res.status(401).send({
      message: 'T_USER_NOT_ACTIVE',
      status: 401,
    })
  }

  const sessionObject = formatSessionObject(user)
  const token = jwt.sign(
    {
      id: user.id,
    },
    config.secretKey,
    {
      expiresIn: `${config.expiration}s`,
    }
  )
  if (
    sessionObject &&
    Object.keys(sessionObject).length !== 0 &&
    Object.getPrototypeOf(sessionObject) === Object.prototype
  ) {
    return res
      .cookie('jwt', token, { httpOnly: true, secure: false })
      .status(200)
      .send({ data: sessionObject, status: 200, message: 'T_USER_LOGIN' })
  } else {
    return res
      .status(500)
      .send({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
  }
}

export const Signout = (req: Request, res: Response) => {
  if (req.cookies.jwt) {
    res
      .clearCookie('jwt')
      .status(200)
      .send({ message: 'T_USER_LOGOUT', status: 200 })
  } else {
    res.status(400).send({ message: 'T_INVALID_TOKEN', status: 400 })
  }
}

export const activateAccount = async (req: Request, res: Response) => {
  if (req.body.token != undefined) {
    User.findOne({ where: { access_token: req.body.token } })
      .then((user: User | null) => {
        if (!user) {
          return res.status(404).send({
            message: 'T_USER_NOT_FOUND',
            status: 404,
          })
        } else if (user.activeUser) {
          return res.status(401).send({
            message: 'T_USER_ALREADY_ACTIVATED',
            status: 401,
          })
        } else {
          user
            .update({ activeUser: true, access_token: '' })
            .then(() => {
              const token = jwt.sign({ id: user.id }, config.secretKey, {
                expiresIn: `${config.expiration}s`,
              })
              return res
                .status(200)
                .cookie('jwt', token, {
                  httpOnly: true,
                  secure: false,
                })
                .send({
                  message: 'T_USER_ACTIVATED',
                  status: 200,
                })
            })
            .catch(err => {
              return res.status(500).send({
                message: 'T_INTERNAL_SERVER_ERROR',
                status: 500,
              })
            })
        }
      })
      .catch(err => {
        return res.status(500).send({
          message: 'T_INTERNAL_SERVER_ERROR',
          status: 500,
        })
      })
  } else {
    return res.status(400).send({
      message: 'T_BAD_REQUEST',
      status: 400,
    })
  }
}

export const rememberPassword = async (req: Request, res: Response) => {
  if (req.query.username != undefined && req.query.email != undefined) {
    User.findOne({
      where: {
        [Op.and]: [
          { username: req.query.username },
          { email: req.query.email },
        ],
      } as WhereOptions<User>,
    })
      .then((user: User | null) => {
        if (!user) {
          return res.status(404).send({
            message: 'T_USER_NOT_FOUND',
            status: 404,
          })
        }
        sendPasswordResetEmail(
          user.email,
          user.password_token,
          user.username
        ).then(response => {
          if (response === 200) {
            return res.status(200).send({
              message: 'T_EMAIL_SENT_SUCCESFULLY',
              status: 200,
            })
          } else {
            return res.status(500).send({
              message: 'T_INTERNAL_SERVER_ERROR',
              status: 500,
            })
          }
        })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: 'T_INTERNAL_SERVER_ERROR',
          status: 500,
        })
      })
  } else {
    return res.status(400).send({
      message: 'T_BAD_REQUEST',
      status: 400,
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  if (req.body.token != undefined && req.body.password != undefined) {
    User.findOne({ where: { password_token: req.body.token } })
      .then((user: User | null) => {
        if (!user) {
          return res.status(404).send({
            message: 'T_USER_NOT_FOUND',
            status: 404,
          })
        } else {
          bcrypt.genSalt(
            config.saltRounds,
            (err: Error | undefined, salt: string) => {
              if (!err) {
                bcrypt.hash(
                  req.body.password,
                  salt,
                  (err: Error | undefined, hash: string) => {
                    if (!err) {
                      user
                        .update({
                          password: hash,
                        })
                        .then(() => {
                          return res.status(200).send({
                            message: 'T_PASSWORD_RESET_SUCCESS',
                            status: 200,
                          })
                        })
                        .catch(err => {
                          return res.status(500).send({
                            message: 'T_INTERNAL_SERVER_ERROR',
                            status: 500,
                          })
                        })
                    } else {
                      return res.status(500).send({
                        message: 'T_INTERNAL_SERVER_ERROR',
                        status: 500,
                      })
                    }
                  }
                )
              } else {
                return res
                  .status(500)
                  .send({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              }
            }
          )
        }
      })
      .catch(err => {
        return res.status(500).send({
          message: 'T_INTERNAL_SERVER_ERROR',
          status: 500,
        })
      })
  } else {
    return res.status(400).send({
      message: 'T_BAD_REQUEST',
      status: 400,
    })
  }
}

export const CompleteRegistration = async (req: Request, res: Response) => {
  if (req.body.access_token != undefined && req.body.password != undefined) {
    // @ts-ignore
    const userId = await jwt.decode(req.cookies['socialAuth']).id
    const access_token = req.body.access_token
    const password = req.body.password
    User.findOne({
      where: { id: userId, access_token: access_token } as WhereOptions<User>,
    })
      .then((user: User | null) => {
        if (user) {
          bcrypt.genSalt(
            config.saltRounds,
            (err: Error | undefined, salt: string) => {
              if (!err) {
                bcrypt.hash(
                  password,
                  salt,
                  (err: Error | undefined, hash: string) => {
                    if (!err) {
                      if (req.body.email === '') {
                        user
                          .update({
                            username: req.body.username,
                            password: hash,
                            access_token: '',
                            activeUser: true,
                          })
                          .then(() => {
                            const token = jwt.sign(
                              {
                                id: user.id,
                              },
                              config.secretKey,
                              {
                                expiresIn: `${config.expiration}s`,
                              }
                            )
                            return res
                              .status(200)
                              .clearCookie('socialAuth')
                              .cookie('jwt', token, {
                                httpOnly: true,
                                secure: false,
                              })
                              .send({
                                message: 'T_REGISTER_SUCCESS',
                                status: 200,
                              })
                          })
                          .catch(err => {
                            return res.status(500).send({
                              message: 'T_INTERNAL_SERVER_ERROR',
                              status: 500,
                            })
                          })
                      } else {
                        user
                          .update({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            access_token: '',
                            activeUser: true,
                          })
                          .then(() => {
                            const token = jwt.sign(
                              {
                                id: user.id,
                              },
                              config.secretKey,
                              {
                                expiresIn: `${config.expiration}s`,
                              }
                            )
                            return res
                              .status(200)
                              .clearCookie('socialAuth')
                              .cookie('jwt', token, {
                                httpOnly: true,
                                secure: false,
                              })
                              .send({
                                message: 'T_REGISTER_SUCCESS',
                                status: 200,
                              })
                          })
                          .catch(err => {
                            return res.status(500).send({
                              message: 'T_INTERNAL_SERVER_ERROR',
                              status: 500,
                            })
                          })
                      }
                    } else {
                      return res.status(500).send({
                        message: 'T_INTERNAL_SERVER_ERROR',
                        status: 500,
                      })
                    }
                  }
                )
              } else {
                return res
                  .status(500)
                  .send({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              }
            }
          )
        }
      })
      .catch(err => {
        return res.status(500).send({
          message: 'T_INTERNAL_SERVER_ERROR',
          status: 500,
        })
      })
  } else {
    return res.status(400).send({
      message: 'T_BAD_REQUEST',
      status: 400,
    })
  }
}

export const genSession = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = await jwt.decode(req.cookies['jwt']).id

  User.findByPk(userId)
    .then((user: User | null) => {
      if (user) {
        const sessionObject = formatSessionObject(user)
        res.status(200).send({
          data: sessionObject,
          status: 200,
          message: 'T_SESSION_GENERATED',
        })
      } else {
        return res.status(404).send({
          message: 'T_USER_NOT_FOUND',
          status: 404,
        })
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: 'T_INTERNAL_SERVER_ERROR',
        status: 500,
      })
    })
}
