import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({}),
    }),
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
  ],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
