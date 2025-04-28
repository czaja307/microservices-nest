export class CreateOrderEvent {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly meals: string[],
    public readonly totalPrice: number,
  ) {}

  static fromJSON(data: string): CreateOrderEvent {
    const parsedData = JSON.parse(data);
    return new CreateOrderEvent(
      parsedData.id,
      parsedData.customerName,
      parsedData.meals,
      parsedData.totalPrice,
    );
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      customerName: this.customerName,
      meals: this.meals,
      totalPrice: this.totalPrice,
    });
  }
}