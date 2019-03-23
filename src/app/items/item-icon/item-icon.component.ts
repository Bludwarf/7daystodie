import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../items.service';
import {Color, Solver} from '../../lib/ColorSolver';

/**
 *
 * @param value example : "107,12,12" or "ffb0b0"
 */
const getCustomIconTintColor = (value: string): Color => {
  if (value.length === 6) {
    return new Color(... value.match(/.{2}/g).map(s => parseInt(s, 16)));
  } else {
    return new Color(... value.split(/ *, */).map(s => +s));
  }
};

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

  loadCustomIconTint(img: HTMLImageElement) {
    const base = img.previousElementSibling;
    if (base instanceof HTMLImageElement) {
      const baseImg = base as HTMLImageElement;

      Object.assign(img.style, {
        position: 'absolute',
        top: baseImg.offsetTop + 'px',
        left: baseImg.offsetLeft + 'px'
      });

      if (this.item.customIconTint) {
        const color = getCustomIconTintColor(this.item.customIconTint);
        const solver = new Solver(color);
        const result = solver.solve(); // filter: invert(26%) sepia(85%) saturate(5948%) hue-rotate(295deg) brightness(115%) contrast(129%);
        if (result && result.filter) {
          img.style.filter = result.filter.slice(8, -1);
        }
      }
    }
  }



}
