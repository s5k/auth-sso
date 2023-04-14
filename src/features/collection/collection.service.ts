import { Injectable } from '@nestjs/common';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Injectable()
export class CollectionService {
  create(createCollectionInput: CreateCollectionInput) {
    return [{
      exampleField: '123'
    }]
  }

  findAll() {
    return [{
      exampleField: '123'
    }]
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionInput: UpdateCollectionInput) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
