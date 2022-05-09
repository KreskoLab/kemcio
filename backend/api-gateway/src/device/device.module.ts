import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DeviceController } from './device.controller';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'DEVICE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABITMQ_URL')],
            queue: configService.get('DEVICE_QUEUE'),
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [DeviceController],
})
export class DeviceModule {}
