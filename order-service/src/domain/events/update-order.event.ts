export class UpdateOrderEvent {
  constructor(
    public readonly id: string,
    public readonly customerName?: string,
    public readonly meals?: string[],
    public readonly totalPrice?: number,
    public readonly paymentStatus?: string,
    public readonly orderStatus?: string,
  ) {}

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      customerName: this.customerName,
      meals: this.meals,
      totalPrice: this.totalPrice,
      paymentStatus: this.paymentStatus,
      orderStatus: this.orderStatus,
    });
  }
}