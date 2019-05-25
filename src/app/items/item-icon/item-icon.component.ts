import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Item, ItemsService} from '../items.service';
import {Color, Solver} from '../../lib/ColorSolver';
import {ObjectService, SevenDaysObject} from '../../object/object.service';

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

  @Input('itemName') itemName: string;
  /** CSS height */
  @Input('height') height: string;
  @ViewChild('filter') filter: ElementRef;

  /** CSS style left offset to fix positioning problems */
  @Input() customIconTintLeftOffset: string;

  constructor(private items: ItemsService, private objects: ObjectService) { }

  ngOnInit() {
  }

  get object(): SevenDaysObject {
    return this.objects.get(this.itemName);
  }

  loadCustomIconTint(img: HTMLImageElement, reload = false) {
    const base = img.previousElementSibling;
    if (base instanceof HTMLImageElement) {
      const baseImg = base as HTMLImageElement;

      Object.assign(img.style, {
        display: 'inherit',
        position: 'absolute',
        top: baseImg.offsetTop + 'px',
        left: (baseImg.offsetLeft + (this.customIconTintLeftOffset ? +this.customIconTintLeftOffset : 0)) + 'px'
      });

      if (!reload && this.object && this.object.customIconTint) {
        const color = getCustomIconTintColor(this.object.customIconTint);
        const solver = new Solver(color);
        const result = solver.solve(); // filter: invert(26%) sepia(85%) saturate(5948%) hue-rotate(295deg) brightness(115%) contrast(129%);
        if (result && result.filter) {
          img.style.filter = result.filter.slice(8, -1);
        }
      }
    }
  }

  getExistingItemIcon(): string {
    return this.items.getExistingItemIcon(this.itemName);
  }

  getItemIcon(): string {
    return this.items.getItemIcon(this.object ? this.object.customIcon : this.itemName);
  }

  reload() {
    if (this.filter) {
      this.loadCustomIconTint(this.filter.nativeElement, true);
    }
  }
}
