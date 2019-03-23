import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../items.service';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss']
})
export class ItemIconComponent implements OnInit {

  @Input('item') item: Item;

  constructor() { }

  ngOnInit() {
  }

}
