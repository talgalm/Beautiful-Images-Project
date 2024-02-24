import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleUserLogin } from '../services/userService';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('user');

  useEffect(()=>{
    handleUserLogin("user")
    handleUserLogin("user1@example.com")
  },[])

  return (
    <div>
      <h1>{t("login")}</h1>
    </div>
  );
};

export default LoginPage;