const bodyparser = require('body-parser');

require('dotenv').config();

const express = require('express');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(bodyparser.json());

app.use('/github', githubRoutes);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`listen to port ${PORT}`));
