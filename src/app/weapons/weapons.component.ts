import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Item, ItemsService} from '../services/config/items.service';
import {LocalizationService} from '../services/config/localization.service';

const WEAPONS_GROUP = 'Ammo/Weapons';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.scss']
})
export class WeaponsComponent implements OnInit {

  public displayedColumns = ['name', 'MagazineSize', 'RoundsPerMinute', 'DamageFalloffRange', 'MaxRange', 'EntityDamage', 'MaxUses'];
  dataSource: MatTableDataSource<ItemWithMagazineItem>;
  @ViewChild(MatSort) sort: MatSort;
  tiers = Array.from({length: 6}, (v, k) => k + 1);
  selectedTier = 1;

  constructor(private items: ItemsService, private localization: LocalizationService) { }

  ngOnInit() {

    // Filter Weapons with magazine
    const items = this.items.getAll(item => {
      const groups = item.Groups;
      return groups && groups.includes(WEAPONS_GROUP) && item.MagazineSize > 0;
    });

    let combos = [];
    items.forEach(item => {
      combos = combos.concat(item.MagazineItemNames
        .map(magazineItemName => new ItemWithMagazineItem(item, this.items.get(magazineItemName))));
    });
    console.log('combos', combos);

    this.dataSource = new MatTableDataSource(combos);

    this.dataSource.sortingDataAccessor = (combo: ItemWithMagazineItem, property: string) => {
      switch (property) {
        case 'name': return this.localization.translate(combo.item.name) + ' + ' + this.localization.translate(combo.magazineItem.name);
        case 'DamageFalloffRange': return combo.item.getDamageFalloffRange(combo.magazineItem);
        case 'MaxRange': return combo.item.getMaxRange(combo.magazineItem);
        case 'MaxUses': return combo.item.getMaxUses(this.selectedTier);
        case 'EntityDamage': return combo.item.getEntityDamage(combo.magazineItem);
        default: return combo.item[property];
      }
    };
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (combo: ItemWithMagazineItem, filter) => {
      return combo.item.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(combo.item.name).toLowerCase().indexOf(filter) !== -1;  // With translation
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

class ItemWithMagazineItem {
  constructor(public item: Item, public magazineItem: Item) {

  }
}
