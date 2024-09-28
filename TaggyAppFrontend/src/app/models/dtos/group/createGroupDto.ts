import { maxLength, minLength, required } from '@rxweb/reactive-form-validators';
import { CreateTagDto } from '../tag/createTagDto';

export class CreateGroupDto {
  @required()
  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  name!: string;

  @maxLength({ value: 255 })
  description?: string;

  tags: CreateTagDto[] = [];
}
