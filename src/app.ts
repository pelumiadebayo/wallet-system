import express from 'express';
import router from './routes/walletRoutes';
import dotenv from 'dotenv';
import { notFoundMiddleware } from './middleware/notFoundMiddleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', router);
app.use(notFoundMiddleware);

export default app;
