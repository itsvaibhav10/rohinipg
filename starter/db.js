const mongoose = require('mongoose');

module.exports = async (app) => {
  const result = await mongoose.connect(process.env.mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  if (!result) console.log('NotConnected!');
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Connected to Port ${PORT} in ${process.env.NODE_ENV} Mode`);
  });
};
