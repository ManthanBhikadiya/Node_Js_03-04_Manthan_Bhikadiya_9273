import express from 'express'
import User from '../models/User.models.js'

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.json(user)
    console.log('user', user);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/", async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router