import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:4300').split(',');
  app.enableCors({
    origin: corsOrigin.map((o) => o.trim()),
    credentials: true,
  });

  const port = process.env.APP_PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Rally-connect API listening on port ${port}`);
}

bootstrap();
