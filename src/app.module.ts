import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB || 'localhost',
      port: process.env.PORT ? parseInt(process.env.PORT_DB) : 3306,
      username: process.env.USERNAME_DB || 'root',
      password: process.env.PASSWORD_DB || '',
      database: process.env.DB_NAME || 'test',
      entities: [User],
      synchronize: true, // Use only in development!
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
