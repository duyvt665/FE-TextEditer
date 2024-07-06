// useFetchData.ts
import { useState, useEffect, useCallback } from 'react';
import apiService from '../apiService';

function useFetchData(endpoint: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export default useFetchData;
