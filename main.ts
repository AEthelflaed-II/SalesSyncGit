import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ApplicationExceptionFilter } from './infra/exception/filters/application-exception.filter';
import { UploadExceptionFilter } from './infra/exception/filters/upload-exception.filter';
import { ValidationExceptionFactory } from './infra/exception/validation-exception-factory';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BasichAuthAuthorizer } from './app/docs/basic-auth.authorizer';
import * as basicAuth from 'express-basic-auth';
import './infra/extensions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const authorizer = app.get(BasichAuthAuthorizer);

  app.enableCors({
    origin: [
      'https://app.entouragelab.com',
      'https://entourage.cuia.dev',
      'http://localhost:5173',
      config.CHECKOUT_URL,
    ],
  });

  app.useGlobalFilters(new ApplicationExceptionFilter(), new UploadExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: ValidationExceptionFactory,
    }),
  );

  if (config.DOCS_ENABLED) {
    app.use(
      ['/docs*'],
      basicAuth({
        challenge: true,
        authorizer: authorizer.authorize.bind(authorizer),
        unauthorizedResponse: authorizer.getUnauthorizedResponse(),
        authorizeAsync: true,
        realm: 'Entourage API',
      }),
    );

    const swaggerConfigs = new DocumentBuilder()
      .setTitle('Entourage API')
      .setDescription('Entourage Phytolab API documentation')
      .setVersion(config.SERVICE_VERSION)
      .addTag('Status')
      .addTag('Autenticação')
      .addTag('Grupos de usuários')
      .addTag('Usuários')
      .addTag('Perfil do usuário')
      .addTag('Clientes')
      .addTag('Médicos')
      .addTag('Produtos')
      .addTag('Estoque')
      .addTag('Pedidos')
      .addTag('Links de Pagamento')
      .addTag('Documentos')
      .addTag('Pagamentos')
      .addTag('Especialidades médicas')
      .addServer(config.API_URL)
      .addBearerAuth({
        type: 'http',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        description: 'JWT Authorization Token',
      })
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfigs);
    SwaggerModule.setup('/docs', app, document);
  }

  await app.listen(config.API_PORT || 4521);
}
bootstrap();
