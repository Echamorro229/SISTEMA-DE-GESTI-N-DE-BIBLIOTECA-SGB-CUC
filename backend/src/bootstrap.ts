import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
  const allowedOrigins = new Set(frontendUrl.split(',').map((url) => url.trim()).filter(Boolean));

  allowedOrigins.add('http://127.0.0.1:3000');
  allowedOrigins.add('http://localhost:3000');

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.has(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
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
