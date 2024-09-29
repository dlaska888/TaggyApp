import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
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
import { GroupMembersComponent } from "../group-members/group-members.component";

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
    GroupMembersComponent
],
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.scss',
})
export class GroupInfoComponent {
  selectedGroup!: GetGroupDto;

  groupEdit!: UpdateGroupDto;
  groupEditForm!: FormGroup;
  editing: boolean = false;

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
        this.initFileEditForm();
      } else {
        this.selectedGroup = group;
      }
    });
  }

  onSubmit() {
    this.taggyApi
      .updateGroup(this.selectedGroup.id, this.groupEdit)
      .subscribe((response) => {
        this.groupState.setGroup(response.body!);
        this.initFileEditForm();
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
      header: 'Delete group',
      message: 'This action cannot be undone',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.taggyApi.deleteGroup(this.selectedGroup.id).subscribe(() => {
          this.groupState.removeGroup();
          this.groupState.initGroupState();
        });
      },
    });
  }

  private initFileEditForm() {
    this.groupEdit = UpdateGroupDto.fromGetGroupDto(this.selectedGroup);
    this.groupEditForm = this.fb.formGroup(this.groupEdit);
  }
}
