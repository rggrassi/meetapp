const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
app.use(routes);

module.exports = app; 