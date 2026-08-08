
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WikiIndex = ({ structure }) => {
  const sections = [
  {
    id: 'getting-started',
    icon: '🚀',
    title: 'Getting Started',
    description: 'Installation, quick start, and first steps with wg-autoconf',
    path: '/wiki/quick-start',
    color: '#4CAF50'
  },
  {
    id: 'commands',
    icon: '⌨️',
    title: 'Commands Reference',
    description: 'Complete reference of all wg-autoconf commands and options',
    path: '/wiki/config-mgmt',
    color: '#2196F3'
  },
  {
    id: 'advanced',
    icon: '⚡',
    title: 'Advanced Topics',
    description: 'Architecture, state machine, naming conventions, and C modules',
    path: '/wiki/architecture',
    color: '#FF9800'
  },
  {
    id: 'troubleshooting',
    icon: '🔧',
    title: 'Troubleshooting',
    description: 'Common issues, debug commands, and recovery procedures',
    path: '/wiki/common-issues',
    color: '#F44336'
  },
  {
    id: 'reference',
    icon: '📚',
    title: 'Reference',
    description: 'File locations, environment variables, and changelog',
    path: '/wiki/file-locations',
    color: '#9C27B0'
  }];


  return (
    <motion.div
    className="wiki-page-content wiki-index-page"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>📚 wg-autoconf Documentation</h1>
      <p className="wiki-subtitle">
        Complete technical documentation for wg-autoconf - WireGuard Auto-Configuration Tool for OpenWrt
      </p>

      <div className="wiki-index-grid">
        {sections.map((section, index) =>
        <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}>

            <Link to={section.path} className="wiki-index-card">
              <div className="card-icon" style={{ color: section.color }}>
                {section.icon}
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </Link>
          </motion.div>)}

      </div>

      <div className="wiki-quick-links">
        <h2>Quick Links</h2>
        <div className="quick-links-grid">
          <Link to="/wiki/installation" className="quick-link">Installation</Link>
          <Link to="/wiki/quick-start" className="quick-link">Quick Start</Link>
          <Link to="/wiki/interface-control" className="quick-link">Interface Control</Link>
          <Link to="/wiki/routing" className="quick-link">Routing</Link>
          <Link to="/wiki/server-mgmt" className="quick-link">Server Management</Link>
          <Link to="/wiki/changelog" className="quick-link">Changelog</Link>
        </div>
      </div>
    </motion.div>);

};

export default WikiIndex;