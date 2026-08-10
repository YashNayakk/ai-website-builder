import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

const app = express();

const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_URL?.split(',') || [],
    credentials: true,
}

//midleware
app.use(cors(corsOptions));
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});