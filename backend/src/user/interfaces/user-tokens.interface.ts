import { TokensInterfaces } from './tokens.interfaces';
import { UserInterface } from './user.interface';

export interface UserAndTokensInterface {
  user: UserInterface;
  tokens?: TokensInterfaces;
}
