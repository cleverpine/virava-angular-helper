import { Inject, Injectable, Type } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable, from, throwError } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';

import { LhtLoadingService } from 'cp-lht-spinner';

import { AuthService } from "./auth.service";
import { AuthInterceptorSettingsService } from "./auth-interceptor-settings.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loadingService: LhtLoadingService,
    private authInterceptorSettingsService: AuthInterceptorSettingsService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {  
    this.loadingService.show();
    
    const token = localStorage.getItem('access_token');
    // Apply the headers
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    // Also handle errors globally
    return next.handle(req).pipe(
      tap(),
      catchError((err: any) => {
        if (err.status === 401) {
          // TODO Uncomment when update token ready
          if (!this.authService.isRefreshTokenExpired()) {
            return from(this.authService.updateToken()).pipe(
              mergeMap(() => {
                // Check if token has been updated
                const newToken = localStorage.getItem('access_token');

                if (newToken && newToken !== token) {
                  // Token refreshed successfully, retry the request with the new token
                  const authReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` },
                  });
                  return next.handle(authReq);
                }
                this.authService.checkIfTokenHasExpired();
                return EMPTY;
              }),
              catchError(() => {
                // Error occurred during token update, logout the user if the refresh token is expired, otherwise update the token
                this.authService.checkIfTokenHasExpired();
                return EMPTY;
              })
            );
          }
          // Refresh token has expired, logout the user
          this.authService.logout().subscribe(() => {});
          return EMPTY;
        }
        let errorMessage: string;

        try {
          const parsedError = JSON.parse(err.error);
          errorMessage =
            parsedError.message || "Unknown error occurred. Please try again."
        } catch (parseError) {
          if (err.status === 403) {
            errorMessage = 'Forbidden'
          } else {
            errorMessage = err.error.message || err.statusText;
          }
        }

        this.authInterceptorSettingsService.libConfig.toastService.showDanger(errorMessage);

        // Other errors status codes can be handled here in a custom way or you can throw the error like this:
        return throwError(() => errorMessage);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
