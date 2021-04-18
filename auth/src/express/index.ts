import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
dotenv.config();

const {
  AUTH_PORT,
} = process.env;

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.all("/*", function (req: Request, res: Response, next) {
  let oneof = false;
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    oneof = true;
  }
  if (req.headers["access-control-request-method"]) {
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"],
    );
    oneof = true;
  }
  if (req.headers["access-control-request-headers"]) {
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"],
    );
    oneof = true;
  }
  if (oneof) {
    res.header("Access-Control-Max-Age", `${60 * 60 * 24 * 365}`);
  }

  // intercept OPTIONS method
  if (oneof && req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.get("/", (_, res: Response) => {
  res.status(418).send({
    message: "Welcome to EMS API.",
  });
});
app.set("port", AUTH_PORT);

export { app };
