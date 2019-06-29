import {XmlObject} from './xml-object';

export enum Operation {
  base_set = 'base_set',
  base_add = 'base_add',
  perc_add = 'perc_add',
  base_subtract = 'base_subtract'
}

export class LinkedElementNotSedError extends Error {
  constructor(m: string) {
    super(m);
  }
}

export class PassiveEffect extends XmlObject {
  constructor(xml) {
    super(xml);
  }

  get operation(): Operation {
    return Operation[this.$.operation as string];
  }

  // TODO gérer number et number[]
  get value(): string {
    if (this.operation !== Operation.base_set) {
      throw new LinkedElementNotSedError(`Cannot get value with "${Operation[this.operation]}" operation`);
    }
    return this.$.value;
  }

}

export class XmlTopObject extends XmlObject {

  private _settedCvars: string[] = undefined;

  get Groups(): string[] {
    const group = this.Group;
    return group ? group.split(',') : undefined;
  }

  get Group(): string {
    const group = this.getFirst('property', 'Group');
    return group ? group.$.value : undefined;
  }

  get BaseEffects(): XmlObject {
    return this.getFirst('effect_group', 'Base Effects');
  }

  get customIcon(): string {
    const xmlProp = this.getFirst('property', 'CustomIcon');
    return xmlProp ? xmlProp.$.value : undefined;
  }

  get customIconTint(): string {
    const xmlProp = this.getFirst('property', 'CustomIconTint');
    return xmlProp ? xmlProp.$.value : undefined;
  }

  /**
   * Example :
   * <pre>
   *     <effect_group tiered="false">
   *         <triggered_effect trigger="onSelfPrimaryActionEnd" action="ModifyCVar" cvar="drinkJarBeer" operation="set" value="1"/>
   *     </effect_group>
   * </pre>
   */
  get settedCvars(): string[] {
    if (!this._settedCvars) {
      let triggeredEffects = [];
      if (this.xmlElement.effect_group) {
        this.xmlElement.effect_group.forEach(effectGroup => {
          if (effectGroup.triggered_effect) {
            triggeredEffects = triggeredEffects.concat(effectGroup.triggered_effect
              .filter(triggeredEffect => triggeredEffect.$.action === 'ModifyCVar'
                && triggeredEffect.$.operation === 'set'
                && triggeredEffect.$.value === '1'));
          }
        });
      }
      this._settedCvars = triggeredEffects.map(triggeredEffect => triggeredEffect.$.cvar);
    }
    return this._settedCvars;
  }

  get tags(): string[] {
    const tags = this.getFirst('property', 'Tags');
    if (!tags) {
      return undefined;
    }
    return tags.$.value.split(',');
  }

  /**
   * @return DescriptionKey property value, or Name property value + 'Desc' if undefined
   */
  get descriptionKey(): string {
    const propertyValue = this.getPropertyValue('DescriptionKey');
    return propertyValue ? propertyValue : this.name + 'Desc';
  }

  get extends(): string {
    return this.getPropertyValue('Extends');
  }

  getPassiveEffect(name: string): PassiveEffect {
    const effectGroup = this.BaseEffects;
    if (!effectGroup) {
      // console.error('no effect_group for ' + this.name);
      return undefined;
    }

    return effectGroup.getFirst<PassiveEffect>('passive_effect', name, PassiveEffect);
  }

  getPassiveEffectValue(name: string): number {
    const passiveEffect = this.getPassiveEffect(name);
    if (!passiveEffect) {
      // console.error('no passive_effect for ' + this.name);
      return undefined;
    }

    return +passiveEffect.value;
  }

  getPassiveEffectFromBase(name: string, base: XmlTopObject): number {
    const entityDamage = this.getPassiveEffect(name);
    if (!entityDamage) {
      return +base.getPassiveEffect(name).$.value;
    }
    let value = +entityDamage.$.value;

    // base_set
    if (entityDamage.$.operation === Operation.base_set) {
      return value;
    }

    if (entityDamage.$.operation === Operation.perc_add
      || entityDamage.$.operation === Operation.base_add
      || entityDamage.$.operation === Operation.base_subtract) {
      if (!base) {
        throw new Error(`Cannot get "${name}" without magazineItem for Item "${this.name}"`);
      }
      const baseValue = +base.getPassiveEffect(name).$.value;
      if (entityDamage.$.operation === Operation.perc_add || entityDamage.$.operation === Operation.base_add) {
        value = baseValue + value;
      } else if (entityDamage.$.operation === Operation.base_subtract) {
        value = baseValue - value;
      }
    }

    return value;
  }
}
