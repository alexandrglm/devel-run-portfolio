import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WikiSidebar = ({ structure, currentPath, isOpen, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState(
    structure.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <>
      <aside className={`wiki-sidebar ${!isOpen ? 'closed' : ''}`}>
        <div className="wiki-sidebar-header">
          <div className="wiki-brand">
            <span className="wiki-brand-icon">📚</span>
            <span className="wiki-brand-text">wg-autoconf</span>
          </div>
          <span className="wiki-version">v1.0.0-r1</span>
        </div>

        <nav className="wiki-nav">
          <Link to="/wiki" className={`wiki-nav-item ${currentPath === '/wiki' ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            Home
          </Link>

          {structure.map((section) =>
          <div key={section.id} className="wiki-nav-section">
              <button
              className="wiki-nav-section-header"
              onClick={() => toggleSection(section.id)}>
              
                <span className="section-icon">{section.icon}</span>
                <span className="section-title">{section.title}</span>
                <span className={`section-arrow ${expandedSections[section.id] ? 'expanded' : ''}`}>
                  ▶
                </span>
              </button>

              {expandedSections[section.id] &&
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="wiki-nav-children">
              
                  {section.children.map((child) =>
              <Link
                key={child.id}
                to={child.path}
                className={`wiki-nav-child ${currentPath === child.path ? 'active' : ''}`}>
                
                      <span className="child-indent">└──</span>
                      {child.title}
                    </Link>
              )}
                </motion.div>
            }
            </div>
          )}
        </nav>

        <div className="wiki-sidebar-footer">
          <a
            href="https://github.com/alexandrglm/openwrt_wg-autoconf"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-github-link">
            
            <span>🐙</span> GitHub
          </a>
        </div>
      </aside>

      {isOpen &&
      <div className="wiki-overlay" onClick={onToggle} />
      }
    </>);

};

export default WikiSidebar;