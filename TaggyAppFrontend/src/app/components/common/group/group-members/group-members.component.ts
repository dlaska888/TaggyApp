import { Component, OnInit } from '@angular/core';
import { GroupStateService } from '../../../../services/groupStateService';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { GroupRole } from '../../../../models/enums/groupRole';
import { UserStateService } from '../../../../services/userStateService';
import { GetAccountDto } from '../../../../models/dtos/account/getAccountDto';
import { GetGroupUserDto } from '../../../../models/dtos/groupUser/getGroupUserDto';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { UpdateGroupUserDto } from '../../../../models/dtos/groupUser/updateGroupUserDto';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGroupUserDto } from '../../../../models/dtos/groupUser/createGroupUserDto';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SieveModelDto } from '../../../../models/dtos/sieveModelDto';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'group-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss',
})
export class GroupMembersComponent implements OnInit {
  selectedGroup!: GetGroupDto;
  selectedGroupUser: GetGroupUserDto | null = null;
  groupUsers!: GetGroupUserDto[];
  authUser!: GetAccountDto;

  newGroupUser!: CreateGroupUserDto;
  newGroupUserForm!: FormGroup;
  formVisible: boolean = false;

  editGroupUser!: UpdateGroupUserDto;

  isEditing = (user: GetGroupUserDto): boolean =>
    this.selectedGroupUser === user;
  hasLowerRole = (user: GetGroupUserDto): boolean =>
    user.role < this.selectedGroup.currentUserRole;
  isCurrentUser = (user: GetGroupUserDto): boolean =>
    user.userId === this.authUser.id;

  roleOptions = [
    { label: this.roleToLabel(GroupRole.Normal), value: GroupRole.Normal },
    {
      label: this.roleToLabel(GroupRole.Moderator),
      value: GroupRole.Moderator,
    },
    { label: this.roleToLabel(GroupRole.Admin), value: GroupRole.Admin },
    { label: this.roleToLabel(GroupRole.Owner), value: GroupRole.Owner },
  ];

  constructor(
    private groupState: GroupStateService,
    private userState: UserStateService,
    private api: TaggyAppApiService,
    private fb: RxFormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initNewGroupUserForm();
    this.userState.getUser$().subscribe((user) => {
      if (!user) return;
      this.authUser = user;
      this.groupState.getGroup$().subscribe((group) => {
        if (!group) return;
        this.selectedGroup = group;
        this.initRoleOptions();
        this.refreshGroupUsers();
      });
    });
  }

  onUserAddSubmit() {
    this.api
      .createGroupUser(this.selectedGroup.id, this.newGroupUser)
      .subscribe((_) => {
        this.refreshGroupUsers();
        this.initNewGroupUserForm();
        this.formVisible = false;
      });
  }

  onUserEdit(event: GetGroupUserDto) {
    this.selectedGroupUser = event;
    this.editGroupUser = UpdateGroupUserDto.fromGetGroupUserDto(event);
  }

  onRoleChange(event: DropdownChangeEvent) {
    this.editGroupUser.role = event.value;
  }

  onUserEditSubmit() {
    this.api
      .updateGroupUser(
        this.selectedGroup.id,
        this.selectedGroupUser!.userId,
        this.editGroupUser
      )
      .subscribe((_) => {
        this.refreshGroupUsers();
      });
  }

  onUserEditCancel() {
    this.selectedGroupUser = null;
    this.editGroupUser = new UpdateGroupUserDto();
  }

  onUserRemove(event: Event, groupUser: GetGroupUserDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Remove user',
      message: 'This action cannot be undone',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.api
          .deleteGroupUser(this.selectedGroup.id, groupUser.userId)
          .subscribe((_) => {
            this.refreshGroupUsers();
          });
      },
    });
  }

  roleToLabel(role: GroupRole): string {
    switch (role) {
      case GroupRole.Normal:
        return 'Member';
      case GroupRole.Moderator:
        return 'Moderator';
      case GroupRole.Admin:
        return 'Admin';
      case GroupRole.Owner:
        return 'Owner';
    }
  }

  private refreshGroupUsers() {
    const query = new SieveModelDto();
    query.pageSize = 100;
    query.page = 1;
    query.sorts = '-role';
    this.api
      .getGroupUsers(this.selectedGroup.id, query)
      .subscribe((response) => {
        this.groupUsers = response.body!.items;
      });
    this.selectedGroupUser = null;
  }

  private initRoleOptions() {
    this.roleOptions = this.roleOptions.filter(
      (role) => role.value < this.selectedGroup.currentUserRole
    );
  }

  private initNewGroupUserForm() {
    this.newGroupUser = new CreateGroupUserDto();
    this.newGroupUserForm = this.fb.formGroup(this.newGroupUser);
  }
}
