import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.baseUrl,
  timeout: 1000 * 60,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default function $api(
  request: AxiosRequestConfig & { token?: string | null }
): any {
  if (request.token) {
    instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${request.token}`;
  }
  return instance(request);
}

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response);
  }
);
