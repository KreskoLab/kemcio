import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MongoExceptionFilter } from './mongo-exception.filter';
import { CreateUserDto } from './user/dto/create-user.dto';
import { LoginUserDto } from './user/dto/login-user.dto';
import { User } from './user/schema/user.schema';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user-login' })
  async login(@Payload() data: LoginUserDto, @Ctx() context: RmqContext): Promise<User> {
    return this.userService.login(data);
  }

  @UseFilters(new MongoExceptionFilter())
  @MessagePattern({ cmd: 'user-registration' })
  async registration(@Payload() data: CreateUserDto, @Ctx() context: RmqContext): Promise<User> {
    return this.userService.registration(data);
  }

  @UseFilters(new MongoExceptionFilter())
  @MessagePattern({ cmd: 'user-data' })
  async userData(@Payload() id: string, @Ctx() context: RmqContext): Promise<User> {
    return this.userService.findById(id);
  }
}
