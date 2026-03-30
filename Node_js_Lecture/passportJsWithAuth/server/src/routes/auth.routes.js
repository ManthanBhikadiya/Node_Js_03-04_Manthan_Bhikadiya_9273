import { Router } from "express";
import { register , login , googleLogin , googleCallback } from "../controllers/auth.controllers.js";

const router = Router()

router.post('/register' , register)
router.post('/login' , login)
router.post('/google' , googleLogin)
router.post('/google/callback' , googleCallback)

export default router;