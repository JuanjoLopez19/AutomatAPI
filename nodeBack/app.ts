import express, { Express, Request, Response, NextFunction } from 'express'
import BodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import * as swaggerdocs from './reference/express-API.json'
import Session from 'express-session'
import config from './config/config'
import './passport'

const app: Express = express()

app.use(
  cors({
    origin: [
      'http://10.8.0.20:4200',
      'http://localhost:4200',
      'http://192.168.0.55:4200',
      'http://automatapi.ddns.net:4200',
      'https://automatapi.ddns.net:4200',
    ],
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use(
  Session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

app.use(cookieParser())
app.use(BodyParser.json())

app.use(passport.initialize())
app.use(passport.session()) // Need to use session for social auth

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerdocs))
app.use('/api', routes)

app.use(function (
  err: { message: any; status: any },
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 404).send({ message: 'Unknown route' })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

// Google social auth
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.host}:${config.port}/api/auth/failure`,
    successRedirect: `${config.host}:${config.port}/api/auth/succes/google`,
  })
)

// Github social auth
app.get(
  '/api/auth/github',
  passport.authenticate('github', { scope: ['user'] })
)
app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${config.host}:${config.port}/api/auth/failure`,
    successRedirect: `${config.host}:${config.port}/api/auth/succes/github`,
  })
)

// Twitter social auth
app.get('/api/auth/twitter', passport.authenticate('twitter'))

app.get(
  '/api/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: `http://localhost:${config.port}/api/auth/failure`,
    successRedirect: `http://localhost:${config.port}/api/auth/succes/twitter`,
  })
)

export default app
