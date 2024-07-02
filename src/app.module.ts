import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { PixelWarsModule } from './pixelwar/pixelwars.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB || 'localhost',
      port: process.env.PORT ? parseInt(process.env.PORT_DB) : 3306,
      username: process.env.USERNAME_DB || 'root',
      password: process.env.PASSWORD_DB || '',
      database: process.env.DB_NAME || 'test',
      entities: [User],
      synchronize: false, // Use only in development!
      logging: true,
    }),
    UserModule,
    PixelWarsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
