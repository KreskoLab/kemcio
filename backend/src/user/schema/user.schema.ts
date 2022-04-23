import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TokenInterface } from '../interfaces/token.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({ required: true, minlength: 1, maxlength: 64 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 64,
  })
  login: string;

  @Prop({ required: true, select: false, minlength: 6, maxlength: 120 })
  password: string;

  @Prop([Object])
  tokens: TokenInterface[];
}

export const UserSchema = SchemaFactory.createForClass(User);
