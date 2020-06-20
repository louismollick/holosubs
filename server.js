const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const vtubers = require('./routes/api/vtubers');
const videos = require('./routes/api/videos')

// Express setup
const app = express();
app.use(express.json());

// Load env variables
require('dotenv').config();

// Database connection
const db = process.env.MONGO_URI;
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('OK');
});
app.use('/api/vtubers', vtubers);
app.use('/api/videos', videos);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));