import { useEffect, useState } from 'react';

const useAutoLogout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.clear()
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      const lastInteractionTime = localStorage.getItem('lastInteractionTime');

      // 10 min of saving
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;

      // 10 sec of saving
      const tenSecondsAgo = Date.now() - 10 * 1000; 

      if (parseInt(lastInteractionTime) > tenSecondsAgo) {
        return;
      }
    }

    const resetTimer = () => {
      localStorage.setItem('lastInteractionTime', Date.now());
    };

    const logout = () => {
      setIsLoggedIn(false);
      localStorage.clear();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('email');

      localStorage.removeItem('lastInteractionTime');
    };

    const timeout = setTimeout(() => {
      logout();
    }, 1000 * 60 * 10);

    // 1000 * 60 * 10 is 10 min of activation

    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, []);

  const handleLoginInLocalStorage = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('lastInteractionTime', Date.now());
  };

  return { isLoggedIn, handleLoginInLocalStorage };
};

export default useAutoLogout;
