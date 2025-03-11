const express = require('express')
const mongoose = require('mongoose');
const app = express()


mongoose.connect('mongodb+srv://katleho123:katleho123@mern-blog.o9dbk.mongodb.net/mern-blog?retryWrites=true&w=majority')
  .then(() => console.log('Connected!'));


app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});