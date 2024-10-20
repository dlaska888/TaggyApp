import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import { finalize } from 'rxjs';
import { GroupStateService } from '../../../../services/groupStateService';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    ProgressSpinnerModule
  ],
  templateUrl: './file-info.component.html',
  styleUrl: './file-info.component.scss',
})
export class FileInfoComponent implements OnInit, OnChanges {
  @Input() file!: GetFileDto;
  @Output() fileChange = new EventEmitter<GetFileDto>();
  @Output() fileDelete = new EventEmitter<void>();

  fileEdit!: UpdateFileDto;
  fileEditForm!: FormGroup;
  editing: boolean = false;
  editLoading: boolean = false;
  deleteLoading: boolean = false;

  group!: GetGroupDto;

  constructor(
    private apiService: TaggyAppApiService,
    private groupService: GroupStateService,
    private confirmationService: ConfirmationService,
    private fb: RxFormBuilder
  ) {}

  ngOnInit(): void {
    this.groupService.getGroup$().subscribe((group) => {
      if (group) this.group = group;
    });
  }

  ngOnChanges(): void {
    this.initFileEditForm();
  }

  onSubmit() {
    this.editLoading = true;
    console.log(this.editLoading);
    this.apiService
      .updateFile(this.group.id, this.file.id, this.fileEdit)
      .pipe(finalize(() => (this.editLoading = false)))
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
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Delete File',
      message: 'This action cannot be undone',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteLoading = true;
        this.apiService
          .deleteFile(this.group.id, this.file.id)
          .pipe(finalize(() => (this.deleteLoading = false)))
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

  private initFileEditForm() {
    this.fileEdit = UpdateFileDto.fromGetFileDto(this.file);
    this.fileEditForm = this.fb.formGroup(this.fileEdit);
  }
}
