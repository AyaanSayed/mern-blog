import express from 'express';
const app = express();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';

app.use(express.json());

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(()=>{
    console.log('Connected to database!!');
}).catch((err)=>{
    console.log('Error connecting to database!!');
})

app.use("/api/user", userRoute);

app.use("/api/user", authRoute);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!');
})


