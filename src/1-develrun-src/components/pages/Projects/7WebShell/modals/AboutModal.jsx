



import React from "react";
import { Icons, faCircleInfo, faGithub } from '../../../../commons/FontAwesome';



const AboutModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
            <div className="auth-overlay" onClick={onClose}></div>
            <div className="auth-container">
            
            <div className="auth-header">
                <div className="info auth-icon">
                <Icons icon={faCircleInfo} />
                </div>
                <h2>About WebShell</h2>
                <p>Secure terminal access for limited servers</p>
            </div>

            <div className="about-content">
                
                <div className="about-section">
                <h3>Project Information</h3>
                <div className="about-info">
                    <span className="info-label">Version:</span>
                    <span className="info-value">v0.1</span>
                </div>

                <div className="about-info">
                    <span className="info-label">License:</span>
                    <span className="info-value">MIT License</span>
                </div>

                <div className="about-info">
                    <span className="info-label">Author:</span>
                    <span className="info-value">@alexandrglm</span>
                </div>

                <div className="about-links">
                    <a href="https://github.com/alexandrglm/websocket-shell-react" target="_blank" rel="noopener noreferrer">
                    <><Icons icon={faGithub} /></>GitHub Repo
                    </a>
                </div>
                
                </div>

                <div className="about-section">
                <h3>Technologies</h3>
                <div className="tech-stack">
                    <div className="tech-category">
                    <strong>Frontend:</strong> React, Redux, IO, SaSS
                    </div>
                    <div className="tech-category">
                    <strong>Backend:</strong> Node, Express, Socket.IO
                    </div>
                </div>
                </div>


            </div>

            <button
        type="button"
        onClick={onClose}
        className="auth-button">

                Close
            </button>
            
            </div>
        </div>);

};

export default AboutModal;