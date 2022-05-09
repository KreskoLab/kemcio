import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // app.enableCors({
  //   origin: configService.get('FRONTEND_URL'),
  //   methods: '*',
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

  await app.listen(7000);
}
bootstrap();
