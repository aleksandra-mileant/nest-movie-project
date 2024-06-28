import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from 'src/configs/server.config';
import fastifyMultipart from 'fastify-multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart);

  app.useGlobalPipes(
    new ValidationPipe({
      // ValidationPipe can also filter out properties that should not be received by the method handler.
      // In this case, we can whitelist the acceptable properties, and any property not included in the whitelist is
      // automatically stripped from the resulting object. For example, if our handler expects email
      // and password properties, but a request also includes an age property, this property can be
      // automatically removed from the resulting DTO. To enable such behavior, set whitelist to true.
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Movies API')
    .setDescription('The movies API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService<ServerConfig>);
  await app.listen(configService.get('APPLICATION_PORT'));
}
bootstrap();
