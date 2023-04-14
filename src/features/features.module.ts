import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [AuthModule, UserModule, CollectionModule],
  controllers: [],
  exports: [AuthModule, UserModule],
})
export class FeaturesModule {}
