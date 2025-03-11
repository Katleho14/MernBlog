import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.routes.js'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error', err));

const app = express()


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



app.use("/api/user", userRoute);

// app.get('/', (req, res) => {
//     res.send("Hello from Test API!!!");
// });

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

