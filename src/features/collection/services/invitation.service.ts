import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from './base.service';
import { CreateInvitationInput } from '../dto/create-invitation.input';
import { UpdateInvitationInput } from '../dto/update-invitation.input';
import { FindInvitationInput } from '../dto/find-invitation.input';
import { Invitation, InvitationDocument } from '../schema/invitation.schema';

@Injectable()
export class InvitationService extends BaseService<
  Invitation,
  CreateInvitationInput,
  UpdateInvitationInput,
  FindInvitationInput
> {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
  ) {
    super(invitationModel);
  }

  async findByEmail(email: string) {
    return this.model.find({ email });
  }
}
