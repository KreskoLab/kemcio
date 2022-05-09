import { Controller, Sse } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DeviceService } from './device/device.service';
import { VendorDeviceI } from './device/interfaces/vendor-device.interface';
import { VendorI } from './device/interfaces/vendor.interface';

@Controller()
export class AppController {
  constructor(private readonly deviceService: DeviceService) {}

  @MessagePattern({ cmd: 'devices-vendors-list' })
  async getVendors(@Payload() data: any, @Ctx() context: RmqContext): Promise<VendorI[]> {
    return this.deviceService.vendorsList();
  }

  @MessagePattern({ cmd: 'devices-vendor-list' })
  async getVendorDevices(@Payload() vendor: string, @Ctx() context: RmqContext): Promise<VendorDeviceI[]> {
    return this.deviceService.vendorDevicesList(vendor);
  }
}
