export class Patient {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public contactNumber?: string,
    public status?: string,
    public addresses?: Address[]
  ) {}
}

export class Address {
  constructor(
    public id?: number,
    public addressLine1?: string,
    public addressLine2?: string,
    public city?: string,
    public country?: string,
    public postalCode?: string
  ) {}
}
