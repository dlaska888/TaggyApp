import { TaggyAppApiService } from './taggyAppApi.service';
import { Injectable } from '@angular/core';
import { LocalStorageConstant } from '../constants/localStorage.constant';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenDto } from '../models/dtos/auth/tokenDto';
import { ApiTokenConstant } from '../constants/apiToken.constant';
import { BehaviorSubject, filter, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenRefreshingSubject = new BehaviorSubject<boolean>(false);

  constructor(private taggyAppApiService: TaggyAppApiService) {}

  async tryAuthenticateUser(): Promise<boolean> {
    // Await if token is already beain refreshed
    if (this.tokenRefreshingSubject.getValue()) {
      await firstValueFrom(
        this.tokenRefreshingSubject.asObservable().pipe(
          filter((refreshing) => refreshing === false),
          take(1)
        )
      );
      return Promise.resolve(true);
    }

    let { accessToken, refreshToken } = this.getTokens();

    // Check if tokens are present
    if (!accessToken || !refreshToken) {
      console.log('No tokens found');
      return Promise.resolve(false);
    }

    // Check token expiration
    if (!this.isTokenExpired(accessToken)) return Promise.resolve(true);

    // Refresh
    this.tokenRefreshingSubject.next(true);

    const tokens = await this.refreshToken(refreshToken);
    if (!tokens) {
      console.log('Failed to refresh token');
      return Promise.resolve(false);
    }

    this.setTokens(tokens);
    console.log('Token refreshed');

    this.tokenRefreshingSubject.next(false);

    return Promise.resolve(true);
  }

  getTokens(): TokenDto {
    return {
      accessToken:
        localStorage.getItem(LocalStorageConstant.ACCESS_TOKEN) || '',
      refreshToken:
        localStorage.getItem(LocalStorageConstant.REFRESH_TOKEN) || '',
    };
  }

  setTokens(tokens: TokenDto): void {
    localStorage.setItem(LocalStorageConstant.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(
      LocalStorageConstant.REFRESH_TOKEN,
      tokens.refreshToken
    );
  }

  refreshToken(refreshToken: string): Promise<TokenDto | null> {
    return new Promise((resolve, reject) => {
      this.taggyAppApiService.refreshToken(refreshToken).subscribe({
        next: (response) => {
          if (!response.ok || !response.body) {
            console.error(response);
            return resolve(null);
          }

          return resolve(response.body);
        },
        error: (error) => {
          console.error(error);
          return resolve(null);
        },
      });
    });
  }

  private isTokenExpired(accessToken: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const exp = decoded.exp! * 1000;
      const maxExp = Date.now() + ApiTokenConstant.REFRESH_OFFSET * 1000;
      return maxExp > exp;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
