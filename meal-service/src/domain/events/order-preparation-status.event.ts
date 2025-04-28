export class OrderPreparationStatusEvent {
  constructor(
    public readonly orderId: string,
    public readonly status: string,
    public readonly estimatedCompletionMinutes: number,
  ) {}

  toJSON(): string {
    return JSON.stringify({
      orderId: this.orderId,
      status: this.status,
      estimatedCompletionMinutes: this.estimatedCompletionMinutes,
    });
  }
}