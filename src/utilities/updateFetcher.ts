import APIURL from './environment';
import { Lesson, Assignment, Video, User, Comment, PackageOption } from '../models';
import axios from 'axios';

type Info =
  | Lesson
  | Assignment
  | Video
  | User
  | Comment
  | PackageOption
  | { password: string; newPassword: string }
  | { read: boolean }
  | { id: string }
  | { [key: string]: any };

const updater: (token: string, endPoint: string, info: Info, id?: string) => Promise<any> = async (
  token,
  endPoint,
  info,
  id
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        info,
        id,
      },
    });
    return results.data;
  } catch (error: any) {
    throw error;
  }
};

export default updater;
