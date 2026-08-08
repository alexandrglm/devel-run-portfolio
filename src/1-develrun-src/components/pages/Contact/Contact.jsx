import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsLoading, setError } from '../../../store/slices/appSlice';
import axios from 'axios';
import { Icons, faCheckCircle, faExclamationTriangle, faTimes, faArrowLeft } from '../../commons/FontAwesome';
import Button from '../../commons/Button';

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [captchaStatus, setCaptchaStatus] = useState('loading');
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const formRef = useRef(null);
  const modalRef = useRef(null);


  useEffect(() => {
    const isModalMode = location.state?.modal || new URLSearchParams(location.search).get('modal') === 'true';
    setIsModal(isModalMode);
  }, [location]);


  useEffect(() => {
    if (showStatusModal && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])');

      if (focusable.length) {
        setTimeout(() => focusable[0]?.focus(), 100);
      }
    }
  }, [showStatusModal]);


  useEffect(() => {
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }

    const existingScript = document.querySelector('#turnstile-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptReady(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha&render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setCaptchaStatus('error');
    document.head.appendChild(script);

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch (e) {}
      }
    };
  }, []);


  useEffect(() => {
    if (!scriptReady || !window.turnstile || !turnstileRef.current) {
      return;
    }

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      setCaptchaStatus('error');
      return;
    }

    try {
      if (turnstileWidgetId.current) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch (e) {}
      }

      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          setTurnstileToken(token);
          setCaptchaStatus('ok');
        },
        'error-callback': () => {
          setTurnstileToken('');
          setCaptchaStatus('error');
        },
        'expired-callback': () => {
          setTurnstileToken('');
          setCaptchaStatus('loading');
        }
      });

      setCaptchaStatus('loading');
    } catch (error) {
      setCaptchaStatus('error');
    }
  }, [scriptReady]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.name = 'Name is too long (max 50 characters)';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'message':
        if (!value || value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          newErrors.message = 'Message is too long (max 1000 characters)';
        } else {
          delete newErrors.message;
        }
        break;

      default:
        break;}


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }

    if (status) setStatus(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus(null);

    let isValid = true;
    const fields = ['name', 'email', 'message'];
    fields.forEach((field) => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    if (!isValid) {
      const firstError = document.querySelector('.field-error:not(.field-error--hidden)');
      if (firstError) {
        const input = firstError.closest('.form-group')?.querySelector('input, textarea');
        if (input) input.focus();
      }
      return;
    }

    if (!turnstileToken) {
      setCaptchaStatus('error');
      return;
    }

    setIsSubmitting(true);
    dispatch(setIsLoading(true));

    try {
      const response = await axios.post('/api/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        turnstileToken: turnstileToken
      });

      if (response.data.success) {
        setStatus('success');
        setStatusMessage(response.data.message || 'Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setTurnstileToken('');
        setShowStatusModal(true);

        if (turnstileWidgetId.current && window.turnstile) {
          try {
            window.turnstile.reset(turnstileWidgetId.current);
          } catch (e) {}
        }
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage(error.response?.data?.error || 'Something went wrong! Please try again');
      setShowStatusModal(true);
    } finally {
      setIsSubmitting(false);
      dispatch(setIsLoading(false));
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    if (status === 'success') {
      navigate('/');
    }

  };

  const handleClose = () => {
    if (isModal) {
      const closeEvent = new CustomEvent('closeContactModal');
      window.dispatchEvent(closeEvent);
    }
  };

  const handleReset = () => {
    setStatus(null);
    setStatusMessage('');
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTouched({});
    setShowStatusModal(false);
    if (turnstileWidgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetId.current);
      } catch (e) {}
    }
    setTurnstileToken('');
  };


  const formContent =
  <>
            <div className="contact-header">
                <h1 id="contact-title">Get In Touch</h1>
                <p className="contact-subtitle">
                    Have a question or want to collaborate? I'd love to hear from you.
                </p>
            </div>

            <ContactForm
    formData={formData}
    errors={errors}
    touched={touched}
    onChange={handleChange}
    onBlur={handleBlur}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
    turnstileRef={turnstileRef}
    turnstileToken={turnstileToken}
    captchaStatus={captchaStatus}
    formRef={formRef} />

        </>;


  return (
    <>
            <div className="contact-page__inner">
                <div className="contact-content contact-content--page">
                    {formContent}
                </div>
            </div>

            {}
            {showStatusModal &&
      <div
      className="modal-overlay"
      onClick={handleStatusModalClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
      ref={modalRef}>

                    <div
        className="modal contact-status-modal"
        onClick={(e) => e.stopPropagation()}>

                        <button
          className="modal-close"
          onClick={handleStatusModalClose}
          aria-label="Close">

                            <Icons icon={faTimes} aria-hidden="true" />
                        </button>

                        {status === 'success' ?
          <div className="contact-status" role="status" aria-live="polite">
                                <Icons
            icon={faCheckCircle}
            className="status-icon status-icon--success"
            aria-hidden="true" />

                                <h2 id="status-modal-title" className="status-title status-title--success">
                                    Message Sent! 
                                </h2>
                                <p className="status-message">{statusMessage}</p>
                                <p className="status-details">
                                    You will be redirected to the homepage in a moment...
                                </p>
                                <div className="status-action">
                                    <button
              onClick={handleStatusModalClose}
              className="status-button status-button--primary"
              aria-label="Go to homepage">

                                        <Icons icon={faArrowLeft} aria-hidden="true" />
                                        Go to Homepage
                                    </button>
                                </div>
                            </div> :

          <div className="contact-status" role="alert" aria-live="assertive">
                                <Icons
            icon={faExclamationTriangle}
            className="status-icon status-icon--error"
            aria-hidden="true" />

                                <h2 id="status-modal-title" className="status-title status-title--error">
                                    Something Went Wrong
                                </h2>
                                <p className="status-message">{statusMessage}</p>
                                <p className="status-details">
                                    Please check your connection and try again!
                                </p>
                                <div className="status-action">
                                    <button
              onClick={handleStatusModalClose}
              className="status-button status-button--secondary"
              aria-label="Try again">

                                        Try Again
                                    </button>
                                </div>
                            </div>}

                    </div>
                </div>}

        </>);

};




const ContactForm = ({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
  onSubmit,
  isSubmitting,
  turnstileRef,
  turnstileToken,
  captchaStatus,
  formRef
}) => {
  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return '';
    return errors[fieldName] ? 'error' : 'success';
  };

  const getStatusMessage = () => {
    switch (captchaStatus) {
      case 'ok':
        return '✓ Verification complete';
      case 'error':
        return '✗ Please verify you are human';
      case 'loading':
        return '⏳ Loading verification...';
      default:
        return '';}

  };

  return (
    <form
    ref={formRef}
    className="contact-form"
    onSubmit={onSubmit}
    noValidate
    aria-label="Contact form">

            <div className="form-group">
                <label htmlFor="contact-name">
                    Your Name <span className="required" aria-hidden="true">*</span>
                </label>
                <input
        type="text"
        id="contact-name"
        name="name"
        value={formData.name}
        onChange={onChange}
        onBlur={onBlur}
        required
        disabled={isSubmitting}
        placeholder="What should I call you?"
        className={getFieldStatus('name')}
        aria-invalid={errors.name ? 'true' : 'false'}
        aria-describedby="name-error"
        autoComplete="name" />

                <span
        id="name-error"
        className={`field-error ${!errors.name ? 'field-error--hidden' : ''}`}
        role="alert">

                    {errors.name || '\u00A0'}
                </span>
            </div>

            <div className="form-group">
                <label htmlFor="contact-email">
                    Your Email Address <span className="required" aria-hidden="true">*</span>
                </label>
                <input
        type="email"
        id="contact-email"
        name="email"
        value={formData.email}
        onChange={onChange}
        onBlur={onBlur}
        required
        disabled={isSubmitting}
        placeholder="Where can I reach you?"
        className={getFieldStatus('email')}
        aria-invalid={errors.email ? 'true' : 'false'}
        aria-describedby="email-error"
        autoComplete="email" />

                <span
        id="email-error"
        className={`field-error ${!errors.email ? 'field-error--hidden' : ''}`}
        role="alert">

                    {errors.email || '\u00A0'}
                </span>
            </div>

            <div className="form-group form-group--textarea">
                <label htmlFor="contact-message">
                    Your Message <span className="required" aria-hidden="true">*</span>
                </label>
                <textarea
        id="contact-message"
        name="message"
        value={formData.message}
        onChange={onChange}
        onBlur={onBlur}
        required
        disabled={isSubmitting}
        rows={8}
        placeholder="Tell me what's on your mind..."
        className={getFieldStatus('message')}
        aria-invalid={errors.message ? 'true' : 'false'}
        aria-describedby="message-error" />

                <span
        id="message-error"
        className={`field-error ${!errors.message ? 'field-error--hidden' : ''}`}
        role="alert">

                    {errors.message || '\u00A0'}
                </span>
            </div>

            {}
            <div className="captcha-wrapper">
                <div
        className="captcha-container"
        ref={turnstileRef}
        aria-label="CAPTCHA verification" />

                <span
        className={`captcha-status captcha-status--${captchaStatus}`}
        role="status"
        aria-live="polite">

                    {getStatusMessage()}
                </span>
            </div>

            <Button
      type="submit"
      variant="primary"
      size="large"
      className="submit-btn"
      loading={isSubmitting}
      disabled={!turnstileToken}
      aria-busy={isSubmitting}>

                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>);

};

export default Contact;