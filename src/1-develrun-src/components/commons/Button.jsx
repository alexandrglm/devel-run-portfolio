
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Button = ({

  type = 'button',
  disabled = false,
  loading = false,


  to = null,
  href = null,
  target = null,
  rel = null,

  modal = null,


  className = '',


  ariaLabel = null,
  ariaControls = null,
  ariaExpanded = null,
  ariaHasPopup = null,


  onClick = null,


  children,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled || loading) return;

    if (modal) {
      e.preventDefault();
      navigate(modal.path, {
        state: { modal: true },
        replace: true
      });
      if (onClick) onClick(e);
      return;
    }

    if (onClick) onClick(e);
  };

  const accessProps = {
    'aria-label': ariaLabel || undefined,
    'aria-controls': ariaControls || undefined,
    'aria-expanded': ariaExpanded !== null ? ariaExpanded : undefined,
    'aria-haspopup': ariaHasPopup !== null ? ariaHasPopup : undefined,
    'aria-busy': loading || undefined,
    'aria-disabled': disabled || undefined,
    disabled: disabled || loading,
    type: type
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={className}
        onClick={handleClick}
        {...accessProps}
        {...rest}>
        
                {loading ?
        <>
                        <span className="btn-spinner" aria-hidden="true" />
                        {children}
                    </> :

        children
        }
            </a>);

  }

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        onClick={handleClick}
        {...accessProps}
        {...rest}>
        
                {loading ?
        <>
                        <span className="btn-spinner" aria-hidden="true" />
                        {children}
                    </> :

        children
        }
            </Link>);

  }

  return (
    <button
      className={className}
      onClick={handleClick}
      {...accessProps}
      {...rest}>
      
            {loading ?
      <>
                    <span className="btn-spinner" aria-hidden="true" />
                    {children}
                </> :

      children
      }
        </button>);

};

export default Button;