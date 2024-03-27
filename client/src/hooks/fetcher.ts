import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<T>(url);
        setData(res.data);
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get<T>(url);
      setData(res.data);
    } catch (e) {
      setError(e as Error);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export const useLastId = (url: string) => {
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setGeneratedId(
          parseInt(res.data[0].next_id).toString().padStart(3, "0")
        );
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url, generatedId]);

  return { generatedId, loading, error };
};
