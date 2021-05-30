import { axiosWithAuth } from '../auth';
import { baseUrl } from './';

export const signIn = (success, failure, data) => {
  axiosWithAuth()
    .post(`${baseUrl}/api/v1/login`, data)
    .then((response) => success(response))
    .catch((error) => failure(error));
};
