import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { Admin } from '../model/admin-panel.model.js'

dotenv.config()

const args = process.argv.slice(2)
if (args.length < 4) {
  console.error('Usage: node scripts/create-admin.js <firstname> <lastname> <email> <password>')
  process.exit(1)
}

const [firstname, lastname, email, password] = args
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/adminpanel'
const options = { serverSelectionTimeoutMS: 5000 }

const run = async () => {
  try {
    await mongoose.connect(uri, options)
    const existing = await Admin.findOne({ email })
    if (existing) {
      console.log(`Admin already exists with email: ${email}`)
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ firstname, lastname, email, password: hashedPassword })
    console.log('Created admin:', admin.email)
    process.exit(0)
  } catch (err) {
    console.error('Failed to create admin:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

run()
