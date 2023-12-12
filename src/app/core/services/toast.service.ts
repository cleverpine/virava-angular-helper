import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private translationService: TranslateService,
    private messageService: MessageService
  ) {}

  showSuccess(content: string, title?: string): void {
    const titleData = title || this.translationService?.instant('success');

    this.messageService.add({
      severity: 'success',
      summary: this.translationService?.instant(titleData),
      detail: this.translationService?.instant(content),
    });
  }

  showDanger(error: any, title?: string): void {
    const titleData = title || 'error';
    let content = error;

    if (typeof content !== 'string') {
      // TODO verify that it works when BE fixes the error responses
      // Parsing the error.error property if it's a JSON object
      content = error.error?.error
        ? error.error?.error?.detail || error.error?.error
        : JSON.parse(error.error)?.error?.detail;
    }

    content = content || error.message || '';

    this.messageService.add({
      severity: 'error',
      summary: this.translationService?.instant(titleData),
      detail: this.translationService?.instant(content),
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
