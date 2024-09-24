import { GetDtoInterface } from "./getDtoInterface";

export interface PagedResults<T extends GetDtoInterface> {
    items: T[];
    pageNum: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}
