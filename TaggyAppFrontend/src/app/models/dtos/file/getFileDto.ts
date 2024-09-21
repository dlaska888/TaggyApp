import { GetDto } from "../getDto";
import { GetTagDto } from "../tag/getTagDto";

export interface GetFileDto extends GetDto {
  name: string;
  description?: string;
  url: string;
  contentType: string;
  size: number;

  creatorId: string;
  groupId: string;
  tags: GetTagDto[];
}
