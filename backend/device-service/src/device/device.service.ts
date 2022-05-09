import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorDeviceI } from './interfaces/vendor-device.interface';
import { VendorI } from './interfaces/vendor.interface';
import { promises as fs } from 'fs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DeviceService {
  constructor(private readonly configService: ConfigService) {}

  async vendorsList(): Promise<VendorI[]> {
    const path = `${process.cwd()}/src/device/data/vendors.json`;
    const vendors: VendorI[] = await fs.readFile(path, 'utf-8').then((res) => JSON.parse(res));

    return vendors;
  }

  async vendorDevicesList(vendor: string): Promise<VendorDeviceI[]> {
    const path = `${process.cwd()}/src/device/data/devices.json`;
    const devices: VendorDeviceI[] = await fs.readFile(path, 'utf-8').then((res) => JSON.parse(res));

    const filteredDevices = devices.filter((device) => device.vendor === vendor);

    if (filteredDevices.length > 0) return filteredDevices;
    else throw new RpcException({ code: 404, msg: 'Vendor devices not found' });
  }
}
