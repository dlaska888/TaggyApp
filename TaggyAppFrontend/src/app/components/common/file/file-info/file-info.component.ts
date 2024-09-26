import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { GetFileDto } from '../../../../models/dtos/file/getFileDto';
import { FileSizePipe } from '../../../../pipes/file-size.pipe';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TagAutocompleteComponent } from '../../tag-autocomplete/tag-autocomplete.component';
import { ButtonModule } from 'primeng/button';
import { UpdateFileDto } from '../../../../models/dtos/file/updateFileDto';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'file-info',
  standalone: true,
  imports: [
    CommonModule,
    FileSizePipe,
    BadgeModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    TagAutocompleteComponent,
  ],
  templateUrl: './file-info.component.html',
  styleUrl: './file-info.component.scss',
})
export class FileInfoComponent implements OnChanges {
  @Input() file!: GetFileDto;
  @Output() fileChange = new EventEmitter<GetFileDto>();
  @Output() fileDelete = new EventEmitter<void>();

  group!: GetGroupDto;

  fileEdit!: UpdateFileDto;
  fileEditForm!: FormGroup;
  editing: boolean = false;

  constructor(
    private apiService: TaggyAppApiService,
    private confirmationService: ConfirmationService,
    private fb: RxFormBuilder
  ) {}

  ngOnChanges(): void {
    this.getGroup();
    this.initFileEditForm();
  }

  onSubmit() {
    this.apiService
      .updateFile(this.group.id, this.file.id, this.fileEdit)
      .subscribe((response) => {
        this.file = response.body!;
        this.fileChange.emit(this.file);
        this.editing = false;
      });
  }

  onCancel() {
    this.initFileEditForm();
    this.editing = false;
  }

  onDelete(event: Event) {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Delete File',
      message: 'This action cannot be undone',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.apiService
          .deleteFile(this.group.id, this.file.id)
          .subscribe(() => {
            this.fileDelete.emit();
          });
      },
    });
  }

  onTagsValidation(valid: boolean) {
    this.fileEditForm.controls['tags'].setErrors(
      valid ? null : { invalid: true }
    );
  }

  private getGroup() {
    this.apiService.getGroupById(this.file.groupId).subscribe((response) => {
      this.group = response.body!;
    });
  }

  private initFileEditForm() {
    this.fileEdit = UpdateFileDto.fromGetFileDto(this.file);
    this.fileEditForm = this.fb.formGroup(this.fileEdit);
  }
}
