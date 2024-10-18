import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetGroupDto } from '../../models/dtos/group/getGroupDto';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { GroupSelectComponent } from '../common/group/group-select/group-select.component';
import { UserStateService } from '../../services/userStateService';
import { GroupStateService } from '../../services/groupStateService';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PathConstant } from '../../constants/path.constant';
import { GroupViewComponent } from '../common/group/group-view/group-view.component';
import { SettingsComponent } from '../common/dashboard/settings/settings.component';
import { MenuItem, MessageService } from 'primeng/api';
import { GetAccountDto } from '../../models/dtos/account/getAccountDto';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddGroupComponent } from '../common/dashboard/add-group/add-group.component';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    GroupSelectComponent,
    GroupViewComponent,
    SettingsComponent,
    MenuModule,
    InputTextModule,
    ReactiveFormsModule,
    AddGroupComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user!: GetAccountDto;
  selectedGroup!: GetGroupDto;
  nameQuery: FormControl = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(255),
  ]);
  loading: boolean = true;

  reloadGroups: boolean | null = null;
  menuBarVisible: boolean = false;
  addGroupVisible: boolean = false;
  settingsVisible: boolean = false;

  items: MenuItem[] = [];

  constructor(
    private userState: UserStateService,
    private groupState: GroupStateService
  ) {}

  ngOnInit(): void {
    this.userState.initUserState();
    this.userState
      .getUser$()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this.groupState.initGroupState();
        }
      });
    this.groupState
      .getGroup$()
      .pipe(untilDestroyed(this))
      .subscribe((group) => {
        if (group) {
          this.menuBarVisible = false;
          this.selectedGroup = group;
        }
        if (!group && this.selectedGroup) {
          this.reloadGroups = !this.reloadGroups;
        }
      });
    this.items = [
      {
        label: 'Add Group',
        icon: 'pi pi-plus',
        command: () => this.onAddGroup(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.onSettings(),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
      },
    ];
  }

  onMenuOpen(): void {
    if (this.reloadGroups === null) this.reloadGroups = true;
    this.menuBarVisible = !this.menuBarVisible;
  }

  onFormSubmitted(): void {
    this.addGroupVisible = false;
    this.reloadGroups = !this.reloadGroups;
  }

  private onAddGroup(): void {
    this.addGroupVisible = true;
  }

  private onSettings(): void {
    this.settingsVisible = true;
  }

  private onLogout(): void {
    this.userState.clearUser();
    window.location.href = PathConstant.LOGIN;
  }
}
