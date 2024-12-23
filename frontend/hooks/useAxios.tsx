import axios, { AxiosInstance } from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const baseURL = "http://localhost:5000/";


const useAxios = () => {
  const $http: AxiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return $http;
};

export default useAxios;
