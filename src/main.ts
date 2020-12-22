import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const docOptions = new DocumentBuilder()
    .setTitle('CBDEV API')
    .setDescription('The DBDEV API Documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.setGlobalPrefix(config.get('versionPrefix'));
  await app.listen(config.get('port'));
}
bootstrap();
