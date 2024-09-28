import { CreateTagDto } from '../tag/createTagDto';
import {
  maxLength,
  minLength,
  propArray,
  required,
} from '@rxweb/reactive-form-validators';
import { GetFileDto } from './getFileDto';

export class UpdateFileDto {
  @required()
  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  name!: string;

  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  description?: string;

  @propArray(CreateTagDto)
  tags: CreateTagDto[] = [];

  static fromGetFileDto(file: GetFileDto): UpdateFileDto {
    const dto = new UpdateFileDto();
    dto.name = file.name;
    dto.description = file.description;
    dto.tags = file.tags.map((tag) => CreateTagDto.fromGetTagDto(tag));
    return dto;
  }
}
