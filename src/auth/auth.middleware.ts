import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No Token Provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid Token');
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET||'secret');
        req['user']=decoded;
        next();
    } catch (err) {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
