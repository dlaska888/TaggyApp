import { email, maxLength, minLength, required } from '@rxweb/reactive-form-validators';
import { GroupRole } from '../../enums/groupRole';

export class CreateGroupUserDto {
  @required()
  @minLength({ value: 3 })
  @maxLength({ value: 255 })
  userName!: string;
  role!: GroupRole;
}
