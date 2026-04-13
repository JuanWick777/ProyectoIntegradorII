import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#F5F5F5' }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;

