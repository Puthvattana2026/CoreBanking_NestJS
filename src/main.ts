import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({path: 'default.env'});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5500');

  app.enableCors(
    {
      origin: (
        requestOrigin: string | undefined, // the Origin header of the incoming request
        callback: (error: Error | null, allow?: boolean) => void // callback
      ) => {
        
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) { 
            callback(null, true);
          return;
        } // service talk to service

        callback(new Error('Origin not allowed by CORS'), false); // check cross platform
      },
    }
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); 
}
bootstrap();
