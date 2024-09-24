import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
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
import { TaggyAppApiService } from '../../../services/taggyAppApi.service';
import { environment } from '../../../../environments/environment.development';
import { GetGroupDto } from '../../../models/dtos/group/getGroupDto';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CreateTagDto } from '../../../models/dtos/tag/createTagDto';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileSizePipe } from '../../../pipes/file-size.pipe';
import { GroupSelectComponent } from '../group-select/group-select.component';
import { TagAutocompleteComponent } from '../tag-autocomplete/tag-autocomplete.component';
import { FileViewDialogComponent } from '../file-view-dialog/file-view-dialog.component';
import { FileViewModel } from '../../../models/ui/fileViewModel';
import { ProgressFile } from '../../../models/ui/progressFileModel';

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
    FloatLabelModule,
    AutoCompleteModule,
    HttpClientModule,
    CommonModule,
    RoundProgressComponent,
    FileSizePipe,
    GroupSelectComponent,
    TagAutocompleteComponent,
    FileViewDialogComponent,
  ],
  providers: [MessageService],
})
export class FileUploadComponent {
  files: ProgressFile[] = [];
  uploadedFiles: ProgressFile[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  sizeLimit: number = environment.taggyappApi.fileSizeLimit;

  selectedGroup!: GetGroupDto;
  selectedFile!: FileViewModel;
  dialogVisible: boolean = false;

  globalTags: CreateTagDto[] = [];

  @Output()
  onFilesUploaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
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

  onGlobalTagsChange(event: CreateTagDto[]) {
    this.globalTags = event;
  }

  onFileSelected(file: ProgressFile) {
    this.selectedFile = {
      name: file.browserFile.name,
      url: URL.createObjectURL(file.browserFile),
      contentType: file.browserFile.type,
      size: file.browserFile.size || 0,
    };
    this.dialogVisible = true;
  }

  onGroupChange(event: GetGroupDto) {
    this.getGroup(event.id);
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

  private uploadFile(file: ProgressFile): void {
    const formData = new FormData();
    file.createFileDto.untrustedName = file.browserFile.name;
    file.createFileDto.tags = file.createFileDto.tags.concat(this.globalTags);
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

  private getGroup(id: string): void {
    this.taggyAppApiService
      .getGroupById(id)
      .subscribe((response) => {
        this.selectedGroup = response.body!;
      });
  }
}
