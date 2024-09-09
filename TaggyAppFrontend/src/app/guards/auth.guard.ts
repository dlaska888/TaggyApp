import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/authService';
import { PathConstant } from '../constants/path.constant';

export const authGuardFn: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await authService.tryAuthenticateUser();
  return isAuthenticated ? true : router.parseUrl(PathConstant.LOGIN);
};
