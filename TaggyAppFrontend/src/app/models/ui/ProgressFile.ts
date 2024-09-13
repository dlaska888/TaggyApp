import { Subscription } from "rxjs";

export class FileRequest {
    file : File;
    progress : number;
    request? : Subscription | null;
    status? : 'uploading' | 'success' | 'failed' | 'cancelled';

    constructor(file : File) {
        this.file = file;
        this.progress = 0;
    }
}