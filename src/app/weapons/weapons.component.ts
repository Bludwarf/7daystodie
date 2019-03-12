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

  public displayedColumns = ['name', 'RoundsPerMinute', 'DamageFalloffRange', 'MaxRange', 'MaxUses'];
  dataSource: MatTableDataSource<Item>;
  @ViewChild(MatSort) sort: MatSort;
  tiers = Array.from({length: 6}, (v, k) => k + 1);
  selectedTier = 1;

  constructor(private items: ItemsService, private localization: LocalizationService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.items.getAll(item => {
      const groups = item.Groups;
      return groups && groups.includes(WEAPONS_GROUP);
    }));

    this.dataSource.sortingDataAccessor = (item: Item, property: string) => {
      switch (property) {
        case 'MaxUses': return item.getMaxUses(this.selectedTier);
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter) => {
      return data.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(data.name).toLowerCase().indexOf(filter) !== -1;  // With translation
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
