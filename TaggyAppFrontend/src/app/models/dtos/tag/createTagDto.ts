import {
  maxLength,
  minLength,
  required,
  unique,
} from '@rxweb/reactive-form-validators';

export class CreateTagDto {
  @minLength({ value: 3 })
  @maxLength({ value: 50 })
  @required()
  name!: string;

  static fromGetTagDto({ name }: CreateTagDto): CreateTagDto {
    return { name } as CreateTagDto;
  }
}
