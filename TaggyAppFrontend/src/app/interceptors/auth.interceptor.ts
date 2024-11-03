import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/authService';
import { ApiTokenConstant } from '../constants/apiToken.constant';

export function authInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const reqWithToken = () => {
    const { accessToken } = authService.getTokens();
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
  }

  if (req.context.get(ApiTokenConstant.IS_PUBLIC_API)) {
    return next(req);
  }

  return from(authService.tryAuthenticateUser()).pipe(
    switchMap(() => {
      return next(reqWithToken()).pipe(
        catchError((error) => {
          if (error.status !== 401) throw error;
          return from(authService.refreshToken()).pipe(
            switchMap(() => {
              return next(reqWithToken());
            })
          );
        })
      );
    })
  );
  
}
