import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SevenDaysObject} from './object.service';
import {ActivatedRoute} from '@angular/router';
import {LocalizationService} from '../localization/localization.service';
import {Item, ItemsService} from '../items/items.service';
import {PerkLevel, PerksService} from '../progression/perks.service';
import {Recipe} from '../recipes/recipes.service';
import {ItemModifier} from '../item-modifier/item-modifier';
import {ItemModifiersService} from '../item-modifier/item-modifiers.service';
import {Block, Drop} from '../block/block';
import {BlocksService} from '../block/blocks.service';
import {AbstractBiome, Biome, Resource, SubBiome} from '../biome/Biome';
import {BiomesService} from '../biome/biomes.service';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit, AfterViewInit {

  public objectCache: SevenDaysObject;
  public selectedMagazineItem: Item;
  private magazineItemsCache: Item[];
  @ViewChild('craftAreaElement') craftAreaElement: ElementRef;
  @ViewChild('craftToolElement') craftToolElement: ElementRef;
  @ViewChild('perkLevelElement') perkLevelElement: ElementRef;

  constructor(private route: ActivatedRoute, public localization: LocalizationService,
              private items: ItemsService, private perks: PerksService, private itemModifiersService: ItemModifiersService,
              private blocks: BlocksService, private biomes: BiomesService) {
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

  getAllModsInstallableOn(): ItemModifier[] {
    if (this.object.item) {
      const mods = this.itemModifiersService.getAllModsInstallableOn(this.object.item);
      if (!mods || mods.length === 0) {
        return undefined;
      }
      return mods
        .sort(this.localization.getSortFunction());
    } else {
      return undefined;
    }
  }

  getCompatibleItems(): Item[] {
    if (this.object.itemModifier) {
      const items = this.items.getCompatibleItems(this.object.itemModifier);
      if (!items || items.length === 0) {
        return undefined;
      }
      return items
        .sort(this.localization.getSortFunction());
    } else {
      return undefined;
    }
  }

  getRecipeAndSiblings(recipe: Recipe): Recipe[] {
    return [recipe].concat(recipe.siblings);
  }

  getBlocksToHarvest(object: SevenDaysObject): Block[] {
    const blocks = this.blocks.getBlocksToHarvest(object.name);
    if (!blocks || blocks.length === 0) {
      return undefined;
    }

    // Sort by count*prob
    return blocks.sort((blockA, blockB) => {
      const dropA = blockA.getDropToHarvest(object.name);
      const dropB = blockB.getDropToHarvest(object.name);
      return dropB.count.average * dropB.prob - dropA.count.average * dropA.prob;
    });
  }

  getDropToHarvest(object: SevenDaysObject, block: Block): Drop {
    return block.getDropToHarvest(object.name);
  }

  getDropToHarvestDetails(drop: Drop): string {
    let msg = `${drop.count}`;
    if (drop.prob > 0 && drop.prob < 1) {
      msg += ` (${drop.prob * 100}% chance)`;
    }
    return msg;
  }

  getResourceOccurences(resourceBlockname: string): Resource[] {
    const resourceOccurences = this.biomes.getResourceOccurences(resourceBlockname);
    if (!resourceOccurences || resourceOccurences.length === 0) {
      return undefined;
    }
    return resourceOccurences;
  }

  getBiomeName(aBiome: AbstractBiome): string {
    const biome: Biome = aBiome.biome || aBiome as Biome;
    return biome.name;
  }

  getBiomeMapColor(aBiome: AbstractBiome): string {
    const biome: Biome = aBiome.biome || aBiome as Biome;
    return biome.biomemapcolor;
  }

  getSubBiomeProb(aBiome: AbstractBiome): number {
    if (aBiome instanceof SubBiome) {
      const subBiome = aBiome as SubBiome;
      return subBiome.prob;
    }
    return undefined;
  }

  getSubBiomeIndex(aBiome: AbstractBiome): string {
    if (aBiome instanceof SubBiome) {
      const subBiome = aBiome as SubBiome;
      return `#${subBiome.index} :`;
    }
    return undefined;
  }
}

enum AlignMode {
  VERTICAL,
  HORIZONTAL,
  BOTH
}
