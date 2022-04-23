import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async save(user: User): Promise<User> {
    const updatedUser = new this.userModel(user);
    return updatedUser.save();
  }

  async getById(id: string): Promise<User> {
    return this.userModel.findById(id, 'password login name tokens _id');
  }

  async getByLogin(login: string): Promise<User> {
    return this.userModel.findOne(
      { login: login },
      'password login name tokens _id',
    );
  }
}
