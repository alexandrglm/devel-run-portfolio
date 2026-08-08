


import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';


import Terminal from './Terminal';



import '../../../../styles/main.scss';

const AppWebshell = () => {

  const { maintenance, theme, isWebshellFullscreen } = useSelector((state) => state.app);


  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);


  useEffect(() => {
    document.documentElement.setAttribute('data-fullscreen', isWebshellFullscreen);
  }, [isWebshellFullscreen]);


  return (
    <Terminal isStandalone={false} />);

};

export default AppWebshell;