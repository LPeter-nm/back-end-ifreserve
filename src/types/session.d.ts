import 'express-session';
import { Type_User } from 'src/modules/user/dto/userDto';

declare module 'express-session' {
  interface SessionData {
    userType?: Type_User; // Permite armazenar `userType` na sessão
  }
}
