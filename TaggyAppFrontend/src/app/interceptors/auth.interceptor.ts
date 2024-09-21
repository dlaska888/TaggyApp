import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/authService';
import { ApiTokenConstant } from '../constants/apiToken.constant';

export function authInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  if (req.context.get(ApiTokenConstant.IS_PUBLIC_API)) {
    return next(req);
  }

  return from(authService.tryAuthenticateUser()).pipe(() => {
    const accessToken = authService.getTokens().accessToken;
    const reqWithToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return next(reqWithToken);
  });
}
