require('dotenv').config();
const express = require('express');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.SERVER_PORT;

app.use('/github', githubRoutes);

app.listen(PORT, () => console.log(`listen to port ${PORT}`));
