export class Interval {
  constructor(public min: number, public max = min) {
  }

  static fromString(stringValue: string): Interval {
    const strings = stringValue.split(',');
    return new Interval(+strings[0], strings.length > 1 ? +strings[1] : undefined);
  }

  get average(): number {
    return (this.min + this.max) / 2;
  }

  toString(): string {
    return this.min === this.max ? `${this.min}` : `${this.min}-${this.max}`;
  }
}
