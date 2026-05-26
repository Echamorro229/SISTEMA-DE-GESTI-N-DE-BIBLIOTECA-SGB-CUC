import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
  const allowedOrigins = new Set(frontendUrl.split(',').map((url) => url.trim()).filter(Boolean));

  allowedOrigins.add('http://127.0.0.1:3000');
  allowedOrigins.add('http://localhost:3000');

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: Array.from(allowedOrigins),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
