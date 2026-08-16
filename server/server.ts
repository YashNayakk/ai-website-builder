import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';

const app = express();

const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_URL?.split(',') || [],
    credentials: true,
}

//midleware
app.use(cors(corsOptions));

app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }));

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json({limit: '50mb'}))

app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});

app.use('/api/user' , userRouter)
app.use('/api/project', projectRouter)
app.use('/api/webhook', webhookRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});