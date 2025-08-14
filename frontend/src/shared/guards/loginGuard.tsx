import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface LoginGuardProps {
  children: JSX.Element;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    // If user is already logged in, redirect to home
   if (token && currentUser) {  
    return <Navigate to="/home" replace />;
}
    
    // If user is not logged in, allow access to login/register pages
    return children;
};

export default LoginGuard;