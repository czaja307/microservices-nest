export class CreateMealEvent {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly birthDate: Date,
    public readonly address: string,
  ) {}

  static fromJSON(json: string): CreateMealEvent {
    const data = JSON.parse(json);
    return new CreateMealEvent(
      data.id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      new Date(data.birthDate),
      data.address,
    );
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      birthDate: this.birthDate.toISOString(),
      address: this.address,
    });
  }
}
