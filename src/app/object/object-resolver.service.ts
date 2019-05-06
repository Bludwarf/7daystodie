import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ObjectService, SevenDaysObject} from './object.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectResolverService implements Resolve<SevenDaysObject> {

  constructor(private service: ObjectService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SevenDaysObject> | Promise<SevenDaysObject> | SevenDaysObject {
    // TODO https://angular.io/guide/router#observable-parammap-and-component-reuse
    // TODO observable resolve https://angular.io/guide/router#resolve-pre-fetching-component-data
    const name = route.paramMap.get('name');
    const object = this.service.get(name);
    if (object) {
      return object;
    } else {
      console.error(`Object "${name}" not found !"`);
      this.router.navigate(['/']);
      return undefined;
    }
  }
}
