import { CreateTagDto } from "../tag/createTagDto";

export class CreateFileDto {
    untrustedName!: string; 
    description?: string;
    tags: CreateTagDto[] = [];
}
