import { Injectable, Inject } from '@angular/core';
import { AuthInterceptorLibConfig } from "./auth-interceptor-lib-config";

@Injectable()
export class AuthInterceptorSettingsService {
  constructor(@Inject('config') private config: AuthInterceptorLibConfig) {}

  get libConfig() {
    return this.config;
  }

  setLibConfig(newConfig: AuthInterceptorLibConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}