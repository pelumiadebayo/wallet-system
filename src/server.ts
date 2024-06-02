import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_URI!, {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
