const mongoose = require('mongoose');

module.exports = (app) => {
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
        console.log(
          `Connected to Port ${PORT} in ${process.env.NODE_ENV} Mode`
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
