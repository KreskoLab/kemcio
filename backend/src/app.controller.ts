import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { MongoExceptionFilter } from './mongo-exception.filter';
import { CreateUserDto } from './user/dto/create-user.dto';
import { LoginUserDto } from './user/dto/login-user.dto';
import { UserAndTokensInterface } from './user/interfaces/user-tokens.interface';
import { UserInterface } from './user/interfaces/user.interface';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @UseFilters(MongoExceptionFilter)
  @Post('signup')
  async signUp(
    @Body() dto: CreateUserDto,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { accessToken, refreshToken } = await this.userService.create(
      dto,
      userAgent,
      ip,
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_LIFETIME'),
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return { accessToken };
  }

  @Post('login')
  async logIn(
    @Body() dto: LoginUserDto,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    const { accessToken, refreshToken } = await this.userService.login(
      dto,
      userAgent,
      ip,
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: this.configService.get<number>('REFRESH_TOKEN_LIFETIME'),
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return { accessToken };
  }

  @Get('me')
  getUser(
    @Headers('Authorization') jwtHeader: string,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Req() request: Request,
  ): Promise<UserInterface | UserAndTokensInterface> {
    const refreshToken = request.cookies['refreshToken'];

    if (jwtHeader && userAgent && refreshToken) {
      return this.userService.getUserData(
        jwtHeader,
        userAgent,
        ip,
        refreshToken,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
