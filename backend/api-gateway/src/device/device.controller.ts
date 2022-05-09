import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Inject, MessageEvent, Param, Post, Query, Sse, UseFilters } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { AllExceptionsFilter } from 'src/rpc-exception.filter';
import { VendorDeviceI } from './interfaces/vendor-device.interface';
import { VendorI } from './interfaces/vendor.interface';
var EventSource = require('eventsource');

@Controller('devices')
export class DeviceController {
  constructor(@Inject('DEVICE_SERVICE') private deviceService: ClientProxy, private httpService: HttpService) {}

  @Get('vendors')
  async getVendors(): Promise<VendorI[]> {
    return firstValueFrom(this.deviceService.send({ cmd: 'devices-vendors-list' }, ''));
  }

  @Get('vendors/:vendor')
  @UseFilters(new AllExceptionsFilter())
  async getVendorDevices(@Param('vendor') vendor: string): Promise<VendorDeviceI[]> {
    return firstValueFrom(this.deviceService.send({ cmd: 'devices-vendor-list' }, vendor));
  }

  @Sse('firmware')
  buildFirmware(@Query() firmware: any): Observable<MessageEvent> {
    return new Observable((observer) => {
      const query = new URLSearchParams(firmware).toString();
      const eventSource = new EventSource(`http://localhost:7000/firmwares/build?${query}`);

      eventSource.onmessage = ({ data }) => {
        const message = JSON.parse(data);

        observer.next(data);

        return () => {
          if (message.ready) {
            eventSource.close();
          }
        };
      };

      eventSource.onerror = (err) => {
        observer.error(err);
        eventSource.close();
      };
    });
  }
}
