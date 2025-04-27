export class DeletePaymentEvent {
  constructor(public readonly id: string) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}