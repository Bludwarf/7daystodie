import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SevenDaysObject} from './object.service';
import {DialogService} from '../dialog.service';
import {ActivatedRoute} from '@angular/router';
import {LocalizationService} from '../localization/localization.service';
import {Item, ItemsService} from '../items/items.service';
import {PerkLevel, PerksService} from '../progression/perks.service';
import {Recipe} from '../recipes/recipes.service';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit, AfterViewInit  {

  public objectCache: SevenDaysObject;
  public selectedMagazineItem: Item;
  private magazineItemsCache: Item[];
  @ViewChild('craftAreaElement') craftAreaElement: ElementRef;
  @ViewChild('craftToolElement') craftToolElement: ElementRef;
  @ViewChild('perkLevelElement') perkLevelElement: ElementRef;

  constructor(private route: ActivatedRoute, public dialogService: DialogService, public localization: LocalizationService,
              private items: ItemsService, private perks: PerksService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { object: SevenDaysObject }) => {
      this.object = data.object;
    });
  }

  get object(): SevenDaysObject {
    return this.objectCache;
  }

  set object(object: SevenDaysObject) {
    this.objectCache = object;
    const magazineItems = this.magazineItems(this.objectCache);
    this.selectedMagazineItem = magazineItems.length ? magazineItems[0] : undefined;
  }

  magazineItems(object: SevenDaysObject): Item[] {
    if (!this.magazineItemsCache) {
      if (!object || !object.item || !object.item.MagazineItemNames) {
        return [];
      }
      this.magazineItemsCache = object.item.MagazineItemNames.map(name => this.items.get(name));
    }
    return this.magazineItemsCache;
  }

  getRequiredPerkLevelForRecipe(recipe: Recipe): PerkLevel | undefined {
    const perkLevel = this.perks.getRequiredPerkLevelForRecipe(recipe.name);
    if (!perkLevel) {
      console.error(`Cannot find required PerkLevel for recipe "${recipe.name}"`);
      return undefined;
    }
    return perkLevel;
  }

  perkLevelToString(perkLevel: PerkLevel) {
    return this.perks.perkLevelToString(perkLevel, this.localization);
  }

  ngAfterViewInit(): void {
    this.align(this.craftToolElement, this.craftAreaElement, AlignMode.VERTICAL);
    this.align(this.perkLevelElement, this.craftAreaElement, AlignMode.VERTICAL);
  }

  /**
   * @param element
   * @param baseElement
   */
  align(element: ElementRef, baseElement: ElementRef, alignMode: AlignMode = AlignMode.BOTH) {
    if (element && baseElement) {
      const style = element.nativeElement.style;
      style.position = 'relative';
      if (alignMode === AlignMode.VERTICAL || alignMode === AlignMode.BOTH) {
        style.top = `${baseElement.nativeElement.offsetTop - element.nativeElement.offsetTop}px`;
      }
      if (alignMode === AlignMode.HORIZONTAL || alignMode === AlignMode.BOTH) {
        style.left = `${baseElement.nativeElement.offsetLeft - element.nativeElement.offsetLeft}px`;
      }
    }
  }
}

enum AlignMode {
  VERTICAL,
  HORIZONTAL,
  BOTH
}
