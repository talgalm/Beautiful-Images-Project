import React from 'react';
import useAutoLogout from './useAutoLogout';

const AutoLogoutWrapper = ({ children }) => {
  useAutoLogout();

  return <>{children}</>;
};

export default AutoLogoutWrapper;
