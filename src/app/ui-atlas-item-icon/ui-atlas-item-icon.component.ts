import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ui-atlas-item-icon',
  templateUrl: './ui-atlas-item-icon.component.html',
  styleUrls: ['./ui-atlas-item-icon.component.scss']
})
export class UiAtlasItemIconComponent implements OnInit {

  /** example : 'ui_game_symbol_skills' for 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_skills.png' */
  @Input() name: string;

  /** CSS height and width. Example '56px' */
  @Input() height: string;
  @Input() level: number;
  @Input() alt: string;

  constructor() { }

  ngOnInit() {
  }

}
