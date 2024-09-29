import { GroupRole } from '../../enums/groupRole';
import { GetGroupUserDto } from './getGroupUserDto';

export class UpdateGroupUserDto {
  role!: GroupRole;

  static fromGetGroupUserDto(file: GetGroupUserDto): UpdateGroupUserDto {
    const dto = new UpdateGroupUserDto();
    dto.role = file.role;
    return dto;
  }
}
