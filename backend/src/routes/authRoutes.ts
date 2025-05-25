import express from "express";
import { signup, signin } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup as unknown as express.RequestHandler);
authRouter.post("/signin", signin as unknown as express.RequestHandler);

export default authRouter;
