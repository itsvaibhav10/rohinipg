//  Module Imports
const express = require('express');
const mongoose = require('mongoose');

// Config Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// App Created
const app = express();

require('./starter/config')(app);
require('./starter/parse')(app, __dirname);
require('./starter/routes')(app);

// Server Running
mongoose
  .connect(process.env.mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,    
  })
  .then((result) => {
    if (!result) {
      console.log('NotConnected!');
    }
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Connected to Port ${PORT} in ${process.env.NODE_ENV} Mode`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
