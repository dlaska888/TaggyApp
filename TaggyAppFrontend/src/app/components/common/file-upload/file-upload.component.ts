import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import {
  FileSelectEvent,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import {
  HttpClient,
  HttpClientModule,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FileRequest } from '../../../models/ui/ProgressFile';
import { RoundProgressComponent } from 'angular-svg-round-progressbar';
import { TaggyAppApiConstant } from '../../../constants/taggyAppApi.constant';
import { TaggyAppApiService } from '../../../services/taggyAppApi.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [
    FileUploadModule,
    ButtonModule,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    HttpClientModule,
    CommonModule,
    RoundProgressComponent,
  ],
  providers: [MessageService],
})
export class FileUploadComponent {
  files: FileRequest[] = [];
  uploadedFiles: FileRequest[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  sizeLimit: number = environment.taggyappApi.fileSizeLimit;

  constructor(
    private config: PrimeNGConfig,
    private taggyAppApiService: TaggyAppApiService,
    private messageService: MessageService
  ) {}

  uploadHandler(event: FileUploadHandlerEvent) {
    for (const file of this.files) {
      if (file.status !== 'uploading' && file.status !== 'success') {
        file.progress = 0;
        this.uploadFile(file);
      }
    }
  }

  onSelectedFiles(event: FileSelectEvent) {
    for (const file of event.files) {
      const exists = this.files.some((f) => f.file.name === file.name);
      if (!exists) {
        this.files.push(new FileRequest(file));
        this.totalSize += file.size;
      }
    }
    this.totalSizePercent = (this.totalSize / this.sizeLimit) * 100;
  }

  onRemoveFile(
    event: MouseEvent,
    file: FileRequest,
    removeFileCallback: Function,
    index: number
  ) {
    this.removeFile(file);
    if (file.status !== 'cancelled') {
      removeFileCallback(event, index);
    }
  }

  onRetry(file: FileRequest) {
    this.uploadFile(file);
  }

  onImageError(event: any) {
    event.target.src =
      'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png';
  }

  chooseEvent(event: MouseEvent, callback: Function) {
    callback();
  }

  uploadEvent(callback: Function) {
    callback();
  }

  clearEvent(clear: Function) {
    this.files.forEach((file) => {
      this.removeFile(file);
    });
    if (this.files.length === 0) {
      clear();
    }
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 1;
    const sizes = this.config.translation.fileSizeTypes;

    if (bytes === 0) {
      return `0 ${sizes![0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes![i]}`;
  }

  private uploadFile(file: FileRequest): void {
    const formData = new FormData();
    const dto = { name: file.file.name };
    formData.append('dto', JSON.stringify(dto));
    formData.append('file', file.file);

    file.status = 'uploading';
    const request = this.taggyAppApiService.uploadFile(formData).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            file.progress = Math.round((100 * event.loaded) / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          file.status = 'success';
          this.removeFile(file);
          this.uploadedFiles.push(file);
        }
      },
      (error) => {
        file.status = 'failed';
        console.error('Upload failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload failed',
          detail: error.message,
        });
      }
    );
    file.request = request;
  }

  private removeFile(file: FileRequest) {
    if (file.status === 'uploading') {
      file.request!.unsubscribe();
      file.request = null;
      file.status = 'cancelled';
      file.progress = 0;
      return;
    }
    this.files = this.files.filter((f) => f.file.name !== file.file.name);
    this.totalSize -= file.file.size || 0;
    this.totalSizePercent = (this.totalSize / this.sizeLimit) * 100;
  }
}
