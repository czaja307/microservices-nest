export class DeleteOrderEvent {
  constructor(public readonly id: string) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}
