import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModuleWithProviders, NgModule, Provider, forwardRef } from '@angular/core';
import { AuthInterceptor } from "./auth.interceptor";
import { AuthInterceptorLibConfig } from "./auth-interceptor-lib-config";
import { AuthInterceptorSettingsService } from "./auth-interveptor-settings.service";

export const AUTH_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true,
};

export class ViravaAngularHelperModule {
  static forRoot(
    config: AuthInterceptorLibConfig
  ): ModuleWithProviders<ViravaAngularHelperModule> {
    return {
      ngModule: ViravaAngularHelperModule,
      providers: [
        AuthInterceptorSettingsService,
        { provide: config.customService, useValue: config.customService },
        AuthInterceptor,
        AUTH_INTERCEPTOR_PROVIDER,
      ],
    };
  }
}
