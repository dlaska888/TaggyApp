import { GroupRole } from '../../enums/groupRole';
import { GetDto } from '../getDto';
import { GetDtoInterface } from '../getDtoInterface';

export class GetGroupUserDto implements GetDtoInterface {
  get id(): string {
    return this.userId;
  }
  userId!: string;
  name!: string;
  email!: string;
  role!: GroupRole;
  createdAt!: Date;
}
