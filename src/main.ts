import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('Technopark Backend API')
    .setDescription('Документация API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.use('/images', express.static(join(__dirname, '..', 'images')));

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(5000);
}

bootstrap();
