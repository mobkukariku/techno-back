import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Technopark Backend API')
    .setDescription('Документация API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
