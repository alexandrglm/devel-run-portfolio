import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import ShaderBackground from '../shaders/ShaderBg'
import Button from '../commons/Button'

import { Icons, faHome, faExclamationTriangle, faCompass, faArrowLeft } from '../commons/FontAwesome'

const NotFound = () => {
    const { status } = useSelector(state => state.app)

    return (
        <div className="notfound-page" role="main" aria-labelledby="notfound-title">
            <ShaderBackground 
                style={{ position: 'fixed', inset: 0, zIndex: 1 }}
                breathing={true}
                breathingSpeed={2}
                breathingIntensity={0.03}
                colorShift={true}
                colorShiftSpeed={0.2}
                opacity={0.3}
                blurAmount={4}
            />

            <div className="notfound-content" style={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                    className="notfound-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div 
                        className="notfound-code"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="notfound-code__number">4</span>
                        <motion.span 
                            className="notfound-code__number notfound-code__number--zero"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ delay: 0.5, duration: 0.8, repeat: 2 }}
                        >
                            0
                        </motion.span>
                        <span className="notfound-code__number">4</span>
                    </motion.div>

                    <h1 id="notfound-title" className="notfound-title">
                       The page vanished into the void ...
                    </h1>


                    {status?.message && (
                        <p className="notfound-status">
                            <Icons icon={faExclamationTriangle} aria-hidden="true" />
                            {status.message}
                        </p>
                    )}

                    <div className="notfound-actions">
                        <Button
                            as={Link}
                            to="/"
                            className="notfound-btn notfound-btn--primary"
                            ariaLabel="Go back to homepage"
                        >
                            <Icons icon={faHome} aria-hidden="true" />
                            Take me Home
                        </Button>

                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default NotFound