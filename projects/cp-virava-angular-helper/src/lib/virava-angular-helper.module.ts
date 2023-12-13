import { ModuleWithProviders, NgModule, Provider, forwardRef } from '@angular/core';
import { AuthInterceptorLibConfig } from "./auth-interceptor-lib-config";
import { AuthInterceptorSettingsService } from "./auth-interceptor-settings.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";

export const AUTH_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true,
};

@NgModule({})
export class ViravaAngularHelperModule {
  static forRoot(
    config: AuthInterceptorLibConfig
  ): ModuleWithProviders<ViravaAngularHelperModule> {
    return {
      ngModule: ViravaAngularHelperModule,
      providers: [
        AuthInterceptorSettingsService,
        { provide: 'config', useValue: config },
        AuthInterceptor,
        AUTH_INTERCEPTOR_PROVIDER,
      ],
    };
  }
}
