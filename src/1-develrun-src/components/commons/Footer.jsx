
import React, { useState, useEffect } from 'react';
import { Icons, faGithub } from './FontAwesome';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {

      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 50;

      if (currentScrollY === 0 || isAtBottom) {
        setIsVisible(true);
      } else
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <footer className={`footer ${!isVisible ? 'footer--hidden' : ''}`}>
      <div className="footer-content">
        <a
        href="https://github.com/alexandrglm"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-github">

          Built by <Icons icon={faGithub} /> @alexandrglm
        </a>
      </div>
    </footer>);

};

export default Footer;