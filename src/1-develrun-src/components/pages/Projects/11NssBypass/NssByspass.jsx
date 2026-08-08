import React from 'react';

const NssBypass = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👷‍♂️ Under Maintenance</h1>
      <p style={styles.message}>
        We're currently carrying out some improvements to give you a better experience.
        <br />
        We'll be back shortly – please bear with us.
      </p>
      <p style={styles.subMessage}>— The Team</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#333',
    textAlign: 'center',
    padding: '2rem',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.25rem',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  subMessage: {
    marginTop: '2rem',
    fontStyle: 'italic',
    color: '#666',
  },
};

export default NssBypass;