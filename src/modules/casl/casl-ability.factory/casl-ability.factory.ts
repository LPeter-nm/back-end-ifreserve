import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Action, User } from './actionDTO/casl-actionDTO';

type Subjects = 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    switch (user?.role) {
      case 'SISTEMA_ADMIN':
        can(Action.Control, 'all');
        can(Action.Manage, 'all');
        can(Action.User, 'all');
        break;
      case 'PE_ADMIN':
        can(Action.Manage, 'all');
        can(Action.User, 'all');
        break;
      case 'USER':
        can(Action.User, 'all');
        break;
    }
    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
