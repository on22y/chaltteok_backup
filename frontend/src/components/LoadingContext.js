import React, { createContext, useState } from 'react';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // 로딩 상태 업데이트 함수
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>{children}</LoadingContext.Provider>;
};
