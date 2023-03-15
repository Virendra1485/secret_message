import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.withCredentials = false;
export const setupAxiosInterceptors = () => {
  const onRequestSuccess = (request) => {
    return request;
  };

  const onResponseSuccess = (response) => response;
  
  const onResponseError = async (err) => {
    if (err?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "http://localhost:3000/sign-in"
    }
    if (err.response.status === 401 && !err._retry) {
      err._retry = true;
    }

    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};
