import { Request, Response } from 'express'
import config from '../config/config'
import jwt from 'jsonwebtoken'
import axios, { AxiosRequestConfig } from 'axios'
import User from '../database/models/user'
import Templates, {
  Tokens,
  techType,
  technology,
} from '../database/models/templates'
import {
  decryptData,
  deleteItem,
  deleteItemsAWS,
  encryptData,
} from '../middleware/auxiliaryFunctions'
import { WhereOptions } from 'sequelize'

/**
 * Controller of the make flask template route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const makeFlaskTemplate = async (req: any, res: Response) => {
  if (
    req.body.tech !== undefined &&
    req.body.tech_type !== undefined &&
    req.body.template_data !== undefined
  ) {
    const { tech, tech_type, template_data } = req.body
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id

    const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null
    const aws_key_key = req.aws_key_key ? req.aws_key_key : null

    try {
      const response = await axios.post(
        `${config.python.host}:${config.python.port}/templates`,
        {
          tech: tech,
          tech_type: tech_type,
          template_data: template_data,
          aws_key_cert: aws_key_cert,
          aws_key_key: aws_key_key,
          user_id: user_id,
        }
      )
      const token = response.data.data
      const template_id = response.data.template_id
      Tokens.create({
        template_token: encryptData(token),
        template_id: template_id,
        cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
        private_key:
          aws_key_key === null ? undefined : encryptData(aws_key_key),
      })
        .then((token: any) => {
          if (!token) {
            if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
            if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
            res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          }
          res.status(response.status).json(response.data)
        })
        .catch((err: Error) => {
          console.log(err)
          if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
          if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
          res
            .status(500)
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        })
    } catch (err) {
      console.log(err)
      if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
      if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
    if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the make express template route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const makeExpressTemplate = async (req: any, res: Response) => {
  if (
    req.body.tech !== undefined &&
    req.body.tech_type !== undefined &&
    req.body.template_data !== undefined
  ) {
    const { tech, tech_type, template_data } = req.body
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id

    const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null
    const aws_key_key = req.aws_key_key ? req.aws_key_key : null

    try {
      const response = await axios.post(
        `${config.python.host}:${config.python.port}/templates`,
        {
          tech: tech,
          tech_type: tech_type,
          template_data: template_data,
          aws_key_cert: aws_key_cert,
          aws_key_key: aws_key_key,
          user_id: user_id,
        }
      )
      const token = response.data.data
      const template_id = response.data.template_id
      Tokens.create({
        template_token: encryptData(token),
        template_id: template_id,
        cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
        private_key:
          aws_key_key === null ? undefined : encryptData(aws_key_key),
      })
        .then((token: any) => {
          if (!token) {
            if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
            if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
            res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR' })
          }
          res.status(response.status).json(response.data)
        })
        .catch((err: Error) => {
          console.log(err)
          if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
          if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
          res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR' })
        })
    } catch (err) {
      console.log(err)
      if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
      if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
    if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the make django template route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const makeDjangoTemplate = async (req: any, res: Response) => {
  if (
    req.body.tech !== undefined &&
    req.body.tech_type !== undefined &&
    req.body.template_data !== undefined
  ) {
    const { tech, tech_type, template_data } = req.body
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id

    const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null
    const aws_key_key = req.aws_key_key ? req.aws_key_key : null

    try {
      const response = await axios.post(
        `${config.python.host}:${config.python.port}/templates`,
        {
          tech: tech,
          tech_type: tech_type,
          template_data: template_data,
          aws_key_cert: aws_key_cert,
          aws_key_key: aws_key_key,
          user_id: user_id,
        }
      )
      const token = response.data.data
      const template_id = response.data.template_id
      Tokens.create({
        template_token: encryptData(token),
        template_id: template_id,
        cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
        private_key:
          aws_key_key === null ? undefined : encryptData(aws_key_key),
      })
        .then((token: any) => {
          if (!token) {
            if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
            if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
            res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR' })
          }
          res.status(response.status).json(response.data)
        })
        .catch((err: Error) => {
          console.log(err)
          if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
          if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
          res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR' })
        })
    } catch (err) {
      console.log(err)
      if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
      if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
    if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the getTemplates route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const getTemplates = async (req: Request, res: Response) => {
  //@ts-ignore
  const user_id = await jwt.decode(req.cookies['jwt']).id
  User.findByPk(user_id)
    .then((user: User | null) => {
      if (user == null) {
        res.status(404).json({ message: 'T_USER_NOT_FOUND', status: 404 })
      } else {
        if (user.role == 'admin') {
          Templates.findAll({ order: [['id', 'ASC']] })
            .then((templates: Templates[]) => {
              if (templates == null)
                res.status(404).json({ message: 'T_NO_TEMPLATES', status: 404 })
              else
                res
                  .status(200)
                  .json({ data: templates, status: 200, message: 'T_SUCCESS' })
            })
            .catch(err => {
              console.log(err)
              res
                .status(500)
                .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            })
        } else {
          Templates.findAll({
            order: [['id', 'ASC']],
            where: {
              user_id: user_id,
            },
          })
            .then((templates: Templates[]) => {
              if (templates == null)
                res.status(404).json({ message: 'T_NO_TEMPLATES', status: 404 })
              else
                res
                  .status(200)
                  .json({ data: templates, status: 200, message: 'T_SUCCESS' })
            })
            .catch(err => {
              console.log(err)
              res
                .status(500)
                .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            })
        }
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    })
}

/**
 * Controller of the deleteTemplate route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const deleteTemplate = async (req: Request, res: Response) => {
  if (req.body.template_id !== undefined) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id
    try {
      Templates.findOne({
        where: {
          user_id: user_id,
          id: req.body.template_id,
        } as WhereOptions<Templates>,
      })
        .then((template: Templates | null) => {
          if (template == null) {
            res
              .status(404)
              .json({ message: 'T_TEMPLATE_NOT_FOUND', status: 404 })
          } else {
            Tokens.findOne({
              where: {
                template_id: req.body.template_id,
              } as WhereOptions<Tokens>,
            })
              .then((token: Tokens | null) => {
                if (token == null) {
                  res
                    .status(404)
                    .json({ message: 'T_TOKEN_NOT_FOUND', status: 404 })
                } else {
                  {
                    deleteItemsAWS(
                      [token.cert_key || '', token.private_key || ''],
                      token.template_token
                    )
                    token
                      .destroy()
                      .then(async () => {
                        const body = { user_id: user_id }
                        const response = await axios.delete(
                          `${config.python.host}:${config.python.port}/templates/${req.body.template_id}/delete`,
                          {
                            data: body,
                          } as AxiosRequestConfig
                        )

                        res.status(response.status).json({
                          status: response.status,
                          message: response.data.message,
                        })
                      })
                      .catch(err => {
                        console.log(err)
                        res.status(500).json({
                          message: 'T_INTERNAL_SERVER_ERROR',
                          status: 500,
                        })
                      })
                  }
                }
              })
              .catch(err => {
                console.log(err)
                res
                  .status(500)
                  .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              })
          }
        })
        .catch(err => {
          console.log(err)
          res
            .status(500)
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the deleteTemplateAdmin route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const deleteTemplateAdmin = async (req: Request, res: Response) => {
  if (
    req.user &&
    req.body.user_id !== undefined &&
    req.body.template_id !== undefined
  ) {
    try {
      const { template_id, user_id } = req.body
      Templates.findOne({
        where: {
          id: template_id,
        } as WhereOptions<Templates>,
      })
        .then((template: Templates | null) => {
          if (template == null) {
            res
              .status(404)
              .json({ message: 'T_TEMPLATE_NOT_FOUND', status: 404 })
          } else {
            Tokens.findOne({
              where: {
                template_id: template_id,
              } as WhereOptions<Tokens>,
            })
              .then((token: Tokens | null) => {
                if (token == null) {
                  res
                    .status(404)
                    .json({ message: 'T_TOKEN_NOT_FOUND', status: 404 })
                } else {
                  {
                    deleteItemsAWS(
                      [token.cert_key || '', token.private_key || ''],
                      token.template_token
                    )
                    token
                      .destroy()
                      .then(async () => {
                        const body = { user_id: user_id }
                        const response = await axios.delete(
                          `${config.python.host}:${config.python.port}/templates/${template_id}/delete`,
                          {
                            data: body,
                          } as AxiosRequestConfig
                        )

                        res.status(response.status).json({
                          status: response.status,
                          message: response.data.message,
                        })
                      })
                      .catch(err => {
                        console.log(err)
                        res.status(500).json({
                          message: 'T_INTERNAL_SERVER_ERROR',
                          status: 500,
                        })
                      })
                  }
                }
              })
              .catch(err => {
                console.log(err)
                res
                  .status(500)
                  .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              })
          }
        })
        .catch(err => {
          console.log(err)
          res
            .status(500)
            .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
        })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the getToken route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const getToken = async (req: Request, res: Response) => {
  if (req.body.template_id !== undefined) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id
    Templates.findOne({
      where: {
        id: req.body.template_id,
        user_id: user_id,
      },
    })
      .then((template: Templates | null) => {
        if (template == null) {
          res.status(404).json({ message: 'T_TEMPLATE_NOT_FOUND', status: 404 })
        } else {
          Tokens.findOne({
            where: {
              template_id: template.id,
            },
          })
            .then((token: Tokens | null) => {
              if (token == null) {
                res
                  .status(404)
                  .json({ message: 'T_TOKEN_NOT_FOUND', status: 404 })
              } else {
                const tokenDecrypt = decryptData(token.template_token)

                res.status(200).json({
                  data: tokenDecrypt,
                  status: 200,
                  message: 'T_SUCCESS',
                })
              }
            })
            .catch(err => {
              console.log(err)
              res
                .status(500)
                .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
            })
        }
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
      })
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the getTemplateStats route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const getTemplatesStats = async (req: Request, res: Response) => {
  const temp = {
    flask: { services: 0, app_web: 0 },
    express: { services: 0, app_web: 0 },
    django: { services: 0, app_web: 0 },
  }
  try {
    Templates.findAll({
      where: {
        technology: technology.flask,
      },
    })
      .then(templates => {
        if (templates.length > 0) {
          templates.forEach(template => {
            if (template.tech_type === techType.services) {
              temp.flask.services += 1
            } else {
              temp.flask.app_web += 1
            }
          })
        }
      })
      .then(() => {
        Templates.findAll({
          where: {
            technology: technology.express,
          },
        })
          .then(templates => {
            if (templates.length > 0) {
              templates.forEach(template => {
                if (template.tech_type === techType.services) {
                  temp.express.services += 1
                } else {
                  temp.express.app_web += 1
                }
              })
            }
          })
          .then(() => {
            Templates.findAll({
              where: {
                technology: technology.django,
              },
            })
              .then(templates => {
                if (templates.length > 0) {
                  templates.forEach(template => {
                    if (template.tech_type === techType.services) {
                      temp.django.services += 1
                    } else {
                      temp.django.app_web += 1
                    }
                  })
                }
              })
              .then(() => {
                res.status(200).json({
                  data: temp,
                  status: 200,
                  message: 'T_TEMPLATE_STATS_SUCCESS',
                })
              })
          })
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
  }
}

/**
 * Controller of the getUserTemplateStats route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const getUserTemplatesStats = async (req: Request, res: Response) => {
  //@ts-ignore
  const user_id = await jwt.decode(req.cookies['jwt']).id
  const temp = {
    flask: { services: 0, app_web: 0 },
    express: { services: 0, app_web: 0 },
    django: { services: 0, app_web: 0 },
  }
  try {
    Templates.findAll({
      where: {
        technology: technology.flask,
        user_id: user_id,
      },
    })
      .then(templates => {
        if (templates.length > 0) {
          templates.forEach(template => {
            if (template.tech_type === techType.services) {
              temp.flask.services += 1
            } else {
              temp.flask.app_web += 1
            }
          })
        }
      })
      .then(() => {
        Templates.findAll({
          where: {
            technology: technology.express,
            user_id: user_id,
          },
        })
          .then(templates => {
            if (templates.length > 0) {
              templates.forEach(template => {
                if (template.tech_type === techType.services) {
                  temp.express.services += 1
                } else {
                  temp.express.app_web += 1
                }
              })
            }
          })
          .then(() => {
            Templates.findAll({
              where: {
                technology: technology.django,
                user_id: user_id,
              },
            })
              .then(templates => {
                if (templates.length > 0) {
                  templates.forEach(template => {
                    if (template.tech_type === techType.services) {
                      temp.django.services += 1
                    } else {
                      temp.django.app_web += 1
                    }
                  })
                }
              })
              .then(() => {
                res.status(200).json({
                  data: temp,
                  status: 200,
                  message: 'T_SUCCESS',
                })
              })
          })
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
  }
}

/**
 * Controller of the getTemplateConfig route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const getTemplateConfig = async (req: Request, res: Response) => {
  if (req.body.template_id != undefined) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id

    try {
      const response = await axios.post(
        `${config.python.host}:${config.python.port}/templates/getTemplateConfig`,
        {
          template_id: req.body.template_id,
          user_id: user_id,
        }
      )

      return res.status(response.status).json(response.data)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
    }
  } else {
    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}

/**
 * Controller of the editTemplate route
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 * @returns {Response} Returns a response with the status code and a message
 */
