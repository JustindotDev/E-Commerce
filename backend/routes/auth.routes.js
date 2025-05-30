import express from "express";
import {
  Signup,
  Login,
  Logout,
  Verify,
  OAuthCallback,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/oauth-callback", OAuthCallback);

router.get("/verify", Verify);

export default router;
