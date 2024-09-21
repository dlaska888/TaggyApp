import { GetDto } from '../getDto';
import { GetGroupUserDto } from '../groupUser/getGroupUser';

export interface GetGroupDto extends GetDto {
  name: string;
  description?: string | null;
  users: GetGroupUserDto[];
}
