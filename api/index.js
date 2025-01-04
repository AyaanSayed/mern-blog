const express  = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(()=>{
    console.log('Connected to database!!');
}).catch((err)=>{
    console.log('Error connecting to database!!');
})


app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!');
})


