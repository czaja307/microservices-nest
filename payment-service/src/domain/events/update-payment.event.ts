export class UpdatePaymentEvent {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly birthDate?: Date,
    public readonly address?: string,
  ) {}

  static fromJSON(json: string): UpdatePaymentEvent {
    const data = JSON.parse(json);
    return new UpdatePaymentEvent(
      data.id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.birthDate ? new Date(data.birthDate) : undefined,
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
      birthDate: this.birthDate?.toISOString(),
      address: this.address,
    });
  }
}