import {
  maxLength,
  minLength,
  required,
  unique,
} from '@rxweb/reactive-form-validators';
import { GetTagDto } from './getTagDto';

export class CreateTagDto {
  @minLength({ value: 3 })
  @maxLength({ value: 50 })
  @required()
  name!: string;
}
