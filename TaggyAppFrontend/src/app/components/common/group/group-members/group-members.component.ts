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
import { ScrollerLazyLoadEvent } from 'primeng/scroller';
import { PagedResults } from '../../../../models/dtos/pagedResults';

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
  isSameRole = (user: GetGroupUserDto): boolean =>
    user.role === this.editGroupUser!.role;
  hasMoreData = (): boolean =>
    this.pagedGroupUsers.items.length < this.pagedGroupUsers.totalItems;

  roleOptions = [
    { label: this.roleToLabel(GroupRole.Normal), value: GroupRole.Normal },
    {
      label: this.roleToLabel(GroupRole.Moderator),
      value: GroupRole.Moderator,
    },
    { label: this.roleToLabel(GroupRole.Admin), value: GroupRole.Admin },
    { label: this.roleToLabel(GroupRole.Owner), value: GroupRole.Owner },
  ];

  pagedGroupUsers!: PagedResults<GetGroupUserDto>;
  page: number = 1;
  rows: number = 20;
  loading: boolean = false;

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
        this.initNewGroupUserForm();
        this.initPagination();
        this.getGroupUsers();
      });
    });
  }

  onUserAddSubmit() {
    this.api
      .createGroupUser(this.selectedGroup.id, this.newGroupUser)
      .subscribe((response) => {
        if (!response.ok) return;
        this.pagedGroupUsers.items.push(response.body!);
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
      .subscribe((response) => {
        this.selectedGroupUser = null;
        this.pagedGroupUsers.items.forEach((gu) => {
          if (gu.userId === response.body!.userId)
            Object.assign(gu, response.body!);
        });
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
          .subscribe((response) => {
            if (!response.ok) return;
            this.pagedGroupUsers.items = this.pagedGroupUsers.items.filter(
              (gu) => gu.userId !== groupUser.userId
            );
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

  onMoreGroupUsers(): void {
    this.page += 1;
    this.getGroupUsers();
  }

  private getGroupUsers() {
    const query = new SieveModelDto(this.page, this.rows, '-role');
    this.loading = true;
    this.api
      .getGroupUsers(this.selectedGroup.id, query)
      .subscribe((response) => {
        if (!response.ok) return;
        const oldItems = this.pagedGroupUsers.items;
        this.pagedGroupUsers = response.body!;
        this.pagedGroupUsers.items = [
          ...oldItems,
          ...this.pagedGroupUsers.items,
        ];
        this.loading = false;
      });
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

  private initPagination(): void {
    this.page = 1;
    this.pagedGroupUsers = {
      pageNum: this.page,
      pageSize: this.rows,
      totalItems: 0,
      totalPages: 0,
      items: [],
    };
  }
}
