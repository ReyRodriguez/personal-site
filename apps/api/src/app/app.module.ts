import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { PrismaModule } from './prisma/prisma.module';
import { BlogModule } from './modules/blog/blog.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load apps/api/.env whether nx runs from the repo root (cwd-relative)
      // or the built bundle runs from dist (__dirname-relative).
      envFilePath: [
        'apps/api/.env',
        join(__dirname, '../../../apps/api/.env'),
        '.env',
      ],
    }),
    PrismaModule,
    BlogModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
