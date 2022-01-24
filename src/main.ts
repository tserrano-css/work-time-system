import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Para habilitar el versionado de la API
  app.enableVersioning({
    //type: VersioningType.URI, //Tipo de versionado

    //type: VersioningType.HEADER, header: 'version',

    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });

  const config = new DocumentBuilder()
    .setTitle('Work Time System example')
    .setDescription('The work time system API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    ) //para actorizar a swagger y tener que ponner el token de autenticacion para provar la api
    .addTag('auth')
    .addTag('users')
    .addTag('projects')
    .addTag('work-time-logs')
    .addTag('total-time-logs')
    .addTag('categories')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('app_port') || 3000;
  await app.listen(port, () => {
    console.log(`App running in port ${port}`);
  });
}
bootstrap();
