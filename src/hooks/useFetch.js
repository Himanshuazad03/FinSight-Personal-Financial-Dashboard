"use client";

import { useState } from "react";
import { toast } from "sonner";

export const useFetch = (cb) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await cb(...args);
      if (!result?.success) {
        throw new Error(result?.error || "Something went wrong");
      }
      setData(result);
    } catch (error) {
      setError(error);
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, fn, setData };
};

export default useFetch;
