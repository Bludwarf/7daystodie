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

    const dropPNi = dropList[0];
    expect(dropPNi.name).toEqual('resourcePotassiumNitratePowder');
    expect(dropPNi.count.min).toEqual(33);
    expect(dropPNi.count.max).toEqual(33);
    expect(dropPNi.prob).toEqual(1);
    expect(dropPNi.tag).toEqual('oreWoodHarvest');
  });

  it('should getDropsToGet resourcePotassiumNitratePowder', () => {
    const service: BlocksService = TestBed.get(BlocksService);
    const drops = service.getDropsToGet('resourcePotassiumNitratePowder');
    expect(drops).toBeTruthy();
    expect(drops.length).toEqual(11);
  });

  it('should extend property by class', () => {
    const service: BlocksService = TestBed.get(BlocksService);

    /*
         woodFrameMaster
          RepairItems
            resourceWood: 2
          UpgradeBlock
            ToBlock: woodMaster
            Item: resourceWood
    */
    const parent = service.get('woodFrameMaster');

    /*
         woodFrameGableInvertedSteep
          UpgradeBlock
            ToBlock: woodGableInvertedSteep
    */
    const child = service.get('woodFrameGableInvertedSteep');
    expect(child.RepairItems.get('resourceWood')).toBe(parent.RepairItems.get('resourceWood'));
    expect(child.UpgradeBlock.toBlock).not.toBe(parent.UpgradeBlock.toBlock);
    expect(child.UpgradeBlock.item).toBe(parent.UpgradeBlock.item);
  });

  it('should get repair items', () => {
    const service: BlocksService = TestBed.get(BlocksService);
    const block = service.get('cntCabinetBottomFiller');
    expect(block.RepairItems.size).toBe(2);
    expect(block.RepairItems.get('resourceWood')).toBe(10);
    expect(block.RepairItems.get('resourceCobblestones')).toBe(5);
  });
});
