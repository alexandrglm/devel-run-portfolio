
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Terminal from './Terminal';
import { setIsWebshellFullscreen } from '../../../../store/slices/appSlice';
import '../../../../styles/main.scss';

const WebshellStandalone = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.app);


  useEffect(() => {

    dispatch(setIsWebshellFullscreen(true));


    document.documentElement.setAttribute('data-fullscreen', 'true');


    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';


    return () => {
      dispatch(setIsWebshellFullscreen(false));
      document.documentElement.removeAttribute('data-fullscreen');

      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [dispatch]);


  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <Terminal isStandalone={true} />;
};

export default WebshellStandalone;