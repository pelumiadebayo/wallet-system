import mongoose from 'mongoose';
import app from './app';
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Read the CA certificate
const ca = [fs.readFileSync('global-bundle.pem')];

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: 'rglobal-bundle.pem', // Ensure this file is in your project directory
};

mongoose.connect(process.env.MONGO_URI!, {
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
