import { maxLength, minLength, required } from '@rxweb/reactive-form-validators';
import { CreateTagDto } from '../tag/createTagDto';

export class CreateFileDto {
  @required()
  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  untrustedName!: string;

  @maxLength({ value: 255 })
  description?: string;

  tags: CreateTagDto[] = [];
}
