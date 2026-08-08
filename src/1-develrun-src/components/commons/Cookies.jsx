import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCookie, faTimes, faCheck } from './FontAwesome'
import Button from '../../components/commons/Button';



const Cookies = ({ isStandaloneRoute = false }) => {
    const [isVisible, setIsVisible] = useState(false)
    const bannerRef = useRef(null)
    const acceptButtonRef = useRef(null)

    useEffect(() => {
        if (isStandaloneRoute) {
            setIsVisible(false)
            return
        }

        const cookiesAccepted = localStorage.getItem('cookiesAccepted')
        if (cookiesAccepted !== 'true') {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
            
            setTimeout(() => {
                bannerRef.current?.focus()
            }, 100)
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isStandaloneRoute])

    const handleAccept = () => {
        localStorage.setItem('cookiesAccepted', 'true')
        setIsVisible(false)
        document.body.style.overflow = ''
        document.dispatchEvent(new CustomEvent('cookiesAccepted'))
    }

    const handleClose = () => {
        setIsVisible(false)
        document.body.style.overflow = ''
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClose()
            return
        }

        if (e.key === 'Tab') {
            const focusable = bannerRef.current?.querySelectorAll(
                'button, [tabindex]:not([tabindex="-1"])'
            )
            if (!focusable?.length) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
    }

    if (!isVisible) return null

    return (
        <>
            <div className="cookies-overlay" aria-hidden="true" />
            
            <div
                ref={bannerRef}
                className="cookies-banner"
                role="dialog"
                aria-labelledby="cookies-title"
                aria-describedby="cookies-description"
                aria-modal="true"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                <div className="cookies-banner__inner">
                    <div className="cookies-banner__message">
                        <FontAwesomeIcon
                            icon={faCookie}
                            className="cookies-banner__icon"
                            aria-hidden="true"
                        />
                        
                        <div className="cookies-banner__text-group">
                            <span id="cookies-title" className="cookies-banner__title">
                                Cookie Notice
                            </span>
                            
                            <p id="cookies-description" className="cookies-banner__text">
                                This website uses <strong>one essential cookie </strong>to remember your preferences.
                            </p>
                            
                            <span className="cookies-banner__text cookies-banner__text--small">
                                No tracking, advertising or third-party cookies are used.
                            </span>
                        </div>
                    </div>


                    <div className="cookies-banner__actions">
                        <Button
                            className="cookies-banner__button cookies-banner__button--accept"
                            onClick={handleAccept}
                            ariaLabel="Accept cookies and continue"
                        >
                            <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                            Understood
                        </Button>

                        <Button
                            className="cookies-banner__button cookies-banner__button--close"
                            onClick={handleClose}
                            ariaLabel="Close cookie notice"
                        >
                            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
                            Close
                        </Button>
                    </div>

                    
                </div>
            </div>
        </>
    )
}

export default Cookies