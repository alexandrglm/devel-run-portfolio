
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsWebshellFullscreen } from '../../../../store/slices/appSlice';
import MarkdownRenderer from '../../../commons/MarkdownRenderer';


import { Icons, faTerminal, faExpand, faDesktop, faKeyboard, faShieldAlt, faRocket, faArrowRight, faBook, faGithub, faServer, faPlay } from '../../../commons/FontAwesome';


import readmeContent from './README.md?raw';
const README_BASE_PATH = '/src/1-develrun-src/components/pages/Projects/7WebShell';

const WebshellLauncher = () => {
  const dispatch = useDispatch();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const openStandalone = () => {
    dispatch(setIsWebshellFullscreen(true));

    const features = [
    'width=1400',
    'height=900',
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'scrollbars=yes',
    'resizable=yes',
    'titlebar=no'].
    join(',');

    window.open(
    '/webshell/standalone',
    '_blank',
    features);

  };

  const cardData = [
  {
    id: 'normal',
    path: '/webshell',
    icon: faTerminal,
    title: 'Integrated WebShell',
    description: 'Access the terminal within the application with full navigation',
    features: [],
    badge: 'Primary',
    badgeColor: 'var(--secondary-color)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'standalone',
    icon: faExpand,
    title: 'Standalone WebShell',
    description: 'Distraction-free popup window for maximum focus',
    features: [],
    badge: 'Fullscreen',
    badgeColor: 'var(--success-color)',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    isButton: true
  }];


  return (
    <div className={`webshell-launcher ${isAnimating ? 'fade-in' : ''}`}>
      
      {}


      <div className="launcher-header">
        <div className="header-icon-wrapper">
          <Icons icon={faRocket} className="header-icon" />
        </div>
        <h1 className="launcher-title">
          <span className="title-gradient">WebShell</span>
          <span className="title-sub">
            Secure WebSocket Terminal component, suitable for free-tier accounts like Render or Heroku,<br /> or any other 
          server implementation with no shell access.
          backend compatible.
          </span>
        </h1>
        <p className="launcher-description">

        </p>
      </div>


            {}


      <div className="launcher-stats">
        <div className="launcher-stats__grid">
          <div className="launcher-stats__item">
            <Icons icon={faKeyboard} className="launcher-stats__icon" />
            <span className="launcher-stats__label">Linux / Windows Server backend compatible</span>
          </div>
          <div className="launcher-stats__item">
            <Icons icon={faShieldAlt} className="launcher-stats__icon" />
            <span className="launcher-stats__label">Secure Authentication</span>
          </div>
          <div className="launcher-stats__item">
            <Icons icon={faDesktop} className="launcher-stats__icon" />
            <span className="launcher-stats__label">Hardened Filtering (Access IP, commands allowed, and more)</span>
          </div>
          <div className="launcher-stats__item">
            <Icons icon={faServer} className="launcher-stats__icon" />
            <span className="launcher-stats__label">Real-time communication</span>
          </div>
        </div>
      </div>

      {}


      


      {}


      <div className="launcher-cta">

        <div className="projects-header">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span>// Try WebShell Demo  </span> 
          </h2>
        </div>

        <div className="launcher-grid">

    
          {cardData.map((card) =>
          <div
          key={card.id}
          className={`launcher-card ${hoveredCard === card.id ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}>

              {card.isButton ?
            <button onClick={openStandalone} className="card-button">
                  <div className="card-content">
                    <div className="card-icon-wrapper" style={{ background: card.gradient }}>
                      <Icons icon={card.icon} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    
                    <ul className="card-features">
                      {card.features.map((feature, idx) =>
                  <li key={idx}>
                          <span className="feature-check">✓</span>
                          {feature}
                        </li>)}

                    </ul>
                    
                    <div className="card-footer">
                      <span className="card-badge" style={{ background: card.badgeColor }}>
                        {card.badge}
                      </span>
                      <span className="card-action">
                        Open <Icons icon={faArrowRight} className="action-icon" />
                      </span>
                    </div>
                  </div>
                </button> :

            <Link to={card.path} className="card-link">
                  <div className="card-content">
                    <div className="card-icon-wrapper" style={{ background: card.gradient }}>
                      <Icons icon={card.icon} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    
                    <ul className="card-features">
                      {card.features.map((feature, idx) =>
                  <li key={idx}>
                          <span className="feature-check">✓</span>
                          {feature}
                        </li>)}

                    </ul>
                    
                    <div className="card-footer">
                      <span className="card-badge" style={{ background: card.badgeColor }}>
                        {card.badge}
                      </span>
                      <span className="card-action">
                        Access <Icons icon={faArrowRight} className="action-icon" />
                      </span>
                    </div>
                  </div>
                </Link>}

            </div>)}

        </div>
      </div>


      {}


      <MarkdownRenderer
      content={readmeContent}
      title="Documentation"
      icon={faBook}
      defaultOpen={false}
      className="launcher-readme"
      basePath={README_BASE_PATH} />


      {}


      {}
































    </div>);

};

export default WebshellLauncher;