import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


import Button from '../commons/Button';
import SvgHandler from '../shaders/SvgHandler';


import { Icons } from '../commons/FontAwesome';
import {
  faGithub,
  faLinkedin,
  faReact,
  faNodeJs,
  faPython,
  faJs,
  faJava } from
'../commons/FontAwesome';
import {
  faCode,
  faServer,
  faDatabase,
  faRocket,
  faTerminal,
  faShieldAlt,
  faArrowRight,
  faUser,
  faMicrochip,
  faNetworkWired,
  faBrain,
  faBook,
  faLanguage,
  faTools,
  faHardHat,
  faCogs,
  faSearch,
  faPalette,
  faMobile,
  faGraduationCap,
  faCertificate,
  faUserGraduate,
  faMailBulk } from
'../commons/FontAwesome';

export default function Index() {
  const { theme } = useSelector((state) => state.app);
  const [activeTab, setActiveTab] = useState('about');

  const stats = [
  { label: null, value: null }];














  const featuredProjects = [
  {
    title: 'WebShell React',
    description: 'React-based WebShell for real-time server shell access on Render, Heroku, and related free-tier platforms without native shell access.',
    tech: ['React', 'Socket.IO', 'Redux', 'Node.js'],
    link: '/webshell/launcher',
    icon: faTerminal,
    github: 'websocket-shell-react'
  },
  {
    title: 'OpenWrt WG-Autoconf',
    description: 'Ash CLI tool for automating (multiple) WireGuard setup(s) on OpenWrt devices, easily.',
    tech: ['Shell', 'OpenWrt', 'WireGuard'],
    link: '/wg-autoconf/wiki',
    icon: faNetworkWired,
    github: 'openwrt_wg-autoconf'
  },
  {
    title: 'OpenWrt NSS Bypass',
    description: 'NSS selective bypass tool for OpenWRT firmwares with QualcommAX NSS enabled (tested on ipq807x)',
    tech: ['Shell', 'OpenWrt', 'QualcommAX'],
    link: '/nss-bypass',
    icon: faMicrochip,
    github: 'openwrt_NSS_Bypass_tool'
  }];


  const interests = [
  {
    orderId: 4,
    icon: faNetworkWired,
    label: 'Firewalling & Networking',
    desc: 'Hardening OpenWrt systems, automating WireGuard deployments, and treating routers as development platforms for MIPS and ARM (Lantiq, Broadcom BCM6328, ipq807x)'
  },
  {
    orderId: 7,
    icon: faMicrochip,
    label: 'Embedded & Dev Boards',
    desc: 'Playing with ESP32, Arduino, and anything with a UART. From MicroPython to LVGL (if it has pins xD)  I\'ll probably try to reprogram it'
  },
  {
    orderId: 3,
    icon: faSearch,
    label: 'Reverse Engineering',
    desc: 'Dissecting firmware with Ghidra, mapping TR-069 protocol internals, or understanding how hardware really works under the hood'
  },
  {
    orderId: 8,
    icon: faDatabase,
    label: 'Data Science & BI',
    desc: 'Taking my first steps with Power BI, personal projects modeling Euskadi socioeconomic indicators. Learning R, DAX, and the art of ETL'
  },
  {
    orderId: 6,
    icon: faPalette,
    label: 'Artistic Skills',
    desc: 'Preserving anime cel pigmentation references (STAC, Taiyo Shikisai), documenting colour history. Also playing guitar / bass'
  },
  {
    orderId: 10,
    icon: faMobile,
    label: 'Android Ecosystem',
    desc: 'Keeping old devices alive with GSI ROMs, Magisk modules, and Play Integrity bypasses'
  },
  {
    orderId: 9,
    icon: faTerminal,
    label: 'Shell Scripting & UI',
    desc: 'Creating CLI tools with Ash and Bash, building interactive shell experiences with UI/UX in mind, and turning terminal chaos into order'
  },
  {
    orderId: 2,
    icon: faCode,
    label: 'C & Systems Programming',
    desc: 'Migrating shell tools to C for performance, because sometimes shell isn\'t fast enough, and I like getting closer to the metal'
  },
  {
    orderId: 5,
    icon: faGraduationCap,
    label: 'Learning',
    desc: 'Full Stack Development graduate from Bottega. Currently diving deeper into Data Modeling, JavaSE/Spring, and whatever catches my curiosity'
  },
  {
    orderId: 1,
    icon: faTools,
    label: 'Hardware Tinkering',
    desc: 'Hooking up wires to anything with a serial port, tinkering with dev boards, and treating routers as embedded platforms'
  }];



  const languages = [
  { name: 'Shell', level: 'A+++' },
  { name: 'UML', level: 'A+' },
  { name: 'C++ / C', level: 'B' },
  { name: 'Python', level: 'A+' },
  { name: 'Java SE', level: 'B' },
  { name: 'JavaScript/TypeScript', level: 'A+' },
  { name: 'HTML / CSS / SaSS / JSX', level: 'A+' },
  { name: 'SQL / PromQL', level: 'A' },
  { name: 'R', level: 'B' },
  { name: 'Dax (M)', level: 'B' },
  { name: 'Assembler (for Z80)', level: 'B' }];


  const humanLanguages = [
  { name: 'Basque', level: 'Native' },
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'C1' }];


  return (
    <motion.div
      className="page home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      
      {}
      <section className="hero-section">
        
        <SvgHandler style={{ position: 'fixed', inset: 0, zIndex: 1 }}
        breathing={false}
        rotation={false}
        parallax={true}
        waveBlur={false}
        colorShift={true}
        neonGlow={true}
        opacity={0.5}
        blurAmount={2} />
        
        
        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          {

          }
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            

            
            <h1>
              Alexander Gomez
              <span className="subtitle">5 years programming // 20+ years in Systems & Networking</span>
            </h1>

            {




            }
            
            
            {



            }


          </motion.div>

          <p className="hero-description">
            Mainframe software developer, freelance, focused on Full-Stack <br />
            with a deep, uncompromising affinity for the back-end
          </p>
          <div className="hero-stats">
            {stats.map((stat, idx) =>
            <motion.div
              key={idx}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}>
              
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            )}
          </div>
          
          <div className="hero-actions">
              <Button
              href="https://github.com/alexandrglm"
              target="_blank"
              className="btn-github"
              ariaLabel="Visit my GitHub profile">
              
                  <Icons icon={faGithub} aria-hidden="true" />
                  GitHub
              </Button>
              
              <Button
              modal={{ path: '/contact' }}
              className="btn-contact"
              ariaLabel="Open contact form"
              ariaHasPopup="dialog">
              
                  <Icons icon={faMailBulk} aria-hidden="true" />
                  Get in touch
              </Button>
          </div>
        </div>
      </section>

      {}
      <section className="about-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            
            <h2 className="section-title">
              <span className="title-accent">//</span> A bit of background
            </h2>
            
            <div className="about-grid">
              <div className="about-text">
                  <p>
                      My coding journey began just after I turned <strong>10 years old</strong>, writing <strong>BASIC</strong> on some Z80 derivatives for fun (those old Vtech clones, uhhh, what great times those were).
                      But, if I have one regret, it's not pivoting into a hardware/software engineering career until well
                      into my <strong>30's</strong>.
                  </p>

                  <p>
                      Somewhat chaotic, yet operating within a slightly <strong>OCD-like</strong> framework where almost every single detail of my life is constantly planned, prioritised, managed, and dissected as if it were a <strong>binary tree</strong>.
                  </p>

                  <p>
                      Everything is a draft to me, a learning curve, or an excuse to build simple tools that make my life easier.
                      With an <strong>unconfessed habit of tinkering</strong> with almost any electronic device I can get my hands on, usually trying to reprogram it.
                  </p>
                  <p>
                      Even so, I genuinely wish I had better <strong>SMD</strong> micro-soldering and micro-electronics skills… honestly, I could spend whole days just hooking up wires to any serial port I can find.
                  </p>

                  <p>
                      With no particular charisma but, although I dedicated my education and career to other fields, I never stop striving to <strong>keep learning every day</strong>; not only new programming languages and frameworks, or getting new ways to tinker with devices, but also through learning alongside other developers.<br /><br /> 
                  </p>

                  <h3>This is my goal, my current journey.</h3><br /><h3> And, these are my interests:</h3>
                  
              
                {}
                <div className="interests-grid">
                  {interests.
                  sort((a, b) => (a.orderId || 0) - (b.orderId || 0)).
                  map((interest, idx) =>
                  <div key={idx} className="interest-item">
                        <Icons icon={interest.icon} />
                        <div>
                          <strong>{interest.label}</strong>
                          <span>{interest.desc}</span>
                        </div>
                      </div>
                  )}
                </div>

              </div>

            
              <div className="about-sidebar">
                <div className="info-card">
                  <h3>
                    <Icons icon={faUserGraduate} /> Trainings
                  </h3>
                  <ul>
                    <li>
                      <strong>Java Developer Professional Certificate</strong>
                      <br />
                      <span className="cert-meta">IBM Skills Network · 2026</span>
                    </li>
                    <li>
                      <strong>Full Stack Development Graduate</strong>
                      <br />
                      <span className="cert-meta">Bottega University · 2025</span>
                    </li>
                    <li>
                      <strong>IT Security Auditing & Data Protection (LOPD)</strong>
                      <br />
                      <span className="cert-meta">IFEFOR-CEBEK · 2023</span>
                    </li>
                  </ul>
                </div>

                <div className="info-card">
                  <h3><Icons icon={faBook} /> Currently Learning</h3>
                  <ul>
                    <li>Software Engineering</li>
                    <li>Core Java & Spring Boot</li>
                    <li>Data Structures & Algorithms</li>
                    <li>BI / Data Analytics / Data Science</li>
                    <li>R / DAX </li>
                  </ul>
                </div>

                <div className="info-card">
                  <h3><Icons icon={faTools} /> Currently Working On</h3>
                  <ul>
                    <li>Shell <em>but-UI-based experience</em> tools</li>
                    <li>OpenWrt - QualcommAX drivers dissasembling </li>
                    <li>Node - React "webshell" components</li>
                    <li>Some Wireguard tools for OpenWrt</li>
                    <li>Socioeconomic Indicators in Basque Country data science project</li>
                    <li>Data Modeling - ETL, for PowerBI</li>
                  </ul>
                </div>

                <div className="info-card">
                  <h4>
                    <Icons icon={faCode} />  Languages you can approach me in ...
                  </h4>
                  <div className="language-list">
                    {languages.map((lang, idx) =>
                    <div key={idx} className="language-item">
                        <span className="lang-name">{lang.name}</span>
                        <span className="lang-level">{lang.level}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-card">
                  <h4> ... and the human languages too <Icons icon={faLanguage} /></h4>
                  <div className="language-list">
                    {humanLanguages.map((lang, idx) =>
                    <div key={idx} className="language-item">
                        <span className="lang-name">{lang.name}</span>
                        <span className="lang-level">{lang.level}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {}
      <section className="projects-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            
            <div className="projects-header">
              <h2 className="section-title">
                <span className="title-accent">//</span> Draft Projects
              </h2>
              <a href="https://github.com/alexandrglm" target="_blank" rel="noopener noreferrer" className="view-all">
                Check them in GitHub <Icons icon={faArrowRight} />
              </a>
            </div>

            <div className="projects-grid">
              {featuredProjects.map((project, idx) =>
              <motion.div
                key={idx}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}>
                
                  <div className="project-icon">
                    <Icons icon={project.icon} />
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, tIdx) =>
                  <span key={tIdx} className="tech-tag">{tech}</span>
                  )}
                  </div>
                  <div className="project-links">
                    {project.link && project.link !== '#' &&
                  <Link to={project.link} className="project-link">
                        Try it! <Icons icon={faArrowRight} />
                      </Link>
                  }
                    <a
                    href={`https://github.com/alexandrglm/${project.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link">
                    
                      <Icons icon={faGithub} />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {}
      {










































      }

      
      {}
      <footer className="page-footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-message">
              <span className="footer-icon">⚡</span>
              <span>// everything is a draft, including this site</span>
            </div>
            
            {


























            }
          </div>
        </div>
      </footer>
    </motion.div>);

}