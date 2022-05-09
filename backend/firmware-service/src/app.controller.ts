import { Controller, MessageEvent, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { FirmwareDataI } from './interfaces/firmware-data.interface';

@Controller('firmwares')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Sse('build')
  async buildFirmware(@Query() firmware: FirmwareDataI): Promise<Observable<MessageEvent>> {
    return await this.appService.buildFirmware(firmware);
  }
}
