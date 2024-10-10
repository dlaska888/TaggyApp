import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UIConfigConstant } from '../constants/UIConfig.constant';

export function errorMessageInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      if (response.status === 400) {
        messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: response.error.errors
            ? Object.keys(response.error.errors)
                .map(
                  (key) => `${key}: ${response.error.errors[key].join(', ')}`
                )
                .join('; ')
            : 'An error occurred while processing your request',
          life: UIConfigConstant.ERROR_MESSAGE_LIFE,
        });
      } else {
        messageService.add({
          severity: 'error',
          detail: response.error.detail
            ? response.error.detail
            : 'An error occurred while processing your request',
        });
      }
      return throwError(response);
    })
  );
}
