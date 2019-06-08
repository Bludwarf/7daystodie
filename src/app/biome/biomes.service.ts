import {Injectable} from '@angular/core';
import xmlFile from 'src/assets/Data/Config/biomes.xml.json';
import {ObjectsCache, XmlService} from '../common/xml.service';
import {AbstractBiome, Biome, Resource} from './Biome';

@Injectable({
  providedIn: 'root'
})
export class BiomesService extends XmlService<Biome> {

  private getResourceOccurencesCache = new ObjectsCache<Resource[]>();

  constructor() {
    super(xmlFile.worldgeneration.biomes[0].biome);
  }

  newElement(xmlElement: any): Biome {
    return new Biome(xmlElement);
  }

  getResourceOccurences(resourceBlockname: string): Resource[] {
    return this.getResourceOccurencesCache.getOrPut(resourceBlockname, () => {
      const resources = [];
      this.getAll().forEach(biome => {
        // Resources from this Biome
        addResources(biome, resourceBlockname, resources);
        // Resources from Sub Biomes
        biome.subBiomes.forEach(subBiome =>
          addResources(subBiome, resourceBlockname, resources)
        );
      });
      return resources;
    });
  }
}

const addResources = (biome: AbstractBiome, resourceBlockname: string, resources: Resource[]) => {
  biome.layers.forEach(layer => {
    layer.resources.forEach(resource => {
      if (resource.blockname === resourceBlockname) {
        resources.push(resource);
      }
    });
  });
}
