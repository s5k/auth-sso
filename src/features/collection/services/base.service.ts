import { Document, Model } from 'mongoose';

export abstract class BaseService<T extends Document, C, U, F> {
  constructor(protected readonly model: Model<T>) {}

  async create(createInput: C): Promise<T> {
    const collection = await this.model.create(createInput);

    return collection.save();
  }

  async findAll(findInput: F): Promise<T[]> {
    const results = await this.model.find(findInput);

    if (!results) {
      return [];
    }

    return results;
  }

  findOne(id: string) {
    return this.model.findById(id);
  }

  update(id: string, updateInput: U): Promise<T> {
    return this.model.findByIdAndUpdate(id, updateInput, { new: true });
  }

  remove(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id);
  }

  async getCollectionByModelId(
    id: string,
    collectionProperty: string,
  ): Promise<string | null> {
    const packageData = await this.findOne(id);

    if (!packageData || !packageData[collectionProperty]) {
      return null;
    }

    return packageData[collectionProperty];
  }
}
