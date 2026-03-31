import * as jwtUtils from '../utils/jwtUtils.js'
import UserModels from '../models/User.models.js'

export const getProfile = async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: "Access denied!!" });

  try {
    const decoded = jwtUtils.verifyToken(token)
    const user = await UserModels.findById(decoded.id).select('-password-googleId')
    if (!user) return res.status(404).json({ message: "User Not found." })

    res.json(user)
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expire token." })
  }
}