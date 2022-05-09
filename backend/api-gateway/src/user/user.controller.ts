import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { LoginDto } from 'src/user/dto/login.dto';
import { AllExceptionsFilter } from 'src/rpc-exception.filter';
import { RegistrationDto } from './dto/registration.dto';
import { UserI } from './interfaces/user.interface';
import { TokensI } from 'src/auth/interfaces/tokens.interface';
import { RealIP } from 'nestjs-real-ip';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { UserAndTokensI } from './interfaces/user-tokens.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseFilters(new AllExceptionsFilter())
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const user: UserI = await firstValueFrom(this.userService.send({ cmd: 'user-login' }, loginDto));

    const tokens: TokensI = await firstValueFrom(
      this.authService.send({ cmd: 'auth-tokens' }, { userId: user._id, userIp: ip, userAgent: userAgent }),
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_LIFETIME'),
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return tokens.accessToken;
  }

  @Post('registration')
  @UseFilters(new AllExceptionsFilter())
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const user: UserI = await firstValueFrom(this.userService.send({ cmd: 'user-registration' }, registrationDto));

    const tokens: TokensI = await firstValueFrom(
      this.authService.send({ cmd: 'auth-tokens' }, { userId: user._id, userIp: ip, userAgent: userAgent }),
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_LIFETIME'),
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return tokens.accessToken;
  }

  @Get('me')
  async getUserData(
    @Headers('user-agent') userAgent: string,
    @Headers('Authorization') authHeader: string = '',
    @RealIP() ip: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const refreshToken = request.cookies['refreshToken'];

    if (refreshToken) {
      const accessToken = authHeader.replace('Bearer', '').trim();
      const res: UserAndTokensI = await firstValueFrom(
        this.authService.send(
          { cmd: 'auth-verifyTokens' },
          { requestIp: ip, requestUA: userAgent, refreshToken: refreshToken, accessToken },
        ),
      );

      const user: UserI = await firstValueFrom(this.userService.send({ cmd: 'user-data' }, res.userId));

      if (res.tokens) {
        response.cookie('refreshToken', res.tokens.refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: this.configService.get<number>('REFRESH_TOKEN_LIFETIME'),
          domain: this.configService.get<string>('FRONTEND_DOMAIN'),
        });

        return { user, accessToken: res.tokens.accessToken };
      } else return user;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {}
}
