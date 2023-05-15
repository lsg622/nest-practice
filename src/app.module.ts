import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddelware } from './cats/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'ormconfig/databases.config';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UsersModule, CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddelware).forRoutes('cats');
  }
}
