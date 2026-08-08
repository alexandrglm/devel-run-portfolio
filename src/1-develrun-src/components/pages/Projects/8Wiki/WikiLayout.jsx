
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import WikiSidebar from './WikiSidebar';
import WikiSearch from './WikiSearch';
import WikiCommandDemo from './WikiCommandDemo';

import WikiIndex from './pages/WikiIndex';
import Installation from './pages/Installation';
import QuickStart from './pages/QuickStart';
import GettingStarted from './pages/GettingStarted';
import CommandsReference from './pages/CommandsReference';
import InterfaceControl from './pages/InterfaceControl';
import Routing from './pages/Routing';
import ServerManagement from './pages/ServerManagement';
import UtilityCommands from './pages/UtilityCommands';
import Architecture from './pages/Architecture';
import StateMachine from './pages/StateMachine';
import NamingConvention from './pages/NamingConvention';
import CModules from './pages/CModules';
import Troubleshooting from './pages/Troubleshooting';
import DebugCommands from './pages/DebugCommands';
import Recovery from './pages/Recovery';
import Reference from './pages/Reference';
import Changelog from './pages/Changelog';

const WikiLayout = () => {
  const location = useLocation();
  const { theme } = useSelector((state) => state.app);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);




  const wikiStructure = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    icon: '🚀',
    children: [
    { id: 'installation', title: 'Installation', path: '/wiki/installation' },
    { id: 'quick-start', title: 'Quick Start', path: '/wiki/quick-start' },
    { id: 'first-steps', title: 'First Steps', path: '/wiki/first-steps' }]

  },
  {
    id: 'commands',
    title: '⌨️ Commands',
    icon: '⌨️',
    children: [
    { id: 'config-mgmt', title: 'Configuration Management', path: '/wiki/config-mgmt' },
    { id: 'interface-control', title: 'Interface Control', path: '/wiki/interface-control' },
    { id: 'routing', title: 'Routing', path: '/wiki/routing' },
    { id: 'server-mgmt', title: 'Server Management', path: '/wiki/server-mgmt' },
    { id: 'utility', title: 'Utility Commands', path: '/wiki/utility' }]

  },
  {
    id: 'advanced',
    title: '⚡ Advanced',
    icon: '⚡',
    children: [
    { id: 'architecture', title: 'Architecture', path: '/wiki/architecture' },
    { id: 'state-machine', title: 'State Machine', path: '/wiki/state-machine' },
    { id: 'naming', title: 'Naming Convention', path: '/wiki/naming' },
    { id: 'c-modules', title: 'C Modules', path: '/wiki/c-modules' }]

  },
  {
    id: 'troubleshooting',
    title: '🔧 Troubleshooting',
    icon: '🔧',
    children: [
    { id: 'common-issues', title: 'Common Issues', path: '/wiki/common-issues' },
    { id: 'debug', title: 'Debug Commands', path: '/wiki/debug' },
    { id: 'recovery', title: 'Recovery', path: '/wiki/recovery' }]

  },
  {
    id: 'reference',
    title: '📚 Reference',
    icon: '📚',
    children: [
    { id: 'file-locations', title: 'File Locations', path: '/wiki/file-locations' },
    { id: 'changelog', title: 'Changelog', path: '/wiki/changelog' }]

  }];





  const flatPages = wikiStructure.flatMap((section) =>
  section.children.map((page) => ({
    ...page,
    section: section.title,
    sectionId: section.id
  }))
  );




  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const results = flatPages.filter((page) => {
      return searchTerms.every((term) =>
      page.title.toLowerCase().includes(term) ||
      page.id.toLowerCase().includes(term)
      );
    });

    setSearchResults(results);
  };




  const currentPath = location.pathname;
  const currentPage = flatPages.find((p) => p.path === currentPath);




  return (
    <div className="wiki-layout">
      {}
      <WikiSidebar
        structure={wikiStructure}
        currentPath={currentPath}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      

      {}
      <main className={`wiki-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className="wiki-header">
          <div className="wiki-header-left">
            <button
              className="wiki-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar">
              
              ☰
            </button>
            <h1>{currentPage?.title || 'Documentation'}</h1>
          </div>

          <WikiSearch
            value={searchQuery}
            onChange={handleSearch}
            results={searchResults}
            onResultClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }} />
          
        </div>

        <div className="wiki-content">
          <AnimatePresence mode="wait">
            <Routes>
              {

              }
              <Route path="/" element={<WikiIndex structure={wikiStructure} />} />

              {

              }
              <Route path="/installation" element={<Installation />} />
              <Route path="/quick-start" element={<QuickStart />} />
              <Route path="/first-steps" element={<GettingStarted />} />

              {

              }
              <Route path="/config-mgmt" element={<CommandsReference />} />
              <Route path="/interface-control" element={<InterfaceControl />} />
              <Route path="/routing" element={<Routing />} />
              <Route path="/server-mgmt" element={<ServerManagement />} />
              <Route path="/utility" element={<UtilityCommands />} />

              {

              }
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/state-machine" element={<StateMachine />} />
              <Route path="/naming" element={<NamingConvention />} />
              <Route path="/c-modules" element={<CModules />} />

              {

              }
              <Route path="/common-issues" element={<Troubleshooting />} />
              <Route path="/debug" element={<DebugCommands />} />
              <Route path="/recovery" element={<Recovery />} />

              {

              }
              <Route path="/file-locations" element={<Reference />} />
              <Route path="/changelog" element={<Changelog />} />

              {

              }
              <Route path="*" element={<Navigate to="/wiki" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>);

};

export default WikiLayout;