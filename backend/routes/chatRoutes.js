import express from 'express'
import { generateAIResponse } from '../controllers/chatController.js'

const router = express.Router()

router.post('/generate', generateAIResponse)

export default router