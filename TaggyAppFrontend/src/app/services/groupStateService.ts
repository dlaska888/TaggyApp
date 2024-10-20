import { BehaviorSubject } from 'rxjs';
import { GetGroupDto } from '../models/dtos/group/getGroupDto';
import { TaggyAppApiService } from './taggyAppApi.service';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorageService';
import { LocalStorageConstant } from '../constants/localStorage.constant';

@Injectable({
  providedIn: 'root',
})
export class GroupStateService {
  private group = new BehaviorSubject<GetGroupDto | null>(null);

  constructor(
    private apiService: TaggyAppApiService,
    private localStorage: LocalStorageService
  ) {}

  initGroupState() {
    const localGroup = this.localStorage.getItem(
      LocalStorageConstant.SELECTED_GROUP
    );

    if (!localGroup) {
      this.setFirstGroup();
      return;
    }

    this.apiService.getGroupById(localGroup).subscribe(
      (response) => {
        if (response.ok) this.group.next(response.body);
        else this.setFirstGroup();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getGroup$(): BehaviorSubject<GetGroupDto | null> {
    return this.group;
  }

  setGroup(group: GetGroupDto) {
    this.group.next(group);
    this.localStorage.setItem(LocalStorageConstant.SELECTED_GROUP, group.id);
  }

  removeGroup() {
    this.group.next(null);
    this.localStorage.removeItem(LocalStorageConstant.SELECTED_GROUP);
  }

  private setFirstGroup() {
    this.apiService.getGroups().subscribe(
      (response) => {
        if (response.ok && response.body!.items.length > 0)
          this.setGroup(response.body!.items[0]);
        else this.group.next(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
