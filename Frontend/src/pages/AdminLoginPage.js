import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleAdminLogin } from '../services/adminService';
import { useNavigate } from "react-router-dom";


const AdminLoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  function handleAdminLoginHelper(event) {
    event.preventDefault();
    handleAdminLogin(email, password)
      .then((data) => {
        if ( data.message === 'Login successful' && data.token ){
          navigate("/admin")
        }
        else{
          if (data.message === 'Email does not exist')
           console.log(data.message)
        }
      })
  }

  return (
    <div>
      <h1>{t("adminLogin")}</h1>
      <form>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" onClick={handleAdminLoginHelper}> Login </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;