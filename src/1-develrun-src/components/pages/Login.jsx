import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, clearError } from '../../store/slices/authSlice';

import { Icons, faUser, faLock, faArrowRight, faShieldAlt, faKey } from '../commons/FontAwesome';
import ShaderBackground from '../shaders/ShaderBg';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isUsernameValid = touched.username && form.username.length >= 3;
  const isPasswordValid = touched.password && form.password.length >= 4;

  return (
    <div className="login-page" role="main" aria-labelledby="login-title">
            {}
            <ShaderBackground
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
      breathing={true}
      breathingSpeed={2}
      breathingIntensity={0.03}
      colorShift={true}
      colorShiftSpeed={0.2}
      opacity={0.25}
      blurAmount={4} />


            <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ position: 'relative', zIndex: 2 }}>


                <div className="login-header">
                    
                    <div className="login-icon-wrapper">
                        <Icons icon={faShieldAlt} className="login-icon" />
                    </div>
                    
                    <h1 id="login-title" className="login-title">
                        Panel Access
                    </h1>
                   
                    <p className="login-subtitle">
                        There's nothing amazing behinf this locked door
                    </p>
                </div>


                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    
                    <div className="login-field">
                        
                        <label htmlFor="username" className="login-label">
                            <Icons icon={faUser} aria-hidden="true" />
                            Username
                        </label>
                        
                        <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={loading}
            className={`login-input ${touched.username && (form.username.length >= 3 ? 'valid' : 'invalid')}`}
            aria-invalid={touched.username && form.username.length < 3}
            aria-describedby="username-error"
            autoComplete="username"
            autoFocus />

                        {}




                    </div>

                    <div className="login-field">
                        <label htmlFor="password" className="login-label">
                            <Icons icon={faLock} aria-hidden="true" />
                            Password
                        </label>
                        <div className="login-password-wrapper">
                            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={`login-input ${touched.password && (form.password.length >= 4 ? 'valid' : 'invalid')}`}
              aria-invalid={touched.password && form.password.length < 4}
              aria-describedby="password-error"
              autoComplete="current-password" />

                            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>

                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {touched.password && form.password.length < 4 &&
            <span id="password-error" className="login-error" role="alert">
                                Password requiered
                            </span>}

                    </div>

                    {error &&
          <motion.div
          className="login-error-general"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="alert">

                            <Icons icon={faKey} aria-hidden="true" />
                            {error}
                        </motion.div>}


                    <button
          type="submit"
          className="login-submit"
          disabled={loading || !form.username || !form.password}>

                        {loading ?
            <>
                                <span className="login-spinner" aria-hidden="true" />
                                Authenticating...
                            </> :

            <>
                                Sign In
                                <Icons icon={faArrowRight} aria-hidden="true" />
                            </>}

                    </button>

                    {}


                    <Link to="/" className="login-back">
                        ← Back to Home
                    </Link>
                </form>
            </motion.div>
        </div>);

}