import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.baseUrl,
  timeout: 1000 * 60,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default function $api(request: AxiosRequestConfig) {
  return instance(request);
}

instance.interceptors.request.use(
  // function (config) {
  //   const token = localStorage.getItem("next-auth.token");

  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  //   return config;
  // },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response);
  }
);
