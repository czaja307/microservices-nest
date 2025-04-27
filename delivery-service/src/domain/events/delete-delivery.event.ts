export class DeleteDeliveryEvent {
  constructor(public readonly id: string) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}