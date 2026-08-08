import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NavBar from './components/commons/NavBar';
import Loading from './components/commons/Loading';
import Footer from './components/commons/Footer';
import Protected from './components/commons/RouteGuardPropia';
import Cookies from './components/commons/Cookies';

import NotFound from './components/pages/NotFound';

import Index from './components/pages/Index';
import Contact from './components/pages/Contact/Contact';
import Login from './components/pages/Login';
import MaintenancePage from './components/pages/MaintenancePage';
import Button from './components/commons/Button';

import WebshellLauncher from './components/pages/Projects/7WebShell/WebshellLauncher';
import AppWebshell from './components/pages/Projects/7WebShell/App-Webshell';
import WebshellStandalone from './components/pages/Projects/7WebShell/WebshellStandalone';


import WikiLayout from './components/pages/Projects/8Wiki/WikiLayout';


import NssBypass from './components/pages/Projects/11NssBypass/NssByspass';
import NssBypassWiki from './components/pages/Projects/11NssBypass/NssBypassWiki';



function App() {

  const location = useLocation();
  const theme = useSelector((state) => state.app.theme);
  const isLoading = useSelector((state) => state.app.isLoading || state.app.loading);
  const isStandaloneRoute = location.pathname === '/webshell/standalone';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('app_theme', theme);
    }
  }, [theme]);

  return (
    <>

      {!isStandaloneRoute && <NavBar />}
      
      <Loading />
      
      <main className={isStandaloneRoute ? "standalone-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<Index isLoading={isLoading} />} />
          <Route path="/contact" element={<Contact isLoading={isLoading} />} />
          <Route path="/login" element={<Login isLoading={isLoading} />} />
        
          <Route
            path="/admin"
            element={
            <Protected>
                <Index isLoading={isLoading} />
              </Protected>
            } />
          

          <Route path="/webshell/launcher" element={<WebshellLauncher isLoading={isLoading} />} />
          <Route path="/webshell" element={<AppWebshell isLoading={isLoading} />} />
          <Route path="/webshell/standalone" element={<WebshellStandalone />} />

          {}
          <Route path="/wg-autoconf/wiki/*" element={<WikiLayout isLoading={isLoading} />} />

          <Route path="/nss-bypass" element={<MaintenancePage isLoading={isLoading} />} />
          <Route path="/nss-bypass/wiki/*" element={<MaintenancePage isLoading={isLoading} />} />

          <Route path="/myLearningCorner" element={<MaintenancePage isLoading={isLoading} />} />

          <Route path="/wiki/*" element={<WikiLayout isLoading={isLoading} />} />

          <Route path="*" element={<NotFound isLoading={isLoading} />} />
        </Routes>
      </main>
       
      {!isStandaloneRoute && <Footer />}
      {!isStandaloneRoute && <Cookies />}
    </>);

}

export default App;