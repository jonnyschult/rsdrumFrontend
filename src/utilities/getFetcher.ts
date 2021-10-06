import APIURL from './environment';
import axios, { CancelTokenSource } from 'axios';

const getter: (
  token: string | null,
  endPoint: string,
  query?: string,
  source?: CancelTokenSource
) => Promise<any> = async (token, endPoint, query, source) => {
  try {
    const result = await axios({
      url: `${APIURL}/${endPoint}${query ? `?${query}` : ''}`,
      cancelToken: source?.token,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return result.data;
  } catch (error: any) {
    throw error;
  }
};

export default getter;
