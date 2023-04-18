import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCollectionInput } from '../dto/create-collection.input';
import { UpdateCollectionInput } from '../dto/update-collection.input';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from '../schema/collection.schema';
import { Model } from 'mongoose';
import { BaseService } from './base.service';
import { FindCollectionInput } from '../dto/find-collection.input';
import { InviteMemberInput } from '../dto/invite-member.input';
import { UserService } from 'src/features/user/service/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { environments } from 'src/environments/environments';
import { InvitationService } from './invitation.service';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';

export interface InviteToken {
  email: string;
  collectionId: string;
}

@Injectable()
export class CollectionService extends BaseService<
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput | any,
  FindCollectionInput
> {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<Collection>,
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly mailService: MailerService,
  ) {
    super(collectionModel);
  }

  async inviteMember(inviteMemberInput: InviteMemberInput) {
    const { email, collectionId } = inviteMemberInput;

    const collection = await this.collectionModel.findById(collectionId);
    const user = await this.userService.getUserByEmail(email);
    if (!collection) {
      throw new HttpException('Collection not found', 404);
    }

    if (user) {
      if (collection.members.includes(user.id)) {
        return {
          status: false,
          message: 'User already in collection',
        };
      }

      collection.members.push(user.id);
      await this.collectionModel.findByIdAndUpdate(collectionId, collection, {
        new: true,
      });

      return {
        status: true,
        message: 'User added to collection',
      };
    }

    //send invite via email
    await this.sendInviteEmail(email);
    await this.invitationService.create({
      email,
      parent_collection: collectionId,
    });

    return {
      status: true,
      message: 'Invitation sent',
    };
  }

  async removeMember(email: string, collectionId: string) {
    const collection = await this.model.findById(collectionId);

    if (!collection) {
      throw new HttpException('Collection not found', 404);
    }

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (!collection.members.includes(user.id)) {
      throw new HttpException('User not in collection', 404);
    }

    collection.members = collection.members.filter(
      member => !member.equals(user.id),
    );

    return this.model.findByIdAndUpdate(collectionId, collection, {
      new: true,
    });
  }

  async sendInviteEmail(email: string) {
    const url = environments.frontendRegisterUrl;

    try {
      await this.mailService.sendMail({
        to: email,
        subject: '[Invitation] You have been invited to join a collection',
        template: './invitation',
        context: {
          url,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `An error occurred sending email: ${e.message}`,
      );
    }
  }
}
