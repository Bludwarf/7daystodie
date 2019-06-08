import {XmlObject} from '../common/xml.service';
import {Interval} from '../common/interval';

export class AbstractBiome extends XmlObject {
  public biome: Biome;
  private layersObject: XmlObject;

  get layers(): Layer[] {
    if (!this.layersObject) {
      if (this.xmlElement.layers === undefined) {
        return [];
      }
      this.layersObject = new XmlObject(this.xmlElement.layers[0]);
    }
    return this.layersObject.getChildren<Layer>('layer', Layer, layer => layer.biome = this);
  }

}

export class Biome extends AbstractBiome {

  get name(): string {
    return this.xmlElement.$.name;
  }

  get biomemapcolor(): string {
    return this.xmlElement.$.biomemapcolor;
  }

  get subBiomes(): SubBiome[] {
    return this.getChildren<SubBiome>('subbiome', SubBiome, subBiome => subBiome.biome = this);
  }

}

export class SubBiome extends AbstractBiome {
  get prob(): number {
    return +this.xmlElement.$.prob;
  }
}

export class Layer extends XmlObject {

  static DEPTH_FILL = '*';
  public biome: AbstractBiome;

  get blockname(): string {
    return this.xmlElement.$.blockname;
  }

  get depth(): number {
    if (this.autoDepth) {
      return undefined;
    }
    return +this.xmlElement.$.depth;
  }

  get autoDepth(): boolean {
    return this.xmlElement.$.depth === Layer.DEPTH_FILL;
  }

  get location(): LayerLocation {
    if (this.autoDepth) {
      return LayerLocation.MIDDLE;
    }
    // Go deeper and deeper until we find this layer or the one in the middle
    let middleLayerFound = false;
    this.biome.layers.find(layer => {
      if (layer === this) {
        return true;
      }
      if (layer.autoDepth) {
        middleLayerFound = true;
      }
      return false;
    });
    return middleLayerFound ? LayerLocation.BEDROCK : LayerLocation.SURFACE;
  }

  get layersBeneath(): Layer[] {
    const layers = [];
    this.biome.layers.find(layer => {
      if (layer === this) {
        return true;
      } else {
        layers.push(layer);
        return false;
      }
    });
    return layers;
  }

  get layersUnderneath(): Layer[] {
    const layers = [];
    for (let i = this.biome.layers.length - 1; i >= 0; --i) {
      const layer = this.biome.layers[i];
      if (layer === this) {
        return layers;
      } else {
        layers.push(layer);
      }
    }
    return layers;
  }

  get elevation(): Interval {
    let min;
    let max;

    if (this.location === LayerLocation.SURFACE || this.location === LayerLocation.MIDDLE) {
      max = this.layersBeneath.reduce((depth, layer) => depth - layer.depth, 0);
    }
    if (this.location === LayerLocation.MIDDLE || this.location === LayerLocation.BEDROCK) {
      min = this.layersUnderneath.reduce((depth, layer) => depth + layer.depth, 0);
    }

    if (min === undefined) {
      min = max - this.depth;
    }
    if (max === undefined) {
      max = min + this.depth;
    }

    return new Interval(min, max);
  }

  get resources(): Resource[] {
    return this.getChildren('resource', Resource, resource => resource.layer = this);
  }
}

export enum LayerLocation {
  /** just beneath the surface */
  SURFACE,

  /** between SURFACE and BEDROCK */
  MIDDLE,

  /** laying on the bedrock */
  BEDROCK
}

export class Resource extends XmlObject {

  public layer: Layer;

  get blockname(): string {
    return this.xmlElement.$.blockname;
  }

  get prob(): number {
    return +this.xmlElement.$.prob;
  }
}
