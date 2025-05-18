export class CreateOrderEvent {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly meals: string[],
    public readonly totalPrice: number,
  ) {}

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      customerName: this.customerName,
      meals: this.meals,
      totalPrice: this.totalPrice,
    });
  }

  static fromJSON(json: string): CreateOrderEvent {
    const data = JSON.parse(json);
    return new CreateOrderEvent(
      data.id,
      data.customerName,
      data.meals,
      data.totalPrice,
    );
  }
}
