import { BehaviorSubject } from 'rxjs';
import { TaggyAppApiService } from './taggyAppApi.service';
import { GetAccountDto } from '../models/dtos/account/getAccountDto';
import { Injectable } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private user$ = new BehaviorSubject<GetAccountDto | null>(null);

  constructor(private apiService: TaggyAppApiService) {}

  initUserState() {
    this.apiService.getAccount().subscribe(
      (response) => {
        if (response.ok) this.user$.next(response.body!);
        else this.user$.next(null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUser$(): BehaviorSubject<GetAccountDto | null> {
    return this.user$;
  }

  setUser(group: GetAccountDto) {
    this.user$.next(group);
  }

  clearUser() {
    localStorage.clear();
    this.user$.next(null);
  }
}
