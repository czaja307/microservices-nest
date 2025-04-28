export class CreatePaymentEvent {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly paymentMethod: string,
    public readonly totalPrice: number,
    public readonly paymentStatus: string,
  ) {}

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      orderId: this.orderId,
      paymentMethod: this.paymentMethod,
      totalPrice: this.totalPrice,
      paymentStatus: this.paymentStatus,
    });
  }
}