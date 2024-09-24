import { GetDto } from "../getDto";
import { GetDtoInterface } from "../getDtoInterface";

export class GetAccountDto extends GetDto {
  userName!: string;
  email!: string;
  emailConfirmed!: boolean;
}
