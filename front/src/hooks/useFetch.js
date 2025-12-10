import { useState } from "react";
import getAxiosInstance from "../lib/axios-config";
import { useEffect } from "react";

function useFetch(url, initialValue = []) {
  const [error, setError] = useState("");
  const [data, setData] = useState(initialValue);
  const [isLoading, setLoading] = useState(false);

  const http = getAxiosInstance();

  async function fetchData() {
    try {
      setLoading(true);
      const res = await http.get(url);
      setData(res.data);
    } catch (error) {
      setError(error.message ?? "Une erreur est survenue!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [URLSearchParams]);

  return {
    data,
    isLoading,
    error,
  };
}

export default useFetch;