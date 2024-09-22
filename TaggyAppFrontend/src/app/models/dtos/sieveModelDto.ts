export class SieveModelDto {
    page: number;
    pageSize: number;
    filter?: string;
    sorts?: string;

    constructor(page: number = 1, pageSize: number = 10, sorts:string = "-createdAt", filter?: string) {
        this.page = page;
        this.pageSize = pageSize;
        this.filter = filter;
        this.sorts = sorts;
    }
}