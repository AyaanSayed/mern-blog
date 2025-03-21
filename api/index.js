import express from 'express';
const app = express();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


app.use(express.json());
app.use(cookieParser());
app.use(cors());

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(()=>{
    console.log('Connected to database!!');
}).catch((err)=>{
    console.log('Error connecting to database!!');
})

app.use("/api/user", userRoute);

app.use("/api/auth", authRoute);

app.use("/api/post", postRoute);



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


