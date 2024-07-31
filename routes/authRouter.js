import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js";
import rateLimit from "express-rate-limit";
const router = Router()
const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
  });
router.post('/register', apiLimit, validateRegisterInput, register)
router.post('/login', apiLimit, validateLoginInput, login)
router.get('/logout', logout)

export default router