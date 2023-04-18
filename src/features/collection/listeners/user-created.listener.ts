import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/features/user/events/user-created.event';
import { InvitationService } from '../services/invitation.service';
import { CollectionService } from '../services/collection.service';
import { Invitation } from '../schema/invitation.schema';
import { User } from 'src/features/user/schema/user.schema';

@Injectable()
export class UserCreatedListener {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly invitationService: InvitationService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const collectionAdded = [];
    const { userInfo } = event;

    if (!userInfo || !userInfo.email) {
      return;
    }

    const invitation = await this.invitationService.findByEmail(userInfo.email);

    if (!invitation) {
      return;
    }

    for (const invite of invitation) {
      if (collectionAdded.includes(invite.parent_collection)) {
        continue;
      }

      await this.assignUserToCollection(invite, userInfo);
      collectionAdded.push(invite.parent_collection);
    }
  }

  private async assignUserToCollection(invite: Invitation, userInfo: User) {
    const collection = await this.collectionService.findOne(
      invite.parent_collection,
    );

    if (!collection) {
      console.error(
        'Tried to get collection that does not exist when assign user to collection',
        'collectionId: ' + invite.parent_collection,
      );

      return;
    }

    //try to add member to collection
    collection.members.push(userInfo.id);
    await this.collectionService.update(collection.id, collection);
  }
}
