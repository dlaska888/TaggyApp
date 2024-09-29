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

  isEditing = (user: GetGroupUserDto): boolean =>
    this.selectedGroupUser === user;
  hasLowerRole = (user: GetGroupUserDto): boolean =>
    user.role < this.selectedGroup.currentUserRole;
  isCurrentUser = (user: GetGroupUserDto): boolean =>
    user.userId === this.authUser.id;

  roleOptions = [
    { label: 'Member', value: GroupRole.Normal },
    { label: 'Moderator', value: GroupRole.Moderator },
    { label: 'Admin', value: GroupRole.Admin },
    { label: 'Owner', value: GroupRole.Owner },
  ];

  constructor(
    private groupState: GroupStateService,
    private userState: UserStateService,
    private api: TaggyAppApiService,
    private fb: RxFormBuilder
  ) {}

  ngOnInit(): void {
    this.initNewGroupUserForm();
    this.userState.getUser$().subscribe((user) => {
      if (!user) return;
      this.authUser = user;
      this.groupState.getGroup$().subscribe((group) => {
        if (!group) return;
        this.selectedGroup = group;
        this.roleOptions = this.roleOptions.filter(
          (role) => role.value < group.currentUserRole
        );
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
  }

  onRoleChange(event: DropdownChangeEvent) {
    this.selectedGroupUser!.role = event.value;
  }

  onUserEditSubmit() {
    this.api
      .updateGroupUser(
        this.selectedGroup.id,
        this.selectedGroupUser!.userId,
        UpdateGroupUserDto.fromGetGroupUserDto(this.selectedGroupUser!)
      )
      .subscribe((_) => {
        this.refreshGroupUsers();
      });
  }

  onUserEditCancel() {
    this.selectedGroupUser = null;
  }

  onUserRemove(event: GetGroupUserDto) {
    this.api
      .deleteGroupUser(this.selectedGroup.id, event.userId)
      .subscribe((_) => {
        this.refreshGroupUsers();
      });
  }

  private refreshGroupUsers() {
    this.selectedGroupUser = null;
    this.api.getGroupUsers(this.selectedGroup.id).subscribe((response) => {
      this.groupUsers = response.body!.items;
    });
  }

  private initNewGroupUserForm() {
    this.newGroupUser = new CreateGroupUserDto();
    this.newGroupUserForm = this.fb.formGroup(this.newGroupUser);
  }
}
