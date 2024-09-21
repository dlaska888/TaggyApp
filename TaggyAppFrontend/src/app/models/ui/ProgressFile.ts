import { Subscription } from "rxjs";

export class ProgressFile {
    file : File;
    progress : number;
    request? : Subscription | null;
    status? : 'uploading' | 'success' | 'failed' | 'cancelled';

    constructor(file : File) {
        this.file = file;
        this.progress = 0;
    }
}