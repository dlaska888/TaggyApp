import { CreateTagDto } from "../tag/createTagDto";

export interface CreateFileDto {
    untrustedName: string; 
    description?: string;
    tags: CreateTagDto[] 
}
