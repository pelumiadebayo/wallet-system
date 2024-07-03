import mongoose from 'mongoose';
import app from './index';

const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/walletdb'
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

mongoose.connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
