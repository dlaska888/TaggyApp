import { GetDto } from "../getDto";
import { GetTagDto } from "../tag/getTagDto";

export interface GetFileDto extends GetDto {
  name: string;
  description?: string;
  downloadPath: string;
  creatorId: string;
  groupId: string;
  tags: GetTagDto[];
}
