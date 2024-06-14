import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// sample usage
// const { data, error, loading, updateApiCall } = useAxiosRequest();
//   useEffect(() => {
//     updateApiCall('https://api.example.com/data', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }, [updateApiCall]);


const useAxiosRequest = (initialUrl = "", initialOptions = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState(initialOptions);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const source = axios.CancelToken.source();

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        cancelToken: source.token,
        ...options,
      });
      setData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [url, options]);

  useEffect(() => {
    if (url) {
      const cancelFetch = fetchData();
      return cancelFetch;
    }
  }, [url, fetchData]);

  const updateApiCall = (newUrl, newOptions = {}) => {
    setUrl(newUrl);
    setOptions(newOptions);
  };

  return { data, error, loading, updateApiCall };
};

export default useAxiosRequest;
