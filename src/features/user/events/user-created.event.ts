import { User } from 'src/features/user/schema/user.schema';

export class UserCreatedEvent {
  constructor(public userInfo: User) {}
}
