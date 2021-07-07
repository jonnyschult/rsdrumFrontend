import { UserInfo } from '../models';
import getter from './getFetcher';

const userDataFetcher: (token: string) => Promise<UserInfo> = async (token) => {
  try {
    const userData = await getter(token, 'users/getUser');

    return {
      loggedIn: true,
      user: userData.user,
      token: token,
    };
  } catch (errors) {
    console.log(errors);
    return {
      loggedIn: false,
      user: {
        email: '',
        firstName: '',
        lastName: '',
        DOB: '',
        admin: false,
        student: true,
        active: true,
        createdAt: Date.now(),
      },
      token: token,
    };
  }
};

export default userDataFetcher;
