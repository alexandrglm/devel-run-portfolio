
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toggleTheme } from '../../store/slices/appSlice';
import { logout } from '../../store/slices/authSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faChevronLeft, faUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import NavBarLogos from './NavBarLogos';




const NAV_LINKS = {
  projects: [
  { name: 'wg-autoconf', path: '/wg-autoconf/wiki' },
  { name: 'OpenWrt NSS Bypass', path: '/nss-bypass/wiki' },
  { name: 'Websocket Shell', path: '/webshell/launcher' },
  { name: 'Anime Pigments', path: '/anime-cel-colours' }]

};

export default function NavBar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.app.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);


  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const [position, setPosition] = useState({ x: window.innerWidth - 60, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  const overlayRef = useRef(null);
  const buttonRef = useRef(null);




  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);




  useEffect(() => {
    setOpen(false);
    setIsProjectsOpen(false);
  }, [location.pathname]);




  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (!mobile) {
        setOpen(false);
      } else {
        setPosition({ x: window.innerWidth - 60, y: 16 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (!open) return;

      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])') || [];
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);




  const handleMouseDown = (e) => {

    if (open) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e) => {
    if (open) return;

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const size = 44;
      const padding = 16;
      const maxX = window.innerWidth - size - padding;
      const maxY = window.innerHeight - size - padding;

      setPosition({
        x: Math.max(padding, Math.min(newX, maxX)),
        y: Math.max(padding, Math.min(newY, maxY))
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;

      const size = 44;
      const padding = 16;
      const maxX = window.innerWidth - size - padding;
      const maxY = window.innerHeight - size - padding;

      setPosition({
        x: Math.max(padding, Math.min(newX, maxX)),
        y: Math.max(padding, Math.min(newY, maxY))
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);




  const handleToggleClick = () => {

    if (isDragging) return;
    setOpen((prev) => !prev);
  };




  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  const handleProjectsToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProjectsOpen((prev) => !prev);
  };




  const menuPosition = {
    left: position.x > window.innerWidth / 2 ? 'auto' : `${position.x + 52}px`,
    right: position.x > window.innerWidth / 2 ? `${window.innerWidth - position.x - 44}px` : 'auto',
    top: position.y > window.innerHeight / 2 ? 'auto' : `${position.y}px`,
    bottom: position.y > window.innerHeight / 2 ? `${window.innerHeight - position.y - 44}px` : 'auto'
  };




  return (
    <nav className={`navbar ${!isVisible ? 'navbar--hidden' : ''}`}>
      
      {}


      {!isMobile &&
      <div className="navbar__desktop">
          <Link to="/" className="navbar__logo-link" aria-label="Home">
            <NavBarLogos isHamburger={false} />
          </Link>
          
          <div className="navbar__links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
            
            <div className="dropdown desktop-dropdown">
              <button
            className="drop-label"
            onClick={handleProjectsToggle}
            aria-expanded={isProjectsOpen}
            aria-haspopup="true">

                Projects
                <span className={`chevron ${isProjectsOpen ? 'open' : ''}`}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </button>
              
              {isProjectsOpen &&
            <div className="dropdown-content" role="menu">
                  {NAV_LINKS.projects.map((link) =>
              <NavLink
              key={link.name}
              to={link.path}
              role="menuitem"
              onClick={() => setIsProjectsOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}>

                      {link.name}
                    </NavLink>)}

                </div>}

            </div>

            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
              Get in Touch
            </NavLink>
            
            {isAuthenticated &&
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                Admin
              </NavLink>}

          </div>
          
          <div className="navbar__right">
            {isAuthenticated &&
          <span className="user-info">
                <FontAwesomeIcon icon={faUser} size="sm" style={{ marginRight: 4 }} />
                {user?.username}
              </span>}

            
            {isAuthenticated ?
          <button onClick={handleLogout}>Logout</button> :

          <Link to="/login">Login</Link>}

            
            <button
          className="theme-toggle"
          aria-label="Toggle theme"
          onClick={() => dispatch(toggleTheme())}>

              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} size="lg" />
            </button>
          </div>
        </div>}


      {}


      {isMobile &&
      <>
          <button
        ref={buttonRef}
        className="navbar__toggle"
        aria-controls="navbar-menu"
        aria-expanded={open}
        onClick={handleToggleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}>

            <img
          src={theme === 'dark' ? '/hamb-dark.png' : '/hamb-light.png'}
          alt="Menu"
          style={{ width: '24px', height: '24px' }} />

          </button>

          {}


          <div
        id="navbar-menu"
        ref={overlayRef}
        className={`navbar__menu${open ? ' navbar__menu--open' : ''}`}
        role="menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        style={{
          display: open ? 'flex' : 'none',
          ...menuPosition
        }}>

            <NavLink to="/" role="menuitem" onClick={() => setOpen(false)}>
              Home
            </NavLink>

            <div className={`dropdown mobile-dropdown ${
          position.x > window.innerWidth / 2 ? 'hamburger-right' : 'hamburger-left'
          }`}>
              <button
            className="drop-label"
            onClick={handleProjectsToggle}
            role="menuitem"
            aria-expanded={isProjectsOpen}>

                {position.x <= window.innerWidth / 2 &&
              <span className="chevron-left">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>}

                <span className="menu-label-text">Projects</span>
                {position.x > window.innerWidth / 2 &&
              <span className="chevron-right">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </span>}

              </button>
              
              {isProjectsOpen &&
            <div className="dropdown-content" role="menu">
                  {NAV_LINKS.projects.map((link) =>
              <NavLink
              key={link.name}
              to={link.path}
              role="menuitem"
              onClick={() => {setOpen(false);setIsProjectsOpen(false);}}>

                      {link.name}
                    </NavLink>)}

                </div>}

            </div>

            <NavLink to="/contact" role="menuitem" onClick={() => setOpen(false)}>
              Get in Touch
            </NavLink>
            
            {isAuthenticated &&
          <NavLink to="/admin" role="menuitem" onClick={() => setOpen(false)}>
                Admin
              </NavLink>}

            
            {isAuthenticated &&
          <span className="user-info">
                <FontAwesomeIcon icon={faUser} size="sm" style={{ marginRight: 4 }} />
                {user?.username}
              </span>}

            
            {isAuthenticated ?
          <button onClick={handleLogout} role="menuitem">
                Logout
              </button> :

          <NavLink to="/login" role="menuitem" onClick={() => setOpen(false)}>
                Login
              </NavLink>}

            
            <button
          className="theme-toggle"
          aria-label="Toggle theme"
          onClick={() => dispatch(toggleTheme())}
          role="menuitem">

              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} size="lg" />
            </button>
          </div>
        </>}

    </nav>);

}