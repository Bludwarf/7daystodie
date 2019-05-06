import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipes/recipes.service';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '../dialog.service';
import {Item} from '../items/items.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  public item: Item;

  constructor(
    private route: ActivatedRoute,
    public dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { item: Item }) => {
      this.item = data.item;
    });
  }

}
