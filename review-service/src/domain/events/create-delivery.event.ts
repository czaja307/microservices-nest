export class CreateDeliveryEvent {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly deliveryAddress: string,
    public readonly recipientPhone: string,
    public readonly recipientName: string,
    public readonly status: string,
    public readonly estimatedDeliveryMinutes: number,
    public readonly notes?: string,
    public readonly deliveryPersonId?: string,
  ) {}

  static fromJSON(json: string): CreateDeliveryEvent {
    const data = JSON.parse(json);
    return new CreateDeliveryEvent(
      data.id,
      data.orderId,
      data.deliveryAddress,
      data.recipientPhone,
      data.recipientName,
      data.status,
      data.estimatedDeliveryMinutes,
      data.notes,
      data.deliveryPersonId,
    );
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      orderId: this.orderId,
      deliveryAddress: this.deliveryAddress,
      recipientPhone: this.recipientPhone,
      recipientName: this.recipientName,
      status: this.status,
      estimatedDeliveryMinutes: this.estimatedDeliveryMinutes,
      notes: this.notes,
      deliveryPersonId: this.deliveryPersonId,
    });
  }
}
