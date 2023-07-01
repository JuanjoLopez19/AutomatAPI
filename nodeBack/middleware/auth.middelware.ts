import User from '../database/models/user'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'

/**
 * Checks if the username and email are already used
 * @param {Request} req  Request object of Express
 * @param {Response} res  Response object of Express
 * @param {NextFunction} next  Next function of Express
 * @returns next() if the username and email are not used
 */

export const verifySignUp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Username Check
  if (req.body.username != undefined && req.body.email != undefined) {
    User.findOne({
      where: {
        username: req.body.username,
      },
    })
      .then((user: User | null) => {
        if (user) {
          res
            .status(400)
            .contentType('application/json')
            .json({ message: 'T_USERNAME_USED', status: 400 })
            .send()
          return
        }

        // Email Check
        User.findOne({
          where: {
            email: req.body.email,
          },
        })
          .then((user: User | null) => {
            if (user) {
              res
                .status(400)
                .contentType('application/json')
                .json({
                  message: 'T_EMAIL_USED',
                  status: 400,
                })
                .send()
              return
            }

            next()
          })
          .catch((err: any) => {
            res
              .status(500)
              .contentType('application/json')
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              .send()
          })
      })
      .catch((err: any) => {
        res
          .status(500)
          .contentType('application/json')
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          .send()
        return
      })
  } else
    res
      .status(400)
      .contentType('application/json')
      .json({ message: 'T_BAD_REQUEST', status: 400 })
      .send()
  return
}

/**
 * Checks if the username and the password are correct
 * @param {Request} req  Request object of Express
 * @param {Response} res  Response object of Express
 * @param {NextFunction} next  Next function of Express
 * @returns next() if the username and the password are correct
 */

export const verifySignIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email != undefined && req.body.password != undefined) {
    try {
      User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user: User | null) => {
          if (user) {
            let passwordIsValid = bcrypt.compareSync(
              req.body.password,
              // @ts-ignore: Object is possibly 'null'.
              user.password || ''
            )

            if (!passwordIsValid) {
              return res.status(401).send({
                message: 'T_PASSWORD_INVALID',
                status: 401,
              })
            }

            res.locals.user = user
            next()
          } else {
            res
              .status(404)
              .contentType('application/json')
              .json({ message: 'T_USER_NOT_FOUND', status: 404 })
              .send()
            return
          }
        })
        .catch((err: any) => {
          res
            .status(404)
            .contentType('application/json')
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 404 })
            .send()
          return
        })
    } catch (err: any) {
      res
        .status(500)
        .contentType('application/json')
        .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        .send()
      return
    }
  } else {
    res
      .status(400)
      .contentType('application/json')
      .json({ message: 'T_BAD_REQUEST', status: 400 })
      .send()
    return
  }
}

/**
 * Checks if the user is an admin
 * @param {Request} req  Request object of Express
 * @param {Response} res  Response object of Express
 * @param {NextFunction} next  Next function of Express
 * @returns next() if the user is an admin
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore: Object is possibly 'null'.
  const user_id = await jwt.decode(req.cookies['jwt']).id
  User.findByPk(user_id)
    .then((user: User | null) => {
      if (user === null) {
        res
          .status(404)
          .contentType('application/json')
          .json({ message: 'T_USER_NOT_FOUND', status: 404 })
          .send()
        return
      } else {
        if (user.role === 'admin') {
          req.user = user
          next()
        } else {
          res
            .status(403)
            .contentType('application/json')
            .json({ message: 'T_FORBIDDEN', status: 403 })
            .send()
          return
        }
      }
    })
    .catch((err: any) => {
      res
        .status(500)
        .contentType('application/json')
        .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        .send()
      return
    })
}

/**
 * Checks if the username and email are valid
 * @param {Request} req Request object of Express
 * @param {Response} res Response object of Express 
 * @param {NextFunction} next Next function of Express 
 * @returns next() if the username and email are valid
 */
export const verifyEdit = async (req: Request, res: Response, next: NextFunction) => {
  // Username Check
  if (req.body.username != undefined && req.body.email != undefined) {
    let user_id = 0
    if (
      jwt.decode(req.cookies['jwt']) != null &&
      req.body.user_id == undefined
    ) {
      // @ts-ignore: Object is possibly 'null'.
      user_id = await jwt.decode(req.cookies['jwt']).id
    } else {
      user_id = req.body.user_id
    }
    User.findOne({
      where: {
        username: req.body.username,
        id: {
          [Op.ne]: user_id,
        },
      },
    })
      .then((user: User | null) => {
        if (user) {
          res
            .status(400)
            .contentType('application/json')
            .json({ message: 'T_USERNAME_USED', status: 400 })
            .send()
          return
        }

        // Email Check
        User.findOne({
          where: {
            email: req.body.email,
            id: {
              [Op.ne]: user_id,
            },
          },
        })
          .then((user: User | null) => {
            if (user) {
              res
                .status(400)
                .contentType('application/json')
                .json({
                  message: 'T_EMAIL_USED',
                  status: 400,
                })
                .send()
              return
            }

            next()
          })
          .catch((err: any) => {
            res
              .status(500)
              .contentType('application/json')
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              .send()
          })
      })
      .catch((err: any) => {
        res
          .status(500)
          .contentType('application/json')
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          .send()
        return
      })
  } else
    res
      .status(400)
      .contentType('application/json')
      .json({ message: 'T_BAD_REQUEST', status: 400 })
      .send()
  return
}
