import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  return new Observable<HttpEvent<unknown>>((_) => {
    authService.tryAuthenticateUser().then((_) => {
      const accessToken = authService.getTokens().accessToken;
      const reqWithToken = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
      return next(reqWithToken);
    });
  });
}
