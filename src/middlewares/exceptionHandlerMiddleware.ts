import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';


export const exceptionHandlerMiddleware = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof mongoose.Error.VersionError) {
      return res.status(400).json({ error: "The document was modified by another process, try again" });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

