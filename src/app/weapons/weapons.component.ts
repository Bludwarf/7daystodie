import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Item, ItemsService} from '../services/config/items.service';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.scss']
})
export class WeaponsComponent implements OnInit {

  public displayedColumns = ['name', 'DamageFalloffRange'];
  dataSource: MatTableDataSource<Item>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private items: ItemsService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.items.getAll());
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.name.toLowerCase().indexOf(filter) !== -1;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
