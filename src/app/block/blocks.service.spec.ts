import {TestBed} from '@angular/core/testing';

import {BlocksService} from './blocks.service';

describe('BlocksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlocksService = TestBed.get(BlocksService);
    expect(service).toBeTruthy();
  });

  it('should get terrOrePotassiumNitrate block', () => {
    const service: BlocksService = TestBed.get(BlocksService);
    const block = service.get('terrOrePotassiumNitrate');
    expect(block).toBeTruthy();

    const dropList = block.dropList;
    expect(dropList).toBeTruthy();
    expect(dropList.length).toEqual(4);

    const dropListAfterHarvest = block.dropListAfterHarvest;
    expect(dropListAfterHarvest).toBeTruthy();
    expect(dropListAfterHarvest.length).toEqual(2);

    const dropPNi = dropListAfterHarvest[0];
    expect(dropPNi.name).toEqual('resourcePotassiumNitratePowder');
    expect(dropPNi.count.min).toEqual(33);
    expect(dropPNi.count.max).toEqual(33);
    expect(dropPNi.prob).toEqual(1);
    expect(dropPNi.tag).toEqual('oreWoodHarvest');
  });

  it('should getBlocksToHarvest resourcePotassiumNitratePowder', () => {
    const service: BlocksService = TestBed.get(BlocksService);
    const drops = service.getDropsToGet('resourcePotassiumNitratePowder');
    expect(drops).toBeTruthy();
    expect(drops.length).toEqual(11);
  });
});
