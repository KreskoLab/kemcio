import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { TokenInterface } from './interfaces/token.interface';
import { TokensInterfaces } from './interfaces/tokens.interfaces';
import { LoginUserDto } from './dto/login-user.dto';
import { UserInterface } from './interfaces/user.interface';
import { UserAndTokensInterface } from './interfaces/user-tokens.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userAgent: string,
    ip: string,
  ): Promise<TokensInterfaces> {
    const password = await this.authService.hashPassword(
      createUserDto.password,
    );

    const createdUser = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      { id: createdUser._id },
    );

    const device = this.authService.getDeviceInfo(userAgent);
    const token: TokenInterface = {
      ...device,
      ip,
      id: await this.authService.getRefreshTokenId(refreshToken),
      createdAt: new Date().toISOString(),
    };

    await this.updateUserToken(createdUser._id, token);

    return { accessToken, refreshToken };
  }

  async login(
    loginUserDto: LoginUserDto,
    userAgent: string,
    ip: string,
  ): Promise<TokensInterfaces> {
    const user = await this.userRepository.getByLogin(loginUserDto.login);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      const passwordMatch = await this.authService.comparePassword(
        loginUserDto.password,
        user.password,
      );

      if (passwordMatch) {
        const { accessToken, refreshToken } =
          await this.authService.generateTokens({ id: user._id });

        const device = this.authService.getDeviceInfo(userAgent);
        const token: TokenInterface = {
          ...device,
          ip,
          id: this.authService.getRefreshTokenId(refreshToken),
          createdAt: new Date().toISOString(),
        };

        await this.updateUserToken(user._id, token);

        return { accessToken, refreshToken };
      } else {
        throw new HttpException(
          'Inccorect login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async getUserData(
    jwtHeader: string,
    userAgent: string,
    ip: string,
    refreshToken: string,
  ): Promise<UserInterface | UserAndTokensInterface> {
    const accessToken = jwtHeader.replace('Bearer', '').trim();

    const validRefreshToken = await this.authService.verifyRefreshToken(
      refreshToken,
    );

    if (validRefreshToken) {
      const validAccessToken = await this.authService.verifyAccessToken(
        accessToken,
      );

      const decodedRefreshToken = this.authService.decodeToken(refreshToken);
      const user = await this.userRepository.getById(decodedRefreshToken.id);
      const device = this.authService.getDeviceInfo(userAgent);

      const userToken = user.tokens.find(
        (token) => token.id === decodedRefreshToken.jti,
      );

      if (!userToken) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      } else {
        const deviceMatch =
          userToken.browser === device.browser &&
          userToken.device === device.device &&
          userToken.os === device.os &&
          userToken.ip === ip;

        const tokensMatch = userToken.id === decodedRefreshToken.jti;

        if (!tokensMatch) {
          await this.deleteUserToken(user._id, userToken.id);
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        if (tokensMatch && !deviceMatch) {
          await this.deleteUserToken(user._id, userToken.id);
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        if (validAccessToken && tokensMatch && deviceMatch) {
          return { id: user._id, login: user.login, name: user.name };
        }

        if (!validAccessToken && tokensMatch && deviceMatch) {
          const newAccessToken = await this.authService.generateAccessToken({
            id: user._id,
          });

          const newRefreshToken = await this.authService.generateRefreshToken({
            id: user._id,
          });

          const newUserToken: TokenInterface = {
            ...device,
            ip,
            id: this.authService.getRefreshTokenId(newRefreshToken),
            createdAt: new Date().toISOString(),
          };

          await this.updateUserToken(user._id, newUserToken);

          delete user.tokens;

          const newTokens: TokensInterfaces = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          };

          const newUser: UserInterface = {
            id: user._id,
            login: user.login,
            name: user.name,
          };

          return { user: newUser, tokens: newTokens };
        }
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async updateUserToken(userId: string, token: TokenInterface): Promise<void> {
    const user = await this.userRepository.getById(userId);

    const existedToken = user.tokens.find(
      ({ ip, device, os, browser }) =>
        ip === token.ip &&
        device === token.device &&
        os === token.os &&
        browser === token.browser,
    );

    if (existedToken) {
      existedToken.id = token.id;
      existedToken.createdAt = token.createdAt;
    } else {
      user.tokens.push(token);
    }

    await this.userRepository.save(user);
  }

  async deleteUserToken(userId: string, tokenId: string): Promise<void> {
    const user = await this.userRepository.getById(userId);
    const index = user.tokens.findIndex((token) => token.id === tokenId);

    user.tokens.splice(index, 1);
    await this.userRepository.save(user);
  }
}
