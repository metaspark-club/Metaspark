import express from 'express'
import { signup, signin } from '../controllers/authController'

const router = express.Router()

router.post('/signup', signup as unknown as express.RequestHandler)
router.post('/signin', signin as unknown as express.RequestHandler)

export default router
