import { GroupRole } from '../../enums/GroupRole';
import { GetDto } from '../getDto';

export class GetGroupUserDto extends GetDto {
  userId!: string;
  name!: string;
  email!: string;
  role!: GroupRole;
}
