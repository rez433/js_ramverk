import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import docRoute from './routes/docRoute'

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use('/api', docRoute)

// MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err))


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
