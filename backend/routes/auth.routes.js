import { Router } from "express";
const router = Router();
import {
  register,
  login,
  getUserList,
} from "../controllers/auth.controller.js";

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUserList);

export default router;
