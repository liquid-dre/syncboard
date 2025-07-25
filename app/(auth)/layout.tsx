import React from 'react';

// Define the type for your component's props
interface AuthLayoutProps {
  children: React.ReactNode; // This explicitly types the 'children' prop
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="flex justify-center pt-20">{children}</div>;
};

export default AuthLayout;