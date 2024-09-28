import {
  maxLength,
  minLength,
  required,
} from '@rxweb/reactive-form-validators';
import { GetGroupDto } from './getGroupDto';

export class UpdateGroupDto {
  @required()
  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  name!: string;

  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  description?: string;

  static fromGetGroupDto(file: GetGroupDto): UpdateGroupDto {
    const dto = new UpdateGroupDto();
    dto.name = file.name;
    dto.description = file.description;
    return dto;
  }
}
