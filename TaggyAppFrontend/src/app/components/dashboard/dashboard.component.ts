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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  selectedGroup!: GetGroupDto;
  menuBarVisible: boolean = false;
  settingsVisible: boolean = false;
  loading: boolean = true;

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
      });
  }

  onSettings(): void {
    this.groupState.removeGroup();
    this.menuBarVisible = false;
  }

  onLogout(): void {
    this.userState.clearUser();
    window.location.href = PathConstant.LOGIN;
  }
}
