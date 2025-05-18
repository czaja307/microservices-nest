export class DeleteMealEvent {
  constructor(public readonly id: string) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}
