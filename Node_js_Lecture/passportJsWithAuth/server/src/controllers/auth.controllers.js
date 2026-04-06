import passport from "passport";
import * as JwtUtils from '../utils/jwtUtils.js'
import UserModels from "../models/User.models.js";


export const register = async (req, res) => {

  const { email, password, name } = req.body;

  try {
    let user = await UserModels.findOne({ email })
    if (user) return res.status(400).json({ message: "User Already Exists!" })

    user = new UserModels({ email, password, name })

    await user.save()

    const token = JwtUtils.signToken({ id: user._id })

    res.cookie('token', token, { httpOnly: true, secure: false }).json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json(info)
    const token = JwtUtils.signToken({ id: user._id })

    res.cookie('token', token, { httpOnly: true, secure: 'false' }).json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name, token }
    })
  })
}

export const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
}

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) return next(err)
    if (!user) return res.redirect('/login')

    const token = JwtUtils.signToken({ id: user._id })
    res.redirect(`http://localhost:3002?token=${token}`)
  })(req, res, next)
}