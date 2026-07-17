import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthUser } from '@portfolio/contracts';

/** Name of the httpOnly cookie carrying the signed JWT. */
export const AUTH_COOKIE = 'access_token';

interface JwtPayload {
  sub: string;
  email: string;
}

/** Reads the JWT from the httpOnly cookie (falls back to Bearer header). */
function cookieExtractor(req: Request): string | null {
  const token = (req?.cookies as Record<string, string> | undefined)?.[AUTH_COOKIE];
  return token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): AuthUser {
    if (!payload?.email) {
      throw new UnauthorizedException();
    }
    return { email: payload.email };
  }
}
