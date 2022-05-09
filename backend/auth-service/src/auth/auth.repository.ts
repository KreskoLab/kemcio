import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { TokenI } from './interfaces/token.interface';
import { DeviceInterface } from './interfaces/device.interface';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async updateOrCreate(token: TokenI): Promise<Token> {
    return this.tokenModel.findOneAndUpdate(
      { ip: token.ip, os: token.os, device: token.device, browser: token.browser },
      { $set: token },
      { upsert: true },
    );
  }

  async find(device: DeviceInterface, ip: string): Promise<Token> {
    return this.tokenModel.findOne({ ip: ip, os: device.os, device: device.device, browser: device.browser });
  }

  async remove(tokenId: string): Promise<void> {
    this.tokenModel.findByIdAndRemove(tokenId);
  }
}
