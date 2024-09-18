import { GroupRole } from '../../enums/GroupRole';
import { GetDto } from '../getDto';

export interface GetGroupUserDto extends GetDto {
  userId: string;
  name: string;
  email: string;
  role: GroupRole;
}
