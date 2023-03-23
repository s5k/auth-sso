import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { ExceptionsFilter } from './core/filter/exceptions.filter';
import { environments } from './environments/environments';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    FeaturesModule,
    CoreModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environments.mongoUri, {
      autoIndex: false,
      useFindAndModify: false,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
