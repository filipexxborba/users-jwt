import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from 'app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/NestUsersCrud'),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {}
