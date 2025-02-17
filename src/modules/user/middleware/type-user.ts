import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST') {
      if (!req.body || typeof req.body !== 'object') {
        return res
          .status(400)
          .json({ message: 'O corpo da requisição é inválido.' });
      }

      const { type_User } = req.body;

      if (!['ALUNO', 'SERVIDOR', 'EXTERNO'].includes(type_User)) {
        return res.status(400).json({ message: 'Tipo de usuário inválido.' });
      }

      req.session.userType = type_User;
      console.log('✅ Tipo de usuário salvo na sessão:', req.session.userType);
    }

    next();
  }
}
