import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { SoundRepository } from './src/util/db/sound.repository';

// Constants
const PORT = 4000;
const HOST = 'localhost';

// App
const app = express();
app.use(function (request: Request, response: Response, next: NextFunction) {
  response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.set('Access-Control-Allow-Credentials', 'true');
  next();
});

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prismaClient = new PrismaClient();
const soundRepo: SoundRepository = new SoundRepository(prismaClient);

app.get('', async (req: Request, res: Response) => {
  let response = await soundRepo.findByName(req.body.name);
  prismaClient.$disconnect();
  res.status(200).json({response});
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
