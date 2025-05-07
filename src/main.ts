import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.enableCors({
    origin: 'http://localhost:3000', // ou especifique seu frontend: ['http://localhost:3000']
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // se estiver usando cookies/tokens
  });

  const config = new DocumentBuilder()

    .setTitle('API IFReserve')
    .setDescription(
      'API para sugestão de implementação no SUAP com o objetivo de reservar a quadra do Instituto Federal do Maranhão para momentos recreativos e de treinamentos visando facilitar interação entre aluno ou pessoas externas e servidores',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access_token',
    )

    .addTag('Login')
    .addTag('Usuário')
    .addTag('Aluno')
    .addTag('Servidor')
    .addTag('Usuário Externo')
    .addTag('Reserva')
    .addTag('Reserva')
    .addTag('Reserva - Ofício')
    .addTag('Reserva - Aula')
    .addTag('Reserva - Evento')
    .addTag('Relatório')
    .addTag('Recuperação de senha')
    .addTag('Notificação')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
