import { GroupRole } from '../../enums/groupRole';
import { GetDto } from '../getDto';
import { GetGroupUserDto } from '../groupUser/getGroupUserDto';
import { GetTagDto } from '../tag/getTagDto';

export class GetGroupDto extends GetDto {
  name!: string;
  description?: string;
  currentUserRole!: GroupRole;
  users!: GetGroupUserDto[];
  tags!: GetTagDto[];
}
