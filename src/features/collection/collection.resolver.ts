import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CollectionService } from './collection.service';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Resolver('Collection')
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @Mutation('createCollection')
  create(@Args('createCollectionInput') createCollectionInput: CreateCollectionInput) {
    return this.collectionService.create(createCollectionInput);
  }

  @Query('collection')
  findAll() {
    return this.collectionService.findAll();
  }

  @Query('getSingleCollection')
  findOne(@Args('id') id: number) {
    return this.collectionService.findOne(id);
  }

  @Mutation('updateCollection')
  update(@Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput) {
    return this.collectionService.update(updateCollectionInput.id, updateCollectionInput);
  }

  @Mutation('removeCollection')
  remove(@Args('id') id: number) {
    return this.collectionService.remove(id);
  }
}
