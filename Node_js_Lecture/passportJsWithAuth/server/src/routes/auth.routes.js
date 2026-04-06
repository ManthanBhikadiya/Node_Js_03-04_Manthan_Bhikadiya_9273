import { Router } from "express";
import { register, login, googleLogin, googleCallback } from "../controllers/auth.controllers.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/google', googleLogin)
router.get('/google/callback', googleCallback)
router.post('/logout', (req, res) => {
    req.logout(() => { });
    res.clearCookie('token');
    res.json({ success: true });
});

export default router;