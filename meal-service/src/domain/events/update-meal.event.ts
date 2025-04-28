export class UpdateMealEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly preparationTimeMinutes: number,
  ) {}

  static fromJSON(json: any): UpdateMealEvent {
    return new UpdateMealEvent(
      json.id,
      json.name,
      json.description,
      json.price,
      json.preparationTimeMinutes,
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      preparationTimeMinutes: this.preparationTimeMinutes,
    };
  }
}