import APIURL from './environment';
import axios from 'axios';

const deleter: (token: string, endPoint: string, query?: string) => Promise<any> = async (
  token,
  endPoint,
  query
) => {
  try {
    const results = await axios({
      url: `${APIURL}/${endPoint}${query ? `?${query}` : ''}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return results.data;
  } catch (error) {
    throw error;
  }
};

export default deleter;
