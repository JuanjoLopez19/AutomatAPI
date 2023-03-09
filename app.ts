import express, { Express, Request, Response, NextFunction } from "express";
import BodyParser from "body-parser";
import cors from "cors";
import User, { UserInput, role } from "./database/models/user";
import Templates from "./database/models/templates";
Templates.findAll().then((items) => {
	items.forEach((item) => {
		console.log(item);
	});
});
/*let a: UserInput = {
	username: "test",
	password: "test",
	email: "test",
	date: new Date(),
	role: role.client,
};
user.create(a);*/
const app: Express = express();
app.use(BodyParser.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});


// error handler
app.use(function(err: { message: any; status: any; }, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 404).send({message: 'Unknown route'})
});

export default app;
