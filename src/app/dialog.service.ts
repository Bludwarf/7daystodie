import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LocalizationService} from './localization/localization.service';

/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 * @author https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private localization: LocalizationService) {
  }

  /**
   * Ask user to confirm an action. `message` explains the action and choices.
   * Returns observable resolving to `true`=confirm or `false`=cancel
   */
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || this.localization.translate('ok?'));

    return of(confirmation);
  }
}
