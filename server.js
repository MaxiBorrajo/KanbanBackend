//Imports

import "dotenv/config";

import express from "express";

import session from "express-session";

import MongoDBStore from "connect-mongodb-session";

import morgan from "morgan";

import cors from "cors";

import passport from "passport";

import xss from "xss-clean";

import helmet from "helmet";

import errorHandlerMiddleware from "./src/middlewares/errorHandlerMiddleware.js";

import compression from "compression";

import userRoute from "./src/routes/userRoute.js";

import tableRoute from "./src/routes/tableRoute.js";

import taskRoute from "./src/routes/taskRoute.js";

//Dependencies

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
  uri: process.env.DB_URI,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure:true,
      sameSite: "none",
      domain:".railway.app"
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(helmet());

app.use(xss());

//Routes

app.use("/api/users", userRoute);

app.use("/api/tables", tableRoute);

app.use("/api/tasks", taskRoute);

//Global middlewares

app.use(errorHandlerMiddleware);

app.use(compression());

//Exports

export default app;
