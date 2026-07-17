import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import type { AuthUser } from '@portfolio/contracts';
import { AuthService } from './auth.service';
import { AUTH_COOKIE } from './jwt.strategy';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

/** Keep in sync with JWT_EXPIRES_IN (default 12h). */
const COOKIE_MAX_AGE_MS = 12 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private cookieOptions(): CookieOptions {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    const disableSecure = this.config.get<string>('DISABLE_SECURE_COOKIE') === 'true';
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd && !disableSecure,
      path: '/',
      maxAge: COOKIE_MAX_AGE_MS,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUser> {
    const { token, user } = await this.auth.login(dto.email, dto.password);
    res.cookie(AUTH_COOKIE, token, this.cookieOptions());
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie(AUTH_COOKIE, { ...this.cookieOptions(), maxAge: undefined });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): AuthUser {
    return user;
  }
}
