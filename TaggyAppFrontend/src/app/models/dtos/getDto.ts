import { GetDtoInterface } from "./getDtoInterface";

export class GetDto implements GetDtoInterface {
  id!: string;
  createdAt!: Date;
}