export class User {
  constructor(
    public email: string,
    public DOB: string,
    public active: boolean,
    public student: boolean,
    public admin: boolean,
    public firstName: string,
    public lastName: string,
    public createdAt?: number,
    public password?: string,
    public id?: string
  ) {}
}
