import { randomUUID } from 'crypto';

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createAt: Date;

  public clone: () => Card;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createAt = new Date();
    this.id = randomUUID();
    // PATTERN:Prototype
    this.clone = () => {
      return new Card(name, description)
    }
  }
}

export { Card };
