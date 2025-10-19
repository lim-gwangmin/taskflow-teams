import axios, { AxiosRequestConfig } from "axios";

type PostData = Record<string, any> | any[] | FormData;

interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: { message: string };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const client = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) => {
    return status >= 200 && status < 501;
  },
});

const contentType = (data: PostData): void => {
  const config: AxiosRequestConfig = {};
  if (data instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
};

const GET = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error("GET Method Error:", error);
    throw error;
  }
};

const POST = async <T>(url: string, data: PostData): Promise<ApiResponse<T>> => {
  try {
    contentType(data);
    const response = await client.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST Method Error:", error);
    throw error;
  }
};

const PUT = async <T>(url: string, data: PostData): Promise<ApiResponse<T>> => {
  try {
    contentType(data);
    const response = await client.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT Method Error:", error);
    throw error;
  }
};

const DELETE = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await client.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE Method Error:", error);
    throw error;
  }
};

export { GET, POST, PUT, DELETE };
