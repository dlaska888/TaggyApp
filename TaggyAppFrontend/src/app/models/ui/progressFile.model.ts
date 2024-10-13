import { Subscription } from "rxjs";
import { CreateFileDto } from "../dtos/file/createFileDto";

export class ProgressFile {
    readonly browserFile : File;
    readonly createFileDto : CreateFileDto;
    progress : number;
    request? : Subscription | null;
    status? : 'uploading' | 'success' | 'failed' | 'cancelled';

    constructor(file : File) {
        this.browserFile = file;
        this.progress = 0;
        this.createFileDto = new CreateFileDto();
        this.createFileDto.untrustedName = this.browserFile.name;
    }
}