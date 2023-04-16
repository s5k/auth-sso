import { Document, Model } from 'mongoose';

export abstract class BaseService<T extends Document, C, U, F> {
  constructor(protected readonly model: Model<T>) {}

  async create(createInput: C): Promise<T> {
    const collection = await this.model.create(createInput);

    return collection.save();
  }

  findAll(findInput: F): Promise<T[]> {
    return this.model.find(findInput);
  }

  findOne(id: string) {
    return this.model.findById(id);
  }

  update(id: string, updateInput: U): Promise<T> {
    return this.model.findByIdAndUpdate(id, updateInput);
  }

  remove(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id);
  }
}
