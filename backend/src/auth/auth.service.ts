import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DeviceInterface } from 'src/user/interfaces/device.interface';
import { TokensInterfaces } from 'src/user/interfaces/tokens.interfaces';
import * as deviceParser from 'ua-parser-js';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '2m',
    });
  }

  async generateRefreshToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
      jwtid: uuidv4(),
    });
  }

  async generateTokens(payload: object): Promise<TokensInterfaces> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    dtoPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(dtoPassword, password);
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  getRefreshTokenId(token: string): string {
    const decoced = this.jwtService.decode(token);
    return decoced['jti'];
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  getDeviceInfo(userAgent: string): DeviceInterface {
    const parser = deviceParser(userAgent);

    const browser = parser.browser.name
      ? `${parser.browser.name} ${parser.browser.major}`
      : 'none';
    const os = parser.os.name
      ? `${parser.os.name} ${parser.os.version}`
      : 'none';
    const device =
      !parser.device.type && parser.cpu.architecture
        ? 'pc'
        : parser.device.type || 'none';

    return { browser, os, device };
  }
}
