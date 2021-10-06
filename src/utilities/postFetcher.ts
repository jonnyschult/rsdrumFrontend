import APIURL from './environment';
import { Lesson, Assignment, Video, User, Comment, Payment, PackageOption } from '../models';
import axios from 'axios';

type Info =
  | Lesson
  | Assignment
  | Video
  | User
  | Comment
  | Payment
  | PackageOption
  | { quantity: number; packageId: string }
  | { name: string; email: string; subject: string; message: string }
  | { email: string; password: string };

const poster: (token: string, endPoint: string, info: Info, id?: string) => Promise<any> = async (
  token,
  endPoint,
  info,
  id
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}`,
      method: 'POST',
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

export default poster;
