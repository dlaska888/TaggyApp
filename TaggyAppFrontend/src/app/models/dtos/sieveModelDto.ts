export class SieveModelDto {
    page: number;
    pageSize: number;
    filters?: string;
    sorts?: string;

    constructor(page: number = 1, pageSize: number = 10, sorts:string = "-createdAt", filter?: string) {
        this.page = page;
        this.pageSize = pageSize;
        this.filters = filter;
        this.sorts = sorts;
    }
}