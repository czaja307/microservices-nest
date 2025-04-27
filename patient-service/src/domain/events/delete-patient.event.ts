export class DeletePatientEvent {
  constructor(public readonly id: string) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}