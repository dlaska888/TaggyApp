import { GetTagDto } from '../dtos/tag/getTagDto';

export interface FileViewModel {
  name: string;
  url: string;
  contentType: string;
  size: number;

  id?: number;
  createdAt?: Date;
  tags?: GetTagDto[];
  creatorId?: number;
  groupId?: number;
}
