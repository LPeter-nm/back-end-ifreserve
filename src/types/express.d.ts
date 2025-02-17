import { Role } from 'src/modules/user/dto/userDto';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: Role;
    };
  }
}
