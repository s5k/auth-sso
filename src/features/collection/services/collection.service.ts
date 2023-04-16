import { Injectable } from '@nestjs/common';
import { CreateCollectionInput } from '../dto/create-collection.input';
import { UpdateCollectionInput } from '../dto/update-collection.input';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from '../schema/collection.schema';
import { Model } from 'mongoose';
import { BaseService } from './base.service';
import { FindCollectionInput } from '../dto/find-collection.input';

@Injectable()
export class CollectionService extends BaseService<
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
  FindCollectionInput
> {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<Collection>,
  ) {
    super(collectionModel);
  }
}
