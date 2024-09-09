import { GetDto } from "../getDto";

export interface GetAccountDto extends GetDto {
  userName: string;
  email: string;
  emailConfirmed: boolean;
}
