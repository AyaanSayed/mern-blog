import express from 'express';
const app = express();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import awsRoutes from './routes/aws.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import multer from 'multer';
const upload = multer();


app.use(express.json());
app.use(upload.any()); // Use multer to handle multipart/form-data
app.use(cookieParser());
app.use(cors());

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(()=>{
    console.log('Connected to database!!');
}).catch((err)=>{
    console.log('Error connecting to database!!');
})

const __dirname = path.resolve();

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/post", postRoutes);

app.use("/api/comment", commentRoutes);

app.use("/api/image", awsRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
});





app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})



app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!');
})


