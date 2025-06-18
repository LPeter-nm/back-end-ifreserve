import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { FunctionServer } from 'src/modules/user/dto/userDto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    if (
      !googleConfiguration.clientId ||
      !googleConfiguration.clientSecret ||
      !googleConfiguration.callbackURL
    ) {
      throw new Error(
        'A configuração do Google OAuth está incompleta. Faltando clientID, clientSecret ou callbackURL.',
      );
    }

    super({
      clientID: googleConfiguration.clientId,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { name, emails, _json } = profile;
      const { hd: domain } = _json;
      let typeUser;

      if (!domain) {
        typeUser = 'Externo';
      } else {
        const isStudent = domain === 'acad.ifma.edu.br';
        const isServer = domain === 'ifma.edu.br';

        if (isStudent) {
          typeUser = 'Aluno';
        } else if (isServer) {
          typeUser = 'Servidor';
        }
      }
      if (!emails || emails.length === 0) {
        throw new Error('Email não encontrado no perfil do Google');
      }

      const email = emails[0].value;
      const firstName = name?.givenName || '';

      const userData = {
        email,
        name: firstName,
        typeUser,
      };

      const sendValidateGoogleUser =
        await this.authService.validateGoogleUser(userData);

      done(null, sendValidateGoogleUser);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao criar ou fazer login do usuário com google',
        HttpStatus.BAD_REQUEST,
      );
    }
    // const user = await this.authService.validateGoogleUser({
    //   email: profile.emails[0].value,
    //   identification: '',
    //   name: profile.name.givenName,
    //   password: '',
    //   roleInInstitution: '' as FunctionServer,
    // });

    // return user;
  }
}
