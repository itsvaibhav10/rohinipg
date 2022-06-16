//  Module Imports
require('express-async-errors');
const express = require('express');

// Config Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// App Created
const app = express();

// App Running
require('./starter/db')(app);
require('./starter/config')(app);
require('./starter/parse')(app, __dirname);
require('./starter/routes')(app);
require('./controllers/jobs')();
