import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('user');
  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            username: username,
        });
        console.log(response.data); // Handle successful login response
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
};
  useEffect(()=>(
    handleLogin("user")
  ),[])

  return (
    <div>
      <h1>{t("login")}</h1>
    </div>
  );
};

export default LoginPage;