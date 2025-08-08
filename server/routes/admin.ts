// server/routes/admin.ts
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!
const JWT_SECRET = process.env.JWT_SECRET!

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' })
  return res.json({ token })
})

export default router
