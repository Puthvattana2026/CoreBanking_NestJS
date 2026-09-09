import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({path: 'default.env'});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'https://core-banking-nest-js-html.vercel.app,http://localhost:5500,http://127.0.0.1:5500')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
