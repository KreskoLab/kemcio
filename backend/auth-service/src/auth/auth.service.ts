import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DeviceInterface } from 'src/auth/interfaces/device.interface';
import { TokensI } from 'src/auth/interfaces/tokens.interfaces';
import * as deviceParser from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { TokenI } from './interfaces/token.interface';
import { AuthRepository } from './auth.repository';
import { Token } from './schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async generateAccessToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_LIFETIME'),
    });
  }

  async generateRefreshToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_LIFETIME'),
      jwtid: uuidv4(),
    });
  }

  async generateTokens(payload: object): Promise<TokensI> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
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

  async saveToken(token: TokenI): Promise<void> {
    this.authRepository.updateOrCreate(token);
  }

  async findToken(device: DeviceInterface, ip: string): Promise<Token> {
    return this.authRepository.find(device, ip);
  }

  async deleteToken(tokenId: string): Promise<void> {
    this.authRepository.remove(tokenId);
  }

  getRefreshTokenId(token: string): string {
    const decoced = this.jwtService.decode(token);
    return decoced['jti'];
  }

  devicesMatch(
    requestDevice: DeviceInterface,
    requestIp: string,
    tokenDevice: DeviceInterface,
    tokenIp: string,
  ): Boolean {
    return (
      requestDevice.browser === tokenDevice.browser &&
      requestDevice.os === tokenDevice.os &&
      requestDevice.device === tokenDevice.device &&
      requestIp === tokenIp
    );
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  getDeviceInfo(userAgent: string): DeviceInterface {
    const parser = deviceParser(userAgent);

    const browser = parser.browser.name ? `${parser.browser.name} ${parser.browser.major}` : 'none';
    const os = parser.os.name ? `${parser.os.name} ${parser.os.version}` : 'none';
    const device = !parser.device.type && parser.cpu.architecture ? 'pc' : parser.device.type || 'none';

    return { browser, os, device };
  }
}
