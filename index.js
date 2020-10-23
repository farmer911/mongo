const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 4000;

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Middleware
app.use(express.json());

app.use(cors());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

//Listening to server
app.listen(port, () => console.log(`Server is running on ${port}`));