import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import 'reflect-metadata';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

let cachedServer: express.Express | null = null;

async function createServer() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  configureApp(app);
  await app.init();

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cachedServer ??= await createServer();

  return cachedServer(req, res);
}
