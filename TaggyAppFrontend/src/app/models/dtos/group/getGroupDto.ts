import { GetDto } from '../getDto';
import { GetGroupUserDto } from '../groupUser/getGroupUser';
import { GetTagDto } from '../tag/getTagDto';

export class GetGroupDto extends GetDto {
  name!: string;
  description?: string | null;
  users!: GetGroupUserDto[];
  tags!: GetTagDto[];
}
