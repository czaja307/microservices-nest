// meal-service/src/domain/events/create-meal.event.ts
export class CreateMealEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly preparationTimeMinutes: number,
  ) {}

  static fromJSON(json: string): CreateMealEvent {
    const data = JSON.parse(json);
    return new CreateMealEvent(
      data.id,
      data.name,
      data.description,
      data.price,
      data.preparationTimeMinutes,
    );
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      preparationTimeMinutes: this.preparationTimeMinutes,
    });
  }
}