export const editTemplate = async (req: any, res: Response) => {
  if (
    req.body.template_id != undefined &&
    req.body.tech_type != undefined &&
    req.body.template_data != undefined
  ) {
    //@ts-ignore
    const user_id = await jwt.decode(req.cookies['jwt']).id
    const { template_id, tech_type, template_data, delete_certs } = req.body
    const new_key_cert = req.aws_key_cert ? req.aws_key_cert : null
    const new_private_key = req.aws_key_key ? req.aws_key_key : null

    Tokens.findOne({
      where: {
        template_id: template_id,
      },
    })
      .then(async token => {
        if (token === null) {
          if (new_key_cert) deleteItem(new_key_cert, 'certs')
          if (new_private_key) deleteItem(new_private_key, 'certs')
          return res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
        } else {
          const old_cert_key = token.cert_key
          const old_cert_key_decoded = old_cert_key
            ? decryptData(old_cert_key)
            : null

          const old_private_key = token.private_key
          const old_private_key_decoded = old_private_key
            ? decryptData(old_private_key)
            : null

          try {
            const response = await axios.put(
              `${config.python.host}:${config.python.port}/templates/${template_id}/update`,
              {
                template_data: template_data,
                template_id: template_id,
                user_id: user_id,
                tech_type: tech_type,
                aws_key_cert: new_key_cert
                  ? new_key_cert
                  : old_cert_key_decoded,
                aws_key_key: new_private_key
                  ? new_private_key
                  : old_private_key_decoded,
              }
            )
            const template_token = response.data.data
            deleteItem(token.template_token, 'templates')

            let temp1: string | null | undefined,
              temp2: string | null | undefined

            if (new_key_cert) temp1 = encryptData(new_key_cert)
            else {
              if (delete_certs === 'yes') temp1 = null
              else temp1 = old_cert_key
            }

            if (new_private_key) temp2 = encryptData(new_private_key)
            else {
              if (delete_certs === 'yes') temp2 = null
              else temp2 = old_private_key
            }

            token
              .update({
                template_token: encryptData(template_token),
                cert_key: temp1,
                private_key: temp2,
              })
              .then(() => {
                if (
                  (new_key_cert && old_cert_key) ||
                  (new_key_cert === null &&
                    old_cert_key &&
                    delete_certs === 'yes')
                )
                  deleteItem(old_cert_key)
                if (
                  (new_private_key && old_private_key) ||
                  (new_private_key === null &&
                    old_private_key &&
                    delete_certs === 'yes')
                )
                  deleteItem(old_private_key)

                res.status(response.status).json(response.data)
              })
              .catch(err => {
                console.log(err)
                if (new_key_cert) deleteItem(new_key_cert, 'certs')
                if (new_private_key) deleteItem(new_private_key, 'certs')
                return res
                  .status(500)
                  .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
              })
          } catch (err) {
            console.log(err)
            if (new_key_cert) deleteItem(new_key_cert, 'certs')
            if (new_private_key) deleteItem(new_private_key, 'certs')
            return res
              .status(500)
              .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
          }
        }
      })
      .catch(err => {
        console.log(err)
        if (new_key_cert) deleteItem(new_key_cert, 'certs')
        if (new_private_key) deleteItem(new_private_key, 'certs')
        res
          .status(500)
          .json({ message: 'T_INTERNAL_SERVER_ERROR', status: 500 })
      })
  } else {
    if (req.aws_key_cert) deleteItem(req.aws_key_cert, 'certs')
    if (req.aws_key_key) deleteItem(req.aws_key_key, 'certs')

    res.status(400).json({ message: 'T_BAD_REQUEST', status: 400 })
  }
}
