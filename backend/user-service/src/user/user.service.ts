import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.getByLogin(loginUserDto.login);

    if (!user) {
      throw new RpcException({ code: 404, msg: 'User not found' });
    } else {
      const passwordMatch = await this.comparePassword(loginUserDto.password, user.password);

      if (passwordMatch) {
        return user;
      } else {
        throw new RpcException({ code: 401, msg: 'Inccorect login or password' });
      }
    }
  }

  async registration(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create({ ...createUserDto, password: await this.hashPassword(createUserDto.password) });
  }

  async findById(userId: string): Promise<User> {
    return this.userRepository.getById(userId);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(requestPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(requestPassword, password);
  }
}
