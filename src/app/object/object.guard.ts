import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalizationService} from '../localization/localization.service';
import {ObjectComponent} from './object.component';

/**
 * @author https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
@Injectable({
  providedIn: 'root'
})
export class ObjectGuard implements CanDeactivate<ObjectComponent> {

  constructor(private localization: LocalizationService) {

  }

  canDeactivate(component: ObjectComponent, currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Get the Crisis Center ID
    console.log(currentRoute.paramMap.get('name'));

    // Get the current URL
    console.log(currentState.url);

    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!component.object/* || component.crisis.name === component.editName*/) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return component.dialogService.confirm(this.localization.translate('Discard changes?'));
  }

}
