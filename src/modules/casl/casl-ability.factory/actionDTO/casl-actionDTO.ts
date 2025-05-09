export class User {
  id: string;

  role: Role;
}

export enum Action {
  Control = 'control',
  Manage = 'manage',
  User = 'read',
}

export enum Role {
  SISTEMA_ADMIN = 'SISTEMA_ADMIN',
  USER = 'USER',
  PE_ADMIN = 'PE_ADMIN',
}
