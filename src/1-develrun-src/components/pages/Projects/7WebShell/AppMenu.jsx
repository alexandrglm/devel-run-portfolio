


import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setTerminalTheme } from '../../../../store/slices/appSlice';

import THEMES from './TerminalThemes';






















const MENU_ITEMS = [
{ id: 'auth', label: 'Login', action: 'auth' },
{ id: 'session-info', label: 'Session Info', action: 'session-info' },
{ id: 'separator-1', type: 'separator' },
{
  id: 'themes',
  label: 'Themes',
  type: 'submenu',
  items: THEMES.map((theme) => ({
    id: theme.id,
    label: theme.name,
    action: 'theme',
    value: theme.id
  }))
},
{ id: 'separator-2', type: 'separator' },
{ id: 'help', label: 'Help', action: 'help' },
{ id: 'about', label: 'About', action: 'about' },
{ id: 'separator-3', type: 'separator' },
{ id: 'exit', label: 'Exit', action: 'exit' }];





const AppMenu = ({
  isOpen,
  onClose,
  onShowHelp,
  onShowAbout,

  executeCommand,
  setShowAuthForm,
  onLogout
}) => {



  const dispatch = useDispatch();
  const { terminalTheme } = useSelector((state) => state.app);
  const menuRef = useRef(null);

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });






  useEffect(() => {

    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {

        onClose();

      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [isOpen, onClose]);




  useEffect(() => {

    const webshellElement = document.querySelector('.webshell');

    if (webshellElement) {

      webshellElement.setAttribute('data-webshell-theme', terminalTheme || 'default');

    }
  }, [terminalTheme]);






  const handleAction = (action, value = null) => {

    switch (action) {

      case 'auth':
        if (setShowAuthForm) setShowAuthForm(true);
        break;

      case 'session-info':
        if (executeCommand) executeCommand('session');
        break;

      case 'theme':
        dispatch(setTerminalTheme(value));
        break;

      case 'help':
        if (onShowHelp) onShowHelp();
        break;

      case 'about':
        if (onShowAbout) onShowAbout();
        break;

      case 'exit':
        if (onLogout) onLogout();
        break;

      default:
        console.log(`[DEBUG APPMENU] ${action}`, value);
    }
    onClose();
  };



  const handleSubmenuHover = (item, event) => {

    if (item.type === 'submenu' && activeSubmenu !== item.id) {

      const rect = event.target.getBoundingClientRect();

      setSubmenuPosition({
        top: rect.top,
        left: rect.left - 150
      });

      setActiveSubmenu(item.id);



    } else if (item.type !== 'submenu') {

      setActiveSubmenu(null);
    }
  };



  const closeSubmenu = () => {

    setActiveSubmenu(null);

  };





  const renderMenuItem = (item, isSubmenuItem = false) => {

    if (item.type === 'separator') {

      return <div key={item.id} className="app-menu-separator" />;
    }


    const isActive = item.action === 'theme' && item.value === terminalTheme;
    const isSubmenu = item.type === 'submenu';

    return (

      <div
        key={item.id}

        className={`app-menu-item ${isActive ? 'active' : ''} ${isSubmenu ? 'has-submenu' : ''}`}

        onClick={() => {
          if (!isSubmenu && item.action) {
            handleAction(item.action, item.value);
            if (isSubmenuItem) closeSubmenu();
          }
        }}

        onMouseEnter={(e) => {
          if (!isSubmenuItem) {
            handleSubmenuHover(item, e);
          }
        }}>
        
    
        <span className="menu-label">{item.label}</span>
        {}
        {isActive && <span className="active-indicator">X</span>}
      </div>);

  };


  const renderSubmenu = (submenuId) => {

    const submenu = MENU_ITEMS.find((item) => item.id === submenuId);

    if (!submenu || submenu.type !== 'submenu') return null;

    return (

      <div
        className="app-submenu"

        style={{
          position: 'fixed',
          top: submenuPosition.top,
          left: submenuPosition.left,
          zIndex: 1001
        }}


        onMouseLeave={closeSubmenu}>
        
        {submenu.items.map((item) => renderMenuItem(item, true))}
      </div>);

  };







  if (!isOpen) return null;

  return (

    <div className="app-menu-container" ref={menuRef}>
    
      <div className="app-menu" onMouseEnter={closeSubmenu}>
    
        <div className="app-menu-content">
          
          {MENU_ITEMS.map((item) => renderMenuItem(item))}
        
        </div>
    
      </div>
    
      {activeSubmenu && renderSubmenu(activeSubmenu)}
    
    </div>);

};

export default AppMenu;