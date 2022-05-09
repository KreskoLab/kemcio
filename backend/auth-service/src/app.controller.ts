import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { UserAuthI } from './auth/interfaces/auth.inerface';
import { RequestUserI } from './auth/interfaces/request-user.interface';
import { TokenI } from './auth/interfaces/token.interface';
import { TokensI } from './auth/interfaces/tokens.interfaces';
import { UserAndTokensI } from './auth/interfaces/user-tokens.interface';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth-tokens' })
  async authTokens(@Payload() data: UserAuthI, @Ctx() context: RmqContext): Promise<TokensI> {
    const deviceInfo = this.authService.getDeviceInfo(data.userAgent);
    const { accessToken, refreshToken } = await this.authService.generateTokens({ id: data.userId });

    const token: TokenI = {
      tokenId: this.authService.getRefreshTokenId(refreshToken),
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ip: data.userIp,
      createdAt: new Date().toISOString(),
    };

    await this.authService.saveToken(token);

    return { accessToken, refreshToken };
  }

  @MessagePattern({ cmd: 'auth-verifyTokens' })
  async verifyTokens(@Payload() data: RequestUserI, @Ctx() context: RmqContext): Promise<UserAndTokensI> {
    const validRefreshToken = await this.authService.verifyRefreshToken(data.refreshToken);

    if (validRefreshToken) {
      const RefreshTokenId = this.authService.getRefreshTokenId(data.refreshToken);
      const device = this.authService.getDeviceInfo(data.requestUA);

      const token = await this.authService.findToken(device, data.requestIp);

      if (token.tokenId === RefreshTokenId) {
        const devicesMatch = this.authService.devicesMatch(device, data.requestIp, token, token.ip);
        if (devicesMatch) {
          const validAccessToken = await this.authService.verifyAccessToken(data.accessToken);

          if (validAccessToken) {
            const decodedAccessToken = this.authService.decodeToken(data.accessToken);
            return { userId: decodedAccessToken.id };
          } else {
            const decodedRefreshToken = this.authService.decodeToken(data.refreshToken);

            const tokens: TokensI = await this.authService.generateTokens({ id: decodedRefreshToken.id });

            const token: TokenI = {
              tokenId: this.authService.getRefreshTokenId(tokens.refreshToken),
              device: device.device,
              browser: device.browser,
              os: device.os,
              ip: data.requestIp,
              createdAt: new Date().toISOString(),
            };

            await this.authService.saveToken(token);

            return { userId: decodedRefreshToken.id, tokens };
          }
        } else {
          await this.authService.deleteToken(token._id);
          throw new RpcException({ code: 403, msg: 'Unauthorized' });
        }
      } else throw new RpcException({ code: 403, msg: 'Unauthorized' });
    } else throw new RpcException({ code: 403, msg: 'Unauthorized' });
  }
}
