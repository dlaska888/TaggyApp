import { GetDto } from "./getDto";

export interface PagedResults<T extends GetDto> {
    items: T[];
    pageNum: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}
