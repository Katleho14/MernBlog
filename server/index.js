const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');
const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error', err));

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});