import { useState, useEffect, useCallback, useRef } from 'react';

// 通用数据获取 Hook
// 返回 { data, loading, error, refetch, setData }
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const urlRef = useRef(url);

  // 同步 url ref
  urlRef.current = url;

  const fetchData = useCallback(() => {
    if (!urlRef.current) {
      setLoading(false);
      return;
    }

    // 取消上一次请求
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(urlRef.current, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(json => {
        if (!controller.signal.aborted) setData(json);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        if (!controller.signal.aborted) setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [url, fetchData]);

  // 支持手动更新数据（用于乐观更新）
  const updateData = useCallback((updater) => {
    if (typeof updater === 'function') {
      setData(prev => updater(prev));
    } else {
      setData(updater);
    }
  }, []);

  return { data, loading, error, refetch: fetchData, setData: updateData };
}
