import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string

export const signup = async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
