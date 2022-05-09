import { Injectable } from '@nestjs/common';
import { readFile, writeFile, rmdir } from 'fs';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { copy } from 'fs-extra';
import { resolve } from 'path';
import { FirmwareDataI } from './interfaces/firmware-data.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor() {}

  async buildFirmware(firmware: FirmwareDataI) {
    const obs$: Observable<any> = new Observable((observer) => {
      let count = 1;

      observer.next({
        progress: count,
        ready: false,
        file: false,
      });

      const tempDir = uuidv4();
      const path = resolve(`${process.cwd()}/src/firmwares`);
      const cmdArgs = resolve(`${path}/${tempDir}`);
      const config = 'tasmota/user_config_override.h';

      copy(`${path}/original`, `${path}/${tempDir}`).then(async () => {
        count = 20;

        observer.next({
          progress: count,
          ready: false,
          file: false,
        });

        readFile(`${cmdArgs}/${config}`, 'utf-8', (err, data) => {
          data = data.replace('#define STA_SSID1 ""', `#define STA_SSID1 "${firmware.ssid}"`);
          data = data.replace('#define STA_PASS1 ""', `#define STA_PASS1 "${firmware.pass}"`);
          data = data.replace('#define MODULE SONOFF_BASIC', `#define MODULE ${firmware.device}`);

          writeFile(`${cmdArgs}/${config}`, new Uint8Array(Buffer.from(data)), () => {
            const builder = spawn('pio run', ['-d', cmdArgs], { shell: true });

            builder.stdout.on('data', (data: Buffer) => {
              const msg = data.toString();

              if (msg === 'Dependency Graph') {
                count = 30;

                observer.next({
                  progress: count,
                  ready: false,
                  file: false,
                });
              }

              if (msg.includes('Compiling') && count < 80) {
                observer.next({
                  progress: (count += 0.08),
                  ready: false,
                  file: false,
                });
              }

              if (msg.includes('Linking')) {
                count = 90;

                observer.next({
                  progress: count,
                  ready: false,
                  file: false,
                });
              }
            });

            builder.on('close', async () => {
              const firmwareFile = `${path}/${tempDir}/build_output/firmware/tasmota.bin`;

              readFile(firmwareFile, (err, data) => {
                setTimeout(() => {
                  rmdir(`${path}/${tempDir}`, { recursive: true }, () => {});
                }, 120000);

                observer.next({
                  progress: 100,
                  ready: true,
                  file: data,
                });
              });
            });
          });
        });
      });
    });

    return obs$.pipe(
      map((obs$) => ({
        data: {
          progress: obs$.progress,
          ready: obs$.ready,
          file: obs$.file,
        },
      })),
    );
  }
}
