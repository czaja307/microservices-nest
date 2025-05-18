export class CreateReviewEvent {
  constructor(
    public readonly id: string,
    public readonly deliveryId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly customerName: string,
    public readonly customerEmail?: string,
  ) {}

  static fromJSON(json: string): CreateReviewEvent {
    const data = JSON.parse(json);
    return new CreateReviewEvent(
      data.id,
      data.deliveryId,
      data.rating,
      data.comment,
      data.customerName,
      data.customerEmail,
    );
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      deliveryId: this.deliveryId,
      rating: this.rating,
      comment: this.comment,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
    });
  }
}
