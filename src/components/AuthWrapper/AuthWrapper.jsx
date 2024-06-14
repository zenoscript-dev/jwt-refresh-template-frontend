import { useEffect, useLayoutEffect, useState } from "react";
import axiosInstance from "../../api/axios";

const AuthWrapper = ({children}) => {
  const [token, setToken] = useState();

  useEffect(() => {
    (async () => {
      try {
        const personalDetails = await axiosInstance.get("auth/me");
        console.log("sfsdfsdffssd", personalDetails)
        if (personalDetails.data.accessToken) {
          setToken(personalDetails.data.accessToken);
        } else {
          setToken(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setToken(null);
        }
      }
    })();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config._retry && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 403 && error.response.data.message === 'Unauthorized' && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axiosInstance.get('refreshToken');
            setToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);

  return (
     <>{children}</>
  );
};

export default AuthWrapper;
