import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
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
  HttpClientModule,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { RoundProgressComponent } from 'angular-svg-round-progressbar';
import { TaggyAppApiConstant } from '../../../constants/taggyAppApi.constant';
import { TaggyAppApiService } from '../../../services/taggyAppApi.service';
import { environment } from '../../../../environments/environment.development';
import { ProgressFile } from '../../../models/ui/progressFile';
import { PagedResults } from '../../../models/dtos/pagedResults';
import { GetGroupDto } from '../../../models/dtos/group/getGroupDto';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { GetTagDto } from '../../../models/dtos/tag/getTagDto';
import { CreateTagDto } from '../../../models/dtos/tag/createTagDto';

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
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    HttpClientModule,
    CommonModule,
    RoundProgressComponent,
  ],
  providers: [MessageService],
})
export class FileUploadComponent implements OnInit {
  files: ProgressFile[] = [];
  uploadedFiles: ProgressFile[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  sizeLimit: number = environment.taggyappApi.fileSizeLimit;

  pagedGroups!: PagedResults<GetGroupDto>;
  selectedGroup!: GetGroupDto;

  tagSuggestions: CreateTagDto[] = [];

  @Output()
  onFilesUploaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private config: PrimeNGConfig,
    private taggyAppApiService: TaggyAppApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.taggyAppApiService.getUserGroups().subscribe((response) => {
      this.pagedGroups = response.body!;
      this.selectedGroup = this.pagedGroups.items[0];
    });
  }

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
      const exists = this.files.some((f) => f.browserFile.name === file.name);
      if (!exists) {
        this.files.push(new ProgressFile(file));
        this.totalSize += file.size;
      }
    }
    this.totalSizePercent = (this.totalSize / this.sizeLimit) * 100;
  }

  onRemoveFile(
    event: MouseEvent,
    file: ProgressFile,
    removeFileCallback: Function,
    index: number
  ) {
    this.removeFile(file);
    if (file.status !== 'cancelled') {
      removeFileCallback(event, index);
    }
  }

  onRetry(file: ProgressFile) {
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

  onTagSuggestionComplete(event: AutoCompleteCompleteEvent) {
    this.tagSuggestions = this.selectedGroup.tags.filter((t) =>
      t.name.toLowerCase().startsWith(event.query.toLowerCase())
    );
  }

  onTagKeyUp(event: KeyboardEvent, file: ProgressFile) {
    console.log(event);
    if (event.key == ' ' || event.code == 'Space') {
      let tokenInput = event.srcElement as any;
      if (tokenInput.value) {
        if (!file.createFileDto.tags) {
          file.createFileDto.tags = [];
        }
        file.createFileDto.tags.push({
          name: tokenInput.value.trim(),
        });
        tokenInput.value = '';
      }
    }
  }

  private uploadFile(file: ProgressFile): void {
    const formData = new FormData();
    file.createFileDto.untrustedName = file.browserFile.name;
    formData.append('dto', JSON.stringify(file.createFileDto));
    formData.append('file', file.browserFile);

    file.status = 'uploading';
    const request = this.taggyAppApiService
      .uploadFile(this.selectedGroup.id, formData)
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              file.progress = Math.round((100 * event.loaded) / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
            file.status = 'success';
            this.removeFile(file);
            this.uploadedFiles.push(file);
            this.onFilesUploaded.emit();
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

  private removeFile(file: ProgressFile) {
    if (file.status === 'uploading') {
      file.request!.unsubscribe();
      file.request = null;
      file.status = 'cancelled';
      file.progress = 0;
      return;
    }
    this.files = this.files.filter(
      (f) => f.browserFile.name !== file.browserFile.name
    );
    this.totalSize -= file.browserFile.size || 0;
    this.totalSizePercent = (this.totalSize / this.sizeLimit) * 100;
  }
}
