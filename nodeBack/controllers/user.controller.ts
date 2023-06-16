import { Request, Response } from 'express'
import User from '../database/models/user'
import config from '../config/config'
import axios from 'axios'
import Templates, { Tokens } from '../database/models/templates'
import { WhereOptions } from 'sequelize'
import {
  deleteItemsAWS,
  formatSessionObject,
} from '../middleware/auxiliaryFunctions'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const getUsers = async (req: Request, res: Response) => {
  if (req.user) {
    const users = await User.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['password', 'password_token'] },
    })
    res.status(200).json({ data: users, message: 'T_USERS_FOUND', status: 200 })
  } else {
    res.status(401).json({ message: 'T_UNAUTHORIZED' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  if (req.body.user_id !== undefined) {
    User.findByPk(req.body.user_id).then(user => {
      if (user == null) {
        res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
        return
      }
      Templates.findAll({
        where: { user_id: user.id } as WhereOptions<Templates>,
      })
        .then(async templates => {
          if (templates.length === 0) {
            user
              .destroy()
              .then(() => {
                res.status(200).json({ message: 'T_USER_DELETED', status: 200 })
                return
              })
              .catch(err => {
                console.log(err)
                res
                  .status(500)
                  .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
                return
              })
          } else {
            try {
              await Promise.all(
                templates.map(async template => {
                  const token = await Tokens.findOne({
                    where: { template_id: template.id },
                  })
                  if (token) {
                    deleteItemsAWS(
                      [token.cert_key || '', token.private_key || ''],
                      token.template_token
                    )
                    await token.destroy()
                  }
                })
              )

              const response = await axios.delete(
                `${config.python.host}:${config.python.port}/users/${user.id}/delete`
              )
              res.status(response.status).json({
                status: response.status,
                message: response.data.message,
              })
            } catch (err) {
              console.log(err)
              res
                .status(500)
                .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            }
          }
        })
        .catch(err => {
          console.log(err)
          res
            .status(500)
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          return
        })
    })
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  //@ts-ignore
  const user_id = await jwt.decode(req.cookies['jwt']).id
  User.findByPk(user_id).then(user => {
    if (user == null) {
      res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
      return
    }
    Templates.findAll({
      where: { user_id: user.id } as WhereOptions<Templates>,
    })
      .then(async templates => {
        if (templates.length === 0) {
          user
            .destroy()
            .then(() => {
              res.status(200).json({ message: 'T_USER_DELETE', status: 200 })
              return
            })
            .catch(err => {
              console.log(err)
              res
                .status(500)
                .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              return
            })
        } else {
          try {
            await Promise.all(
              templates.map(async template => {
                const token = await Tokens.findOne({
                  where: { template_id: template.id },
                })
                if (token) {
                  deleteItemsAWS(
                    [token.cert_key || '', token.private_key || ''],
                    token.template_token
                  )
                  await token.destroy()
                }
              })
            )

            const response = await axios.delete(
              `${config.python.host}:${config.python.port}/users/${user.id}/delete`
            )
            res.status(response.status).json({
              status: response.status,
              message: response.data.message,
            })
          } catch (err) {
            console.log(err)
            res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          }
        }
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        return
      })
  })
}

export const editAccount = async (req: Request, res: Response) => {
  if (
    req.body.firstName !== undefined &&
    req.body.email !== undefined &&
    req.body.username !== undefined
  ) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id
    User.findByPk(user_id)
      .then((user: User | null) => {
        if (user == null) {
          res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
          return
        }
        user
          .update({
            firstName: req.body.firstName ? req.body.firstName : user.firstName,
            lastName: req.body.lastName ? req.body.lastName : user.lastName,
            birthDate: req.body.birthDate ? req.body.birthDate : user.birthDate,
            email: req.body.email ? req.body.email : user.email,
            username: req.body.username ? req.body.username : user.username,
          })
          .then(() => {
            res.status(200).json({ message: 'T_USER_UPDATE', status: 200 })
            return
          })
          .catch(err => {
            console.log(err)
            res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            return
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        return
      })
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

export const editPassword = async (req: Request, res: Response) => {
  if (
    req.body.newPassword !== undefined &&
    req.body.currentPassword !== undefined
  ) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id
    User.findByPk(user_id).then((user: User | null) => {
      if (user == null) {
        res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
        return
      }
      bcrypt.compare(
        req.body.currentPassword,
        user.password,
        (err: Error | undefined, result: boolean) => {
          if (err) {
            console.log(err)
            res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            return
          }
          if (result) {
            bcrypt.genSalt(config.saltRounds, (err, salt) => {
              if (!err) {
                bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                  if (!err) {
                    user
                      .update({ password: hash })
                      .then(() => {
                        res.status(200).json({
                          message: 'T_USER_UPDATE',
                          status: 200,
                        })
                        return
                      })
                      .catch(err => {
                        console.log(err)
                        res.status(500).json({
                          message: 'T_INTERNAL_SERVER_ERROR',
                          status: 500,
                        })
                        return
                      })
                  } else {
                    console.log(err)
                    res.status(500).json({
                      message: 'T_INTERNAL_SERVER_ERROR',
                      status: 500,
                    })
                    return
                  }
                })
              } else {
                console.log(err)
                res.status(500).json({
                  message: 'T_INTERNAL_SERVER_ERROR',
                  status: 500,
                })
                return
              }
            })
          } else {
            res.status(401).json({ message: 'T_UNAUTHORIZED', status: 401 })
            return
          }
        }
      )
    })
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
    return
  }
}

export const editAccountAdmin = async (req: Request, res: Response) => {
  if (
    req.body.firstName !== undefined &&
    req.body.email !== undefined &&
    req.body.username !== undefined &&
    req.body.user_id !== undefined
  ) {
    //@ts-ignore
    const user_id = req.body.user_id
    User.findByPk(user_id)
      .then((user: User | null) => {
        if (user == null) {
          res.status(404).json({ message: 'T_NOT_FOUND', status: 404 })
          return
        }
        user
          .update({
            firstName: req.body.firstName ? req.body.firstName : user.firstName,
            lastName: req.body.lastName ? req.body.lastName : user.lastName,
            birthDate: req.body.birthDate ? req.body.birthDate : user.birthDate,
            email: req.body.email ? req.body.email : user.email,
            username: req.body.username ? req.body.username : user.username,
            role: req.body.role ? req.body.role : user.role,
          })
          .then(() => {
            res.status(200).json({ message: 'T_USER_UPDATE', status: 200 })
            return
          })
          .catch(err => {
            console.log(err)
            res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            return
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        return
      })
  } else {
    res.status(400).json({ message: 'T_BAD_REQ', status: 400 })
  }
}

export const editPasswordAdmin = async (req: Request, res: Response) => {
  if (req.body.newPassword !== undefined && req.body.user_id !== undefined) {
    const { newPassword, user_id } = req.body
    User.findByPk(user_id).then((user: User | null) => {
      if (user == null) {
        res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
        return
      }
      bcrypt.genSalt(config.saltRounds, (err, salt) => {
        if (!err) {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (!err) {
              user
                .update({ password: hash })
                .then(() => {
                  res.status(200).json({
                    message: 'T_USER_UPDATE',
                    status: 200,
                  })
                  return
                })
                .catch(err => {
                  console.log(err)
                  res.status(500).json({
                    message: 'T_INTERNAL_SERVER_ERROR',
                    status: 500,
                  })
                  return
                })
            } else {
              console.log(err)
              res.status(500).json({
                message: 'T_INTERNAL_SERVER_ERROR',
                status: 500,
              })
              return
            }
          })
        } else {
          console.log(err)
          res.status(500).json({
            message: 'T_INTERNAL_SERVER_ERROR',
            status: 500,
          })
          return
        }
      })
    })
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
    return
  }
}

export const getUserInfo = async (req: Request, res: Response) => {
  //@ts-ignore
  const user_id = await jwt.decode(req.cookies['jwt']).id
  User.findByPk(user_id)
    .then((user: User | null) => {
      if (user == null) {
        res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
        return
      } else {
        const sessionObject = formatSessionObject(user)
        if (
          sessionObject &&
          Object.keys(sessionObject).length !== 0 &&
          Object.getPrototypeOf(sessionObject) === Object.prototype
        ) {
          return res
            .status(200)
            .json({ message: 'T_USER_INFO', status: 200, data: sessionObject })
        } else {
          return res
            .status(500)
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        }
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
      return
    })
}
