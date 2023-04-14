import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionResolver } from './collection.resolver';

@Module({
  providers: [CollectionResolver, CollectionService]
})
export class CollectionModule {}
