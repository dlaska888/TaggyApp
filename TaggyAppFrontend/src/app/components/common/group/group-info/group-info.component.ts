import { Component } from '@angular/core';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TagAutocompleteComponent } from '../../tag-autocomplete/tag-autocomplete.component';
import { ButtonModule } from 'primeng/button';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UpdateGroupDto } from '../../../../models/dtos/group/updateGroupDto';
import { GroupStateService } from '../../../../services/groupStateService';
import { GroupMembersComponent } from '../group-members/group-members.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'group-info',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    TagAutocompleteComponent,
    GroupMembersComponent,
  ],
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.scss',
})
export class GroupInfoComponent {
  selectedGroup!: GetGroupDto;

  groupEdit!: UpdateGroupDto;
  groupEditForm!: FormGroup;
  editing: boolean = false;
  editLoading: boolean = false;
  deleteLoading: boolean = false;

  constructor(
    private taggyApi: TaggyAppApiService,
    private groupState: GroupStateService,
    private confirmationService: ConfirmationService,
    private fb: RxFormBuilder
  ) {
    this.groupState.getGroup$().subscribe((group) => {
      if (!group) return;
      if (!this.selectedGroup) {
        this.selectedGroup = group;
        this.initGroupEditForm();
      } else {
        this.selectedGroup = group;
      }
    });
  }

  onSubmit() {
    this.editLoading = true;
    this.taggyApi
      .updateGroup(this.selectedGroup.id, this.groupEdit)
      .pipe(finalize(() => (this.editLoading = false)))
      .subscribe((response) => {
        this.groupState.setGroup(response.body!);
        this.initGroupEditForm();
        this.editing = false;
      });
  }

  onCancel() {
    this.initGroupEditForm();
    this.editing = false;
  }

  onDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Delete group',
      message: 'This action cannot be undone',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteLoading = true;
        this.taggyApi
          .deleteGroup(this.selectedGroup.id)
          .pipe(finalize(() => (this.deleteLoading = false)))
          .subscribe(() => {
            this.groupState.removeGroup();
            this.groupState.initGroupState();
          });
      },
    });
  }

  private initGroupEditForm() {
    this.groupEdit = UpdateGroupDto.fromGetGroupDto(this.selectedGroup);
    this.groupEditForm = this.fb.formGroup(this.groupEdit);
  }
}
