import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppConfigService } from "./services/app-config.service";
import { ViravaAngularHelperModule } from "projects/virava-angular-helper/src/public-api";
import { ToastService } from "./services/toast.service";

export function isProd(appConfig: AppConfigService) {
  return appConfig.isProd();
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export function initializeApp(
  appConfigService: AppConfigService,
  translate: TranslateService
) {  
  translate.setDefaultLang('en');
  translate.use('en');
  return () =>
    appConfigService.loadConfig();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ViravaAngularHelperModule.forRoot({
      toastService: ToastService
    }),
  ],
  exports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [
        AppConfigService,
        TranslateService,
      ],
      multi: true,
    },
  ],
})
export class CoreModule {}
