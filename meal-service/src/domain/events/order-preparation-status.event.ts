export class OrderPreparationStatusEvent {
  constructor(
    public readonly orderId: string,
    public readonly status: string,
    public readonly estimatedCompletionMinutes: number,
    public readonly updatedAt: Date = new Date(),
  ) {}

  static fromJSON(data: string): OrderPreparationStatusEvent {
    const parsedData = JSON.parse(data);
    return new OrderPreparationStatusEvent(
      parsedData.orderId,
      parsedData.status,
      parsedData.estimatedCompletionMinutes,
      parsedData.updatedAt ? new Date(parsedData.updatedAt) : new Date(),
    );
  }

  toJSON(): string {
    return JSON.stringify({
      orderId: this.orderId,
      status: this.status,
      estimatedCompletionMinutes: this.estimatedCompletionMinutes,
      updatedAt: this.updatedAt,
    });
  }
}