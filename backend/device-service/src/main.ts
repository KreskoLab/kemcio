import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: configService.get('RABITMQ_URL'),
      queue: configService.get('RABITMQ_QUEUE'),
      queueOptions: {
        durable: false,
      },
    },
  });

  app.listen();
  appContext.close();
}

bootstrap();