import { User } from '.';

export class UserInfo {
  constructor(public loggedIn: boolean, public user: User, public token: string) {}
}
