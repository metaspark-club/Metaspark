import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const authRouter = express.Router();

router.post("/signup", signup as unknown as express.RequestHandler);
router.post("/signin", signin as unknown as express.RequestHandler);
router.post(
  "/forgot-password",
  forgotPassword as unknown as express.RequestHandler
);
router.post(
  "/reset-password/:token",
  resetPassword as unknown as express.RequestHandler
);

export default authRouter;
