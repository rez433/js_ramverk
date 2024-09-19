import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
import docRoute, { soket } from './routes/docRoute.js';
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use(cors());
app.use(express.json());
app.use('/api', docRoute);
// MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// using socket.io to update the document
soket(io);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
