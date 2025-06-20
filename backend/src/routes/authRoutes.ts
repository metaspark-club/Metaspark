import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup as unknown as express.RequestHandler);
authRouter.post("/signin", signin as unknown as express.RequestHandler);
authRouter.post(
  "/forgot-password",
  forgotPassword as unknown as express.RequestHandler
);
authRouter.post(
  "/reset-password/:token",
  resetPassword as unknown as express.RequestHandler
);

export default authRouter;
