import { GroupRole } from '../../enums/GroupRole';
import { GetDto } from '../getDto';
import { GetDtoInterface } from '../getDtoInterface';

export class GetGroupUserDto extends GetDto {
  userId!: string;
  name!: string;
  email!: string;
  role!: GroupRole;
}
