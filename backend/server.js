import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Is set' : 'Is not set');
console.log('API Key length:', process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.length : 0);
console.log('API Key first 5 characters:', process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.substring(0, 5) : 'N/A');

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import chatRouter from './routes/chatRoutes.js'  // Import chat routes

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Add this middleware before your routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/chat', chatRouter)  // Use chat routes

app.get('/', (req, res) => {
    res.send("API Working")
})

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

// Catch-all route for debugging
app.use((req, res) => {
    console.log('Received request for:', req.method, req.url)
    res.status(404).send('Not found')
})

app.listen(port, () => console.log('Server started on PORT : ' + port))