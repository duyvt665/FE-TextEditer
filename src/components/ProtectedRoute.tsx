import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = !!Cookies.get('accesstoken');

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return element ;
};

export default ProtectedRoute;
