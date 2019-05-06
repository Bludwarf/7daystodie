import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Item, ItemsService} from '../items/items.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<Item> {

  constructor(private service: ItemsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> | Promise<Item> | Item {
    // TODO https://angular.io/guide/router#observable-parammap-and-component-reuse
    // TODO observable resolve https://angular.io/guide/router#resolve-pre-fetching-component-data
    const name = route.paramMap.get('name');
    const item = this.service.get(name);
    if (item) {
      return item;
    } else {
      console.error(`Item "${name}" not found !"`);
      this.router.navigate(['/Recipes']); // TODO /Items
      return undefined;
    }
  }
}
