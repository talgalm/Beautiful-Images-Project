import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleLogin } from '../services/userService';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('user');

  useEffect(()=>{
    handleLogin("user")
    handleLogin("user1@example.com")
  },[])

  return (
    <div>
      <h1>{t("login")}</h1>
    </div>
  );
};

export default LoginPage;