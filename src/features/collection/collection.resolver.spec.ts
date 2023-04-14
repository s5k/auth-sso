import { Test, TestingModule } from '@nestjs/testing';
import { CollectionResolver } from './collection.resolver';
import { CollectionService } from './collection.service';

describe('CollectionResolver', () => {
  let resolver: CollectionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionResolver, CollectionService],
    }).compile();

    resolver = module.get<CollectionResolver>(CollectionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